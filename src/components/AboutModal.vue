<script setup>
import { ref, Teleport } from 'vue';

const open = ref(false)
</script>

<template>
    <button class="about" @click="open = true">?</button>

    <Teleport to="body">
        <div v-if="open" class="modal">
            <div class="about-text">
                <h2>About</h2>
                <p>DiffQuicker is a peripheral blood/bone marrow aspirate diff counter and report assistant.</p>

                <h2>Controls</h2>
                <p>Pressing the following keys to add one to the corresponding cell type count. Holding shift while
                    pressing
                    a key will instead subtract one from the count.</p>
                <table>
                    <tbody>
                        <tr>
                            <td>blast (Q)</td>
                            <td>promyelocyte (W)</td>
                            <td>myelocyte (E)</td>
                            <td>metamyelocyte (R)</td>
                        </tr>
                        <tr>
                            <td>erythroid (A)</td>
                            <td>monocyte (S)</td>
                            <td>lymphocyte (D)</td>
                            <td>neutrophil (F)</td>
                        </tr>
                        <tr>
                            <td>other (Z)</td>
                            <td>basophil (X)</td>
                            <td>plasma cell (C)</td>
                            <td>eosinophil (V)</td>
                        </tr>
                    </tbody>
                </table>
                <p>The buttons above the grid of cell counts can be used to toggle the counting mode, the number of
                    cells to
                    count before generating the report, and whether to display a percentage for each cell type. When
                    adjusting the target cell count, if the current cell count will exceed the resulting target count
                    the minus button will turn yellow. Clicking it will result in the most recent counts will be
                    discarded until the target count is reached. Click the
                    reset button to reset all counts to zero.</p>

                <h2>Counting Modes</h2>
                <h3> Peripheral Blood Mode </h3>
                <p>In peripheral blood mode, erythroid precursors are NOT counted towards the total cells counted and
                    the
                    target cell count is defaulted to 200 cells. Erythroid precursors will be reported as "nRBCs / 100
                    WBCs", if present. Only neutrophils, lymphocytes, monocytes, eosinophils, and non-zero cell
                    counts will be included in the report. If a WBC count is entered, the absolute counts of
                    neutrophils,
                    lymphocytes, monocytes, and eosinophils are also included.</p>
                <h3>Bone Marrow Mode</h3>
                <p>In bone marrow mode, erythroid precursors ARE counted towards the total cells counted and the target
                    cell
                    count is defaulted to 300 cells. All cell types are reported regardless of their counts. The M:E
                    ratio
                    is calculated as the sum of granulocytes (including monocytes and excluding blasts) divided by the
                    sum of
                    erythroid precursors.</p>

                <h2>Report Assistant</h2>
                <p>Once the target count is reached, a report summarizing the differential will be automatically
                    generated.
                    The report can be copied to the clipboard by clicking the "copy" button in the upper right corner of
                    the
                    report.</p>
            </div>
            <button class="close" @click="open = false">close</button>
        </div>
    </Teleport>
</template>

<style scoped>
h2 {
    margin-top: 0.5rem;
    background-color: transparent;
}

table td {
    width: 150px;
    border-color: rgba(235, 235, 235, 0.64);
    border-width: 0 0 0 1px;
    border-style: solid;
    padding-left: 0.5rem;
    font-weight: bold;
}

table {
    margin: 1rem 0rem;
}

.about {
    position: absolute;
    top: 1rem;
    right: 0;
    background-color: hsla(160, 100%, 37%, 1);
}

.about-text {
    height: 600px;
    overflow-y: scroll;
}

.close {
    align-self: center;
}

.modal {
    background-color: rgba(44, 62, 80, 0.95);
    border-radius: 1rem;
    padding: 1rem 1rem 1rem 2rem;
    position: fixed;
    z-index: 999;
    top: 6.5rem;
    left: 50%;
    width: 700px;
    margin-left: -350px;
    display: flex;
    flex-direction: column;
}

.modal>*:last-child {
    margin-top: 1rem;
}
</style>
