<template>
<div class="page home">{{message}}</div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      message: 'home!'
    }
  }
}
</script>

<style lang="scss" scoped>
.page{background-color: aqua;}
</style>