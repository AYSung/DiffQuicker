<script setup>
import { computed, ref } from 'vue';
import { state } from '@/state';

const props = defineProps({
    cellsCounted: {
        type: Number,
        required: true,
    },
    mode: {
        type: String,
        required: true,
    },
})


const copyButtonText = ref('copy')

function copyReport() {
    try {
        navigator.clipboard.writeText(report.value)
        copyButtonText.value = 'copied'
        setTimeout(() => copyButtonText.value = 'copy', 1000)
    } catch (err) {
        console.log('failed to copy')
    }
}

function absoluteCounts() {
    return state.wbcCount ? `Abs. neutrophil count ${(state.wbcCount * state.counter.neutrophil / props.cellsCounted).toFixed(1)} x10^9/L [ref: 1.5-7.4 x10^9/L]
Abs. lymphocyte count ${(state.wbcCount * state.counter.lymphocyte / props.cellsCounted).toFixed(1)} x10^9/L [ref: 1.1-3.9 x10^9/L]
Abs. monocyte count ${(state.wbcCount * state.counter.monocyte / props.cellsCounted).toFixed(1)} x10^9/L [ref: 0.1-0.9 x10^9/L]
Abs. eosinophil count ${(state.wbcCount * state.counter.eosinophil / props.cellsCounted).toFixed(1)} x10^9/L [ref: 0.0-0.7 x10^9/L]` : ''
}

function optionalCounts(label) {
    let cellType = label.slice(0, -1).toLowerCase()
    return state.counter[cellType] ? `\n${label}: ${Math.round(state.counter[cellType] / props.cellsCounted * 100)}%` : ''
}

function nRBCCounts() {
    return state.counter.erythroid ? `\nnRBCs: ${Math.round(state.counter.erythroid / (props.cellsCounted / 100))}/100 WBCs` : ''
}

function requiredCounts(label) {
    let cellType = label.slice(0, -1).toLowerCase()
    return `${label}: ${Math.round(state.counter[cellType] / props.cellsCounted * 100)}%`
}

function MERatio() {
    return state.counter.erythroid ? `\nM:E Ratio: ${((state.counter.promyelocyte + state.counter.myelocyte + state.counter.metamyelocyte + state.counter.neutrophil + state.counter.eosinophil + state.counter.basophil + state.counter.monocyte) / state.counter.erythroid).toFixed(1)}` : ''
}

const report = computed(() => {
    if (props.cellsCounted == 0) { return '' }
    else if (props.mode == 'peripheral blood') {
        return `Peripheral Blood Differential (${props.cellsCounted} cells)${optionalCounts('Blasts')}${optionalCounts('Promyelocytes')}${optionalCounts('Myelocytes')}${optionalCounts('Metamyelocytes')}
${requiredCounts('Neutrophils')}
${requiredCounts('Eosinophils')}${optionalCounts('Basophils')}
${requiredCounts('Monocytes')}
${requiredCounts('Lymphocytes')}${optionalCounts('Plasma Cells')}${optionalCounts('Others')}${nRBCCounts()}
${absoluteCounts()}`
    } else if (props.mode == 'bone marrow') {
        return `Bone Marrow Differential (${props.cellsCounted} cells)
${requiredCounts('Blasts')}
${requiredCounts('Promyelocytes')}
${requiredCounts('Myelocytes')}
${requiredCounts('Metamyelocytes')}
${requiredCounts('Neutrophils')}
${requiredCounts('Eosinophils')}
${requiredCounts('Basophils')}
${requiredCounts('Monocytes')}
${requiredCounts('Lymphocytes')}
${requiredCounts('Plasma Cells')}
${requiredCounts('Erythroids')}${optionalCounts('Others')}${MERatio()}`
    }
})
</script>

<template>
    <div style="margin-left: auto; position: relative;">
        <button :class="copyButtonText" v-if="report" @click="copyReport">{{ copyButtonText }}</button>
        <textarea class="report" disabled=true>{{ report }}</textarea>
    </div>
</template>

<style scoped>
h1 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    top: -10px;
}

button {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
    border-radius: 0.5rem;
    width: 5rem;
}

button.copied {
    background-color: rgb(64, 75, 71);
}

.report {
    margin-left: auto;
    white-space: pre-line;
    resize: none;
    height: 30rem;
    width: 29rem;
    background-color: transparent;
    border-color: hsla(160, 100%, 37%, 1);
    border-radius: 1rem;
    padding: 0.5rem 1rem;
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