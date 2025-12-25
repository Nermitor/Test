<template lang="pug">
el-card(shadow="hover")
  template(#header) {{ props.book.title }}
  div
    div Автор: {{ props.book.author }}
    div Издательство: {{ props.book.publisher }}
    div Год: {{ props.book.year }}, Страниц: {{ props.book.pages }}
    div Язык: {{ props.book.language }}
    div {{ props.book.description }}
    div Читателей: {{ props.book.readers }}
</template>

<script setup lang="ts">
import type { BookCardType } from '@/types/BookCard.ts'

type Props = {
  book: BookCardType
}

const props = defineProps<Props>()
</script>
