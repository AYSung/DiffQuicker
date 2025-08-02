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
  total: {
    type: Number,
    required: true,
  },
  showPercent: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div class="count">
    <h3>{{ label }}</h3>
    <div style="display: flex; align-items: center; gap: 0.6em;">
        <h1 class="green">{{ count }} </h1>
        <h3 v-if="showPercent">({{ total > 0 ? Math.round(count / total * 100) : 0 }}%)</h3>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
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

.count {
    border-left: 1px solid lightgrey;
    padding-left: 1em;
    width: 20%;
}

.greetings h1,
.count h3 {
text-align: left;
}
</style>
