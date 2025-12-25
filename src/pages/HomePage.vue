<template lang="pug">
  .home-page
    .container
      .home-page__content
        .home-page__search
          el-input(v-model="search" type="search" @keydown.enter="onSearchClick")
          el-button(@click="onSearchClick")
            el-icon
              Search

          el-button(@click="onFilterClick")
            el-icon
              Filter
        .home-page__sort
          div Сортировка:
          el-select(v-model="sort" @change="onSortChange")
            el-option(
              v-for="option in sortOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value")
        .home-page__cards
          transition-group
            book-card(v-for="book in data" :key="book.id" :book="book" )
        .home-page__pagination
          el-pagination(v-model:current-page="page" @change="onPageChange" layout="prev, pager, next" :total="pagesCount")
</template>

<script setup lang="ts">
import { type LocationQueryRaw, useRoute, useRouter } from 'vue-router'
import { onBeforeMount, ref } from 'vue'

import type { BookCardType } from '@/types/BookCard.ts'
import { booksMockApi } from '@/mocks/booksMockApi.ts'
import { optionsMockApi } from '@/mocks/optionsMockApi.ts'
import BookCard from '@/components/BookCard.vue'

type Option = {
  value: string
  label: string
}

const route = useRoute()
const router = useRouter()

const search = ref((route.query.search as string) ?? '')
const page = ref(Number(route.query.page) || 1)
const sort = ref((route.query.sort as string) ?? 'readers_desc')

const data = ref<BookCardType[]>()
const sortOptions = ref<Option[]>([])
const pagesCount = ref<number>()
const defaultSort = ref<string>()

const onSearchClick = async () => {
  updateQuery({
    search: search.value == '' ? null : search.value,
    page: null,
  })

  await fetchData()
}

const onPageChange = async (value: number) => {
  updateQuery({
    page: value == 1 ? null : value,
  })

  await fetchData()
}

const onSortChange = async (value: string) => {
  sort.value = value
  updateQuery({
    sort: value == defaultSort.value ? null : value,
  })

  await fetchData()
}

const updateQuery = (newQuery: LocationQueryRaw) => {
  const query = { ...route.query } as LocationQueryRaw

  Object.entries(newQuery).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      delete query[key]
    } else {
      query[key] = value
    }
  })

  router.replace({ query })
}

const fetchData = async () => {
  const response = await booksMockApi.fetchBooks({
    page: page.value,
    limit: 10,
    sort: sort.value,
    search: search.value,
  })

  data.value = response.books
  pagesCount.value = response.total
}

const fetchOptions = async () => {
  sortOptions.value = await optionsMockApi.fetchOptions()
  defaultSort.value = sortOptions.value[0]?.value
}

onBeforeMount(async () => {
  await fetchData()
  await fetchOptions()
})
</script>

<style scoped>
.home-page__search {
  display: flex;
  column-gap: 20px;
  margin-bottom: 20px;
}

.home-page__search .el-button {
  margin-left: 0;
}

.home-page__cards {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: 40px;
}

.home-page__pagination {
  display: flex;
  justify-content: center;
}

.home-page__sort {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-bottom: 40px;
  max-width: 350px;
}
</style>
