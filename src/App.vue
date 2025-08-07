<script setup>
import { reactive, computed, ref } from 'vue';
import CellCount from './components/CellCount.vue';
import TotalCount from './components/TotalCount.vue';
import Report from './components/Report.vue';
import AboutModal from './components/AboutModal.vue';


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
const count_history = reactive([])

const mode = ref('peripheral blood')
const showPercent = ref(false)
const showReport = ref(false)
const targetCount = ref(200)

function clickAudio() {
  const audio = new Audio('./click.mp3')
  audio.volume = 0.2
  audio.play()
}

function blipAudio() {
  const audio = new Audio('./blip.mp3')
  audio.volume = 0.4
  audio.play()
}

function increment(cell_type) {
  if (totalCount.value < targetCount.value) {
    counter[cell_type]++
    count_history.push(cell_type)
    clickAudio()
  }

  if (totalCount.value == targetCount.value) {
    blipAudio()
  }
}

function decrement(cell_type) {
  if (counter[cell_type] > 0) {
    counter[cell_type]--
    count_history.splice(count_history.lastIndexOf(cell_type), 1)
    clickAudio()
  }
}

function resetCount() {
  for (let key in counter) { counter[key] = 0 }
  count_history.length = 0
  resetTargetCount()
}

function resetTargetCount() {
  targetCount.value = (mode.value == 'peripheral blood') ? 200 : 300
}

function toggleMode() {
  mode.value = (mode.value == 'peripheral blood') ? 'bone marrow' : 'peripheral blood'
  resetTargetCount()
}

function addTargetCount(inc) {
  targetCount.value += inc
  if (targetCount.value < totalCount.value) {
    roundCount(targetCount)
  }
}

function roundCount(targetCount) {
  while (totalCount.value > targetCount.value) {
    counter[count_history.pop()]--
  }
}

const totalCount = computed(() => {
  return (mode.value == 'peripheral blood') ? count_history.filter((x) => x != 'erythroid').length : count_history.length
})

const roundDown = computed(() => {
  return ((targetCount.value > 100) && (totalCount.value > targetCount.value - 100)) ? "minus round-down" : "minus"
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
      <AboutModal />
    </div>
  </header>
  <main>
    <div class="button-controls">
      <button class="mode" @click="toggleMode">mode: {{ mode == 'peripheral blood' ? 'PB' : 'BM' }}</button>
      <div>
        <button :class="roundDown" @click="addTargetCount(-100)" :disabled="targetCount <= 100">-</button>
        <button class="target-count">cells</button>
        <button class="plus" @click="addTargetCount(100)" :disabled="targetCount >= 500">+</button>
      </div>
      <button class="show-percent" @click="showPercent = !showPercent">{{ showPercent ? 'hide' : 'show'
      }} %</button>
      <button v-if="totalCount < targetCount" @click="showReport = !showReport">{{ showReport ? 'hide' : 'show' }}
        report</button>
      <button class="reset-count" @click="resetCount">reset</button>
    </div>
    <div class="count-grid">
      <CellCount v-for="[cell_type, count] in Object.entries(counter)" :label="cell_type + 's'" :count="count"
        :total="totalCount" :showPercent="showPercent" />
    </div>
    <Report v-if="showReport || (totalCount >= targetCount)" :mode="mode" :cellsCounted="totalCount"
      :counter="counter" />
  </main>
  <footer>by Andrew Y. Sung (last updated August 2025)</footer>
</template>

<style scoped>
header {
  position: relative;
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

button.round-down {
  background-color: rgb(196, 178, 20);
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
  width: 100px;
}

button.mode {
  width: 120px;
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

div.button-controls>*:last-child {
  margin-left: auto;
}

.count-grid {
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
