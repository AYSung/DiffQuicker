<script setup>
import { reactive, computed, ref } from 'vue';
import CellCount from './components/CellCount.vue';
import TotalCount from './components/TotalCount.vue';
import Report from './components/Report.vue';


const KEYMAP = {
  'KeyQ': 'blast',
  'KeyW': 'promyelocyte',
  'KeyE': 'myelocyte',
  'KeyR': 'metamyelocyte',
  'KeyA': 'erythroid',
  'KeyS': 'monocyte',
  'KeyD': 'lymphocyte',
  'KeyF': 'neutrophil',
  'KeyZ': 'other',
  'KeyX': 'basophil',
  'KeyC': 'plasma cell',
  'KeyV': 'eosinophil'
}

const counter = reactive({
  'blast': 0,
  'promyelocyte': 0,
  'myelocyte': 0,
  'metamyelocyte': 0,
  'erythroid': 0,
  'monocyte': 0,
  'lymphocyte': 0,
  'neutrophil': 0,
  'other': 0,
  'basophil': 0,
  'plasma cell': 0,
  'eosinophil': 0,
})
const mode = ref('peripheral blood')
const showPercent = ref(false)
const targetCount = ref(200)


function clickAudio() {
  new Audio('./src/assets/click.mp3').play()
}

function blipAudio() {
  new Audio('./src/assets/blip.mp3').play()
}

function increment(cell_type) {
  if (totalCount.value < targetCount.value) {
    counter[cell_type]++
    clickAudio()
  }

  if (totalCount.value == targetCount.value) {
    blipAudio()
  }
}

function decrement(cell_type) {
  if (counter[cell_type] > 0) {
    counter[cell_type]--
    clickAudio()
  }
}

function resetCount() {
  for (let key in counter) { counter[key] = 0 }
}

function toggleMode() {
  mode.value = (mode.value == 'peripheral blood') ? 'bone marrow' : 'peripheral blood'
  targetCount.value = (mode.value == 'peripheral blood') ? 200 : 300
}

function togglePercent() {
  showPercent.value = !showPercent.value
}

function addTargetCount(inc) {
  targetCount.value += inc
}

const totalCount = computed(() => {
  let sum = Object.values(counter).reduce((a, b) => a + b, 0)
  return (mode.value == 'peripheral blood') ? sum - counter.erythroid : sum
})

addEventListener("keydown", (event) => {
  if (event.shiftKey && event.code in KEYMAP) { decrement(KEYMAP[event.code]) }
  else if (!(event.ctrlKey || event.metakey || event.altKey || event.shiftKey) && event.code in KEYMAP) { increment(KEYMAP[event.code]) }
})

</script>

<template>
  <header>
    <div>
      <h1>DiffQuicker</h1>
      <TotalCount :count="totalCount" :targetCount="targetCount" />
      <label>adjust target cell count </label>
      <button class="minus" @click="addTargetCount(-100)" :disabled="targetCount <= 100">-</button>
      <button class="plus" @click="addTargetCount(100)" :disabled="targetCount >= 500">+</button>
      <!-- <progress :value="totalCount" :max="targetCount" style="accent-color: hsla(160, 100%, 37%, 1);"></progress> -->
    </div>
    <div style="display: flex; gap: 1em; margin-bottom: 1rem;">
      <h3>mode: {{ mode }}</h3>
      <button @click="toggleMode">switch mode</button>
    </div>
  </header>
  <main>
    <div style="display: flex; justify-content: end; gap: 1rem; margin-bottom: 2em;">
      <button class="reset-count" @click="resetCount">reset count</button>
      <button class="show-percent" @click="togglePercent">{{ showPercent ? 'hide percent' : 'show percent' }}</button>
    </div>
    <div class="count_grid">
      <CellCount v-for="[cell_type, count] in Object.entries(counter)" :label="cell_type + 's'" :count="count"
        :total="totalCount" :showPercent="showPercent" />
    </div>
  </main>
  <div>
    <Report :mode="mode" :cellsCounted="totalCount" :counter="counter" />
  </div>
  <footer>made by Andrew Y. Sung (last updated August 2025)</footer>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

h1 {
  font-size: 3rem;
}

button.minus {
  border-top-right-radius: 0rem;
  border-bottom-right-radius: 0rem;
  border-right-width: 2px;
  margin-right: 0.05rem;
  padding: 0.2rem;
}

button.plus {
  border-top-left-radius: 0rem;
  border-bottom-left-radius: 0rem;
  margin-left: 0.05rem;
  padding: 0.2rem;
}

button.show-percent {
  width: 140px;
}

button.reset-count {
  background-color: rgb(196, 178, 20);
}

footer {
  position: absolute;
  bottom: 10px;
}

.count_grid {
  line-height: 1.5;
  display: grid;
  grid-template-columns: repeat(4, 175px);
  margin: 0.5rem 0rem;
  /* flex-wrap: wrap; */
  /* justify-content: end; */
  /* column-gap: 2em; */
  /* width: 840px; */
}

/* @media (min-width: 1024px) {
  header h1 {
    font-size: 3rem;
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }


} */
</style>
