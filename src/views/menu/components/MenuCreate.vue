<template>
  <div class="menu-create">
    <!-- 引入表格（公共组件） -->
    <create-or-edit></create-or-edit>
  </div>
</template>

<script>

import CreateOrEdit from './CreateOrEdit'
export default {
  name: 'MenuCreate',
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped>

</style>
