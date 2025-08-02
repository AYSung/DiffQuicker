<script setup>
import { reactive, computed, ref } from 'vue';
import CellCount from './components/CellCount.vue';
import TotalCount from './components/TotalCount.vue';


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


function clickAudio() {
  audio = new Audio('./src/assets/click.mp3').play()
  audio.volume = 0.5
  audio.play()
}

function increment(cell_type) {
  counter[cell_type]++
  clickAudio()
}

function decrement(cell_type) {
  if (counter[cell_type] > 0) {
    counter[cell_type]--
  clickAudio()
  }
}

function resetCount() {
  for (let key in counter) {counter[key] = 0}
}

function toggleMode() {
  mode.value = (mode.value == 'peripheral blood') ? 'bone marrow' : 'peripheral blood'
}


const totalCount = computed(() => {
  return Object.values(counter).reduce((a, b) => a + b, 0);
})

addEventListener("keydown", (event) => { 
  if (event.shiftKey & event.code in KEYMAP) {decrement(KEYMAP[event.code])} 
  else if (event.code in KEYMAP) {increment(KEYMAP[event.code])} 
})

</script>

<template>
  <header>
    <div>
      <h1>DiffQuicker</h1>
      <h2>mode: {{ mode }}</h2>
      <button @click="toggleMode">switch mode</button>
    </div>
    <div>
      <TotalCount :count="totalCount" />
      <progress :value="totalCount" max="300" style="accent-color: hsla(160, 100%, 37%, 1);"></progress>
    </div>
  </header>
  <main>
    <div class="count_grid">
      <CellCount v-for="[cell_type, count] in Object.entries(counter)" :label="cell_type + 's'" :count="count" :total="totalCount" :showPercent="showPercent"/>
    </div>
    <button @click="resetCount">reset count</button>
    <input placeholder="x10^9/L">WBC count</input>
    <input type="checkbox" id="show-percent" v-model="showPercent"></input>
    <label for="show-percent">show percent</label>
  </main>
</template>

<style scoped>
header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* padding-right: 120px */
    /* place-items: center; */
    /* padding-right: calc(var(--section-gap) / 2); */
  }

h1 {
    font-size: 3rem;
}

.count_grid {
  line-height: 1.5;
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  column-gap: 2em;
  width: 840px;
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
