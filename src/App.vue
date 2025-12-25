<template lang="pug">
el-container.app-layout
  el-header
    | Header
  el-main
    router-view
  el-footer
    | Footer
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}
</style>
