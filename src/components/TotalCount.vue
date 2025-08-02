<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="count">
    <h3>cells counted</h3>
    <div style="display: flex; align-items: center; gap: 0.6em;">
        <h1 class="green">{{ count }}</h1>
        <h3>of 300</h3>
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

.greetings h1,
.greetings h3 {
  text-align: center;
}


.greetings h1,
.count h3 {
text-align: left;
}
</style>
