<script setup>
import { computed, ref } from 'vue';

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

const wbcCount = ref('')

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
    return wbcCount.value ? `Abs. neutrophil count ${(wbcCount.value * props.counter.neutrophil / props.cellsCounted).toFixed(1)} x10^9/L [ref: 1.5-7.4 x10^9/L]
Abs. lymphocyte count ${(wbcCount.value * props.counter.lymphocyte / props.cellsCounted).toFixed(1)} x10^9/L [ref: 1.1-3.9 x10^9/L]
Abs. monocyte count ${(wbcCount.value * props.counter.monocyte / props.cellsCounted).toFixed(1)} x10^9/L [ref: 0.1-0.9 x10^9/L]
Abs. eosinophil count ${(wbcCount.value * props.counter.eosinophil / props.cellsCounted).toFixed(1)} x10^9/L [ref: 0.0-0.7 x10^9/L]` : ''
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
${requiredCounts('Plasma Cells')}${optionalCounts('Others')}${MERatio()}`
    }
})
</script>

<template>
    <div style="display: grid; grid-template-columns: auto auto;">
        <div v-if="mode == 'peripheral blood'">
            <div class="wbc-count">
                <label for="wbcCount">WBC count: </label>
                <input id="wbcCount" type="number" min="0" step="0.1" v-model="wbcCount" style="width: 4rem"></input>
                <label for="wbcCount">x10<sup>9</sup>/L</label>
            </div>
        </div>
        <div style="margin-left: auto; position: relative;">
            <button :class="copyButtonText" v-if="report" @click="copyReport">{{ copyButtonText }}</button>
            <textarea class="report" disabled=true>{{ report }}</textarea>
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

.wbc-count {
    background-color: hsla(160, 100%, 37%, 1);
    color: black;
    border-radius: 1.5rem;
    padding: 0.5rem 1rem;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: baseline;
}

.wbc-count>* {
    font-weight: bold;
    font-size: 1rem;
}

.wbc-count>input {
    border-radius: 6px;
    text-align: end;
    margin: 0.2rem;
}

.report {
    margin-left: auto;
    white-space: pre-line;
    resize: none;
    height: 30rem;
    width: 27rem;
    background-color: transparent;
    border-color: hsla(160, 100%, 37%, 1);
    border-radius: 1rem;
    padding: 0.5rem 1rem;
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