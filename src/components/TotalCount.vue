<script setup>
defineProps({
  count: {
    type: Number,
    required: true,
  },
  targetCount: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="count">
    <h3>cells counted</h3>
    <div style="display: flex; align-items: center; gap: 0.2rem;">
      <h1 class="green">{{ count }}</h1>
      <h3>of {{ targetCount }}</h3>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 3rem;
  position: relative;
  top: -10px;

}

h3 {
  font-size: 1.2rem;
}
</style>
