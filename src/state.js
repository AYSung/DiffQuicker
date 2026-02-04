import { reactive, computed, ref } from 'vue';

export const state = reactive({
    wbcCount: '',
    counter: {
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
    },
    count_history: [],
})