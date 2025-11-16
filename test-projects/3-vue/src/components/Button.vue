<template>
  <button class="btn">
    <slot>Click me</slot>
  </button>
</template>

<script>
export default {
  name: 'Button'
}
</script>

<style scoped>
.btn {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
