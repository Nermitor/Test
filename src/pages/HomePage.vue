<template lang="pug">
  .home-page
    .container
      .home-page__content
        .home-page__search
          el-input(v-model="search" type="search" @keydown.enter="onSearchClick")
          el-button(@click="onSearchClick")
            el-icon
              Search

          el-button.home-page__filter-button(@click="showFilters = true")
            el-icon
              Filter
            span.home-page__filter-badge(v-if="hasActiveFilters")
        .home-page__sort
          div Сортировка:
          el-select(v-model="sort" @change="onSortChange")
            el-option(
              v-for="option in sortOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value")
        .home-page__cards(v-loading="loading")
          v-book-card(v-for="book in data" :key="book.id" :book="book" )
        .home-page__pagination
          el-pagination(v-model:current-page="page" @change="onPageChange" layout="prev, pager, next" :total="pagesCount")
      v-filters(
        v-model="showFilters"
        v-model:filters="filters"
        :filter-params="defaultFilterParams"
        @apply="onFiltersApply"
      )
</template>

<script setup lang="ts">
import { type LocationQueryRaw, useRoute, useRouter } from 'vue-router'
import { computed, onBeforeMount, ref, watch } from 'vue'

import type { BookCardType, FilterParams, Option } from '@/types'
import { booksMockApi, filtersMockApi, optionsMockApi } from '@/mocks'
import { isRangeDifferent, parseRange } from '@/utils'

const route = useRoute()
const router = useRouter()

const search = ref((route.query.search as string) ?? '')
const page = ref(Number(route.query.page) || 1)
const sort = ref((route.query.sort as string) ?? 'readers_desc')

const filters = ref<FilterParams>({
  year: parseRange(route.query.year as string | undefined),
  pages: parseRange(route.query.pages as string | undefined),
  readers: parseRange(route.query.readers as string | undefined),
  language: (route.query.language as 'RU' | 'EN') || undefined,
  publisher: (route.query.publisher as string) || undefined,
})

const data = ref<BookCardType[]>()
const sortOptions = ref<Option[]>([])
const pagesCount = ref<number>()
const defaultSort = ref<string>()
const showFilters = ref(false)
const defaultFilterParams = ref<FilterParams | null>(null)
const loading = ref(false)
const filtersApplied = ref(false)

const hasActiveFilters = computed(() => {
  if (!defaultFilterParams.value) return false

  const ranges = [
    {
      current: parseRange(route.query.year as string | undefined),
      default: defaultFilterParams.value.year,
    },
    {
      current: parseRange(route.query.pages as string | undefined),
      default: defaultFilterParams.value.pages,
    },
    {
      current: parseRange(route.query.readers as string | undefined),
      default: defaultFilterParams.value.readers,
    },
  ]

  if (ranges.some((r) => isRangeDifferent(r.current, r.default))) return true
  return !!(route.query.language || route.query.publisher)
})

const onSearchClick = async () => {
  updateQuery({
    search: search.value || null,
    page: null,
  })
  await fetchData()
}

const onPageChange = async (value: number) => {
  updateQuery({ page: value === 1 ? null : value })
  await fetchData()
}

const onSortChange = async (value: string) => {
  page.value = 1
  sort.value = value
  updateQuery({
    sort: value === defaultSort.value ? null : value,
    page: null,
  })
  await fetchData()
}

const onFiltersApply = async () => {
  filtersApplied.value = true
  page.value = 1

  const query: LocationQueryRaw = {}
  const rangeFields = [
    { key: 'year', value: filters.value.year, default: defaultFilterParams.value?.year },
    { key: 'pages', value: filters.value.pages, default: defaultFilterParams.value?.pages },
    { key: 'readers', value: filters.value.readers, default: defaultFilterParams.value?.readers },
  ]

  rangeFields.forEach(({ key, value, default: defaultValue }) => {
    query[key] = isRangeDifferent(value, defaultValue) && value ? `${value[0]},${value[1]}` : null
  })

  query.language = filters.value.language || null
  query.publisher = filters.value.publisher || null

  updateQuery({ ...query, page: null })
  await fetchData()
}

const updateQuery = (newQuery: LocationQueryRaw) => {
  const query = { ...route.query } as LocationQueryRaw

  Object.entries(newQuery).forEach(([key, value]) => {
    if (value == null || value === '') {
      delete query[key]
    } else {
      query[key] = value
    }
  })

  router.replace({ query })
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await booksMockApi.fetchBooks({
      page: page.value,
      limit: 10,
      sort: sort.value,
      search: search.value,
      filters: filters.value,
    })
    data.value = response.books
    pagesCount.value = response.total
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    setTimeout(() => (loading.value = false), 400)
  }
}

const fetchOptions = async () => {
  try {
    sortOptions.value = await optionsMockApi.fetchOptions()
    defaultSort.value = sortOptions.value[0]?.value
  } catch (error) {
    console.error('Failed to fetch options:', error)
  }
}

const fetchFilterParams = async () => {
  try {
    defaultFilterParams.value = await filtersMockApi.fetchFilterParams()
  } catch (error) {
    console.error('Failed to fetch filter params:', error)
  }
}

const restoreFiltersFromQuery = () => {
  filters.value = {
    year: parseRange(route.query.year as string | undefined),
    pages: parseRange(route.query.pages as string | undefined),
    readers: parseRange(route.query.readers as string | undefined),
    language: (route.query.language as 'RU' | 'EN') || undefined,
    publisher: (route.query.publisher as string) || undefined,
  }
}

watch(showFilters, (newValue) => {
  if (newValue) {
    filtersApplied.value = false
  } else {
    if (!filtersApplied.value) {
      restoreFiltersFromQuery()
    }
    filtersApplied.value = false
  }
})

onBeforeMount(async () => {
  await fetchFilterParams()
  await fetchOptions()
  await fetchData()
})
</script>

<style scoped>
.home-page__search {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.home-page__search .el-button {
  margin-left: 0;
}

.home-page__filter-button {
  position: relative;
}

.home-page__filter-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background-color: #f56c6c;
  border-radius: 50%;
}

.home-page__cards {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: 40px;
  min-height: 200px;
  position: relative;
}

.home-page__pagination {
  display: flex;
  justify-content: center;
}

.home-page__sort {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 40px;
  max-width: 350px;
}
</style>
