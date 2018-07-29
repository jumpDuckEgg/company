<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
     <navbar style="position: fixed;
    top: 0;
    left: 0;
    width:100%;z-index:1000"></navbar>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container" style="margin-top:50px;">
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from '@/views/layout/components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
