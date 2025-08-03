<script setup>
import { ref } from 'vue';

const props = defineProps({
    counter: {
        type: Object,
        required: true
    },
    cellsCounted: {
        type: Number,
        required: true,
    },
    mode: {
        type: String,
        required: true,
    },
})

const report = ref('')
const wbcCount = ref('')

function copyReport() {
    navigator.clipboard.writeText(report.value)
}

function absoluteCounts() {
    if (!wbcCount.value) { return '' }
    else {
        return `
Abs. neutrophil count ${(wbcCount.value * props.counter.neutrophil / props.cellsCounted).toFixed(1)} x10^9/L [ref: 1.5-7.4 x10^9/L]
Abs. lymphocyte count ${(wbcCount.value * props.counter.lymphocyte / props.cellsCounted).toFixed(1)} x10^9/L [ref: 1.1-3.9 x10^9/L]
Abs. monocyte count ${(wbcCount.value * props.counter.monocyte / props.cellsCounted).toFixed(1)} x10^9/L [ref: 0.1-0.9 x10^9/L]
Abs. eosinophil count ${(wbcCount.value * props.counter.eosinophil / props.cellsCounted).toFixed(1)} x10^9/L [ref: 0.0-0.7 x10^9/L]`
    }
}

function optionalCounts(label) {
    let cellType = label.slice(0, -1).toLowerCase()
    return props.counter[cellType] ? `\n${label}: ${Math.round(props.counter[cellType] / props.cellsCounted * 100)}%` : ''
}

function nRBCCounts() {
    return props.counter.erythroid ? `\nnRBCs: ${Math.round(props.counter.erythroid / (props.cellsCounted / 100))}/100 WBCs` : ''
}

function requiredCounts(label) {
    let cellType = label.slice(0, -1).toLowerCase()
    return `${label}: ${Math.round(props.counter[cellType] / props.cellsCounted * 100)}%`
}

function MERatio() {
    return props.counter.erythroid ? `\nM:E Ratio: ${((props.counter.promyelocyte + props.counter.myelocyte + props.counter.metamyelocyte + props.counter.neutrophil + props.counter.eosinophil + props.counter.basophil) / props.counter.erythroid).toFixed(1)}` : ''
}

function generateReport() {
    if (props.cellsCounted == 0) { report.value = 'No cell counts to report' }
    else if (props.mode == 'peripheral blood') {
        report.value = `Peripheral Blood Differential (${props.cellsCounted} cells) ${optionalCounts('Blasts')} ${optionalCounts('Promyelocytes')} ${optionalCounts('Myelocytes')} ${optionalCounts('Metamyelocytes')}
${requiredCounts('Neutrophils')}
${requiredCounts('Eosinophils')} ${optionalCounts('Basophils')}
${requiredCounts('Monocytes')}
${requiredCounts('Lymphocytes')} ${optionalCounts('Plasma Cells')} ${optionalCounts('Others')} ${nRBCCounts()}
${absoluteCounts()} 
        `
    } else if (props.mode == 'bone marrow') {
        report.value = `Bone Marrow Differential (${props.cellsCounted} cells)
        ${requiredCounts('Blasts')}
        ${requiredCounts('Promyelocytes')}
        ${requiredCounts('Myelocytes')}
        ${requiredCounts('Metamyelocytes')}
        ${requiredCounts('Neutrophils')}
        ${requiredCounts('Eosinophils')}
        ${requiredCounts('Basophils')}
        ${requiredCounts('Monocytes')}
        ${requiredCounts('Lymphocytes')}
        ${requiredCounts('Plasma Cells')} ${optionalCounts('Others')} ${MERatio()}
        `
    }
}
</script>

<template>
    <div v-if="mode == 'peripheral blood'">
        <label for="wbcCount">WBC count: </label>
        <input id="wbcCount" type="number" step="0.1" v-model="wbcCount" style="width: 4rem"></input>
        <label for="wbcCount">x10<sup>9</sup>/L</label>
    </div>
    <div style="display: flex; gap: 1rem;">
        <button @click="generateReport">generate report</button>
        <button v-if="report" @click="copyReport">copy report</button>
    </div>
    <textarea class="report" v-model="report" disabled=true>
    </textarea>
</template>

<style scoped>
h1 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    top: -10px;
}

input {
    font-size: 15px;
    border-radius: 6px;
    text-align: end;
}

.report {
    margin-top: 1rem;
    white-space: pre-line;
    resize: none;
    height: 30rem;
    width: 30rem;
    background-color: transparent;
    border-color: transparent;
    color: rgba(235, 235, 235, 0.64);
    line-height: 1.6;
    font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        Oxygen,
        Ubuntu,
        Cantarell,
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        sans-serif;
    font-size: 1rem;
}
</style>
