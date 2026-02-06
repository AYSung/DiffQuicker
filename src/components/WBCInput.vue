<script setup>
import { useTemplateRef } from 'vue';
import { state } from '@/state';


const wbcInput = useTemplateRef("wbcInput")

function onlyNumbers(e) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        wbcInput.value.blur()
    }
}
</script>

<template>
    <div class="wbc-count">
        <label for="wbcCount">WBCs: </label>
        <input id="wbcCount" min="0" step="0.1" type="Number" @keydown="onlyNumbers" v-model="state.wbcCount"
            style="width: 4rem" ref="wbcInput"></input>
        <label for="wbcCount">x10<sup>9</sup>/L</label>
    </div>
</template>

<style>
.wbc-count {
    background-color: hsla(160, 100%, 37%, 1);
    color: black;
    border-radius: 1.5rem;
    padding: 0.5rem 1rem;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: baseline;
    height: fit-content;
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

.wbc-count>input {
    border-radius: 6px;
    text-align: end;
    margin: 0.2rem;
}
</style>