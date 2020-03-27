<style lang="scss" scoped>
.redirect-parent {
  /* 50= navbar  50  */
  height: calc(100vh - 200px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>

<template>
  <section class="redirect-parent">
    <router-view/>
  </section>
</template>