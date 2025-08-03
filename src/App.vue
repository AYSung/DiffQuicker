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
  resetTargetCount()
}

function resetTargetCount() {
  targetCount.value = (mode.value == 'peripheral blood') ? 200 : 300
}

function toggleMode() {
  mode.value = (mode.value == 'peripheral blood') ? 'bone marrow' : 'peripheral blood'
  resetTargetCount()
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
    </div>
  </header>
  <main>
    <div class="button-controls">
      <button class="mode" @click="toggleMode">mode: {{ mode }}</button>
      <div>
        <button class="minus" @click="addTargetCount(-100)" :disabled="(targetCount <= 100) || (totalCount > (targetCount - 100))">-</button>
        <button class="target-count">cells</button>
        <button class="plus" @click="addTargetCount(100)" :disabled="targetCount >= 500">+</button>
      </div>
      <button class="show-percent" @click="togglePercent">{{ showPercent ? 'hide percent' : 'show percent' }}</button>
      <button class="reset-count" @click="resetCount">reset</button>
    </div>
    <div class="count_grid">
      <CellCount v-for="[cell_type, count] in Object.entries(counter)" :label="cell_type + 's'" :count="count"
        :total="totalCount" :showPercent="showPercent" />
    </div>
    <Report v-if="totalCount >= targetCount" :mode="mode" :cellsCounted="totalCount" :counter="counter" />
  </main>
  <footer>made by Andrew Y. Sung (last updated August 2025)</footer>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

h1 {
  font-size: 3rem;
}

button.minus {
  border-top-right-radius: 0rem;
  border-bottom-right-radius: 0rem;
  width: 2rem;
  padding-left: 0.9rem;
}

button.plus {
  border-top-left-radius: 0rem;
  border-bottom-left-radius: 0rem;
  width: 2rem;
  padding-left: 0.7rem;
}

button.target-count {
  background-color: hsla(160, 100%, 37%, 1);
  color: black;
  font-size: 1rem;
  text-align: center;
  border-radius: 0;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

button.show-percent {
  width: 140px;
}

button.mode {
  width: 220px;
}

button.reset-count {
  background-color: rgb(196, 178, 20);
}

div.button-controls {
  display: flex;
  justify-content: end;
  margin-bottom: 2rem;
  gap: 1rem;
  width: 700px;
}

div.button-controls>*:nth-child(3) {
  margin-right: auto;
}

.count_grid {
  line-height: 1.5;
  display: grid;
  grid-template-columns: repeat(4, 175px);
  margin-bottom: 2rem;
}

footer {
  margin-top: auto;
  padding-top: 4rem;
  text-align: center;
}
</style>
