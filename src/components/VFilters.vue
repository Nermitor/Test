<template lang="pug">
el-dialog(
  v-model="visible"
  title="Фильтры"
  width="400px"
)
  el-form
    el-form-item(label="Год")
      div.v-filters__slider-wrapper
        span.v-filters__slider-value {{ props.filterParams?.year?.[0] ?? '' }}
        el-slider(
          v-model="filters.year"
          :min="props.filterParams?.year?.[0]"
          :max="props.filterParams?.year?.[1]"
          range
          :step="1"
        )
        span.v-filters__slider-value {{ props.filterParams?.year?.[1] ?? '' }}
    el-form-item(label="Язык")
      el-select(
        v-model="filters.language"
        clearable
        style="width: 100%"
      )
        el-option(
          v-for="lang in props.filterParams?.languages ?? []"
          :key="lang.value"
          :label="lang.label"
          :value="lang.value"
        )
    el-form-item(label="Издательство")
      el-select(
        v-model="filters.publisher"
        clearable
        filterable
        style="width: 100%"
      )
        el-option(
          v-for="pub in props.filterParams?.publishers ?? []"
          :key="pub"
          :label="pub"
          :value="pub"
        )
    el-form-item(label="Страниц")
      div.v-filters__slider-wrapper
        span.v-filters__slider-value {{ props.filterParams?.pages?.[0] ?? '' }}
        el-slider(
          v-model="filters.pages"
          :min="props.filterParams?.pages?.[0]"
          :max="props.filterParams?.pages?.[1]"
          range
          :step="1"
        )
        span.v-filters__slider-value {{ props.filterParams?.pages?.[1] ?? '' }}
    el-form-item(label="Читателей")
      div.v-filters__slider-wrapper
        span.v-filters__slider-value {{ props.filterParams?.readers?.[0] ?? '' }}
        el-slider(
          v-model="filters.readers"
          :min="props.filterParams?.readers?.[0]"
          :max="props.filterParams?.readers?.[1]"
          range
          :step="100"
        )
        span.v-filters__slider-value {{ props.filterParams?.readers?.[1] ?? '' }}
  template(#footer)
    el-button(@click="onReset") Сбросить
    el-button(type="primary" @click="onApply") Применить
</template>

<script setup lang="ts">
import type { FilterParamsType } from '@/types'

type Props = {
  filterParams: FilterParamsType | null
}

const props = defineProps<Props>()

const visible = defineModel<boolean>({ required: true })
const filters = defineModel<FilterParamsType>('filters', { required: true })

const emit = defineEmits<{
  apply: []
}>()

const onReset = () => {
  if (props.filterParams) {
    filters.value = {
      year: props.filterParams.year,
      pages: props.filterParams.pages,
      readers: props.filterParams.readers,
      language: undefined,
      publisher: undefined,
    }
  }
  emit('apply')
  visible.value = false
}

const onApply = () => {
  emit('apply')
  visible.value = false
}
</script>

<style scoped>
.v-filters__slider-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.v-filters__slider-value {
  min-width: 50px;
  text-align: center;
  font-size: 14px;
  color: var(--el-text-color-regular);
}
</style>
