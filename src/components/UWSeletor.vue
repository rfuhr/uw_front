<script setup>
import { ref, defineProps, onMounted, onBeforeMount, computed } from 'vue';
import _ from 'lodash';

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    modelValue: {},
    label: {
        type: String,
        default: ''
    },
    optionLabel: {
        type: String,
        default: ''
    },
    optionValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    service: {
        type: Object,
        required: true
    },
    columnsFilters: {},
    erros: {},
    classContainer: {},
    disabled: {
        type: Boolean,
        default: false
    }
});

const registros = ref([]);
const totalRegistros = ref(0);
const lazyParams = ref();
const filters = ref();
const valorFiltro = ref();
const filtroAtivo = ref();

const montarFiltros = async () => {
    filters.value = {
        nome: {
            value: valorFiltro.value,
            matchMode: 'contains',
            tipo: 'text',
            fieldFilter: 'nome'
        }
    };
    if (valorFiltro.value && valorFiltro.value !== '') filtroAtivo.value = true;

    if (props.columnsFilters && props.columnsFilters.length > 0) {
        props.columnsFilters.forEach((element) => {
            filters.value[element.field] = {
                value: element.value ? element.value : element.tipoField === 'boolean' ? null : '',
                matchMode: element.matchMode,
                tipo: element.tipoField,
                fieldFilter: element.fieldFilter
            };
        });
    }

    try {
        if (filters.value) lazyParams.value.filters = filters.value;
        if (props.modelValue && props.modelValue > 0) lazyParams.value.id = props.modelValue;
    } catch {}
};

const getLista = async () => {
    try {
        await montarFiltros();
        const data = await props.service.getPageAll(lazyParams.value);
        registros.value = data.registros;
        totalRegistros.value = data.totalRegistros;
    } catch {
        registros.value = [];
    }
};

const limparFiltro = async () => {
    filtroAtivo.value = false;
    valorFiltro.value = '';
    lazyParams.value.page = 0;
    await getLista();
};

// const checkLimparFiltro = () => {
//     if (filtroAtivo.value && (valorFiltro.value || valorFiltro.value === '')) {
//         limparFiltro();
//     }
// };

const onLazyLoad = (event) => {
    if (event) lazyParams.value.first = event.first;
    getLista();
};

onBeforeMount(() => {
    montarFiltros();
});

onMounted(() => {
    lazyParams.value = {
        first: 0,
        page: 0,
        rows: 50,
        sortField: props.optionLabel,
        sortOrder: 1,
        filters: filters.value,
        sortFilter: props.optionLabel
    };
    onLazyLoad();
});

const emit = defineEmits(['update:modelValue', 'change', 'changeObject']);

const localFieldName = computed({
    get: () => props.modelValue,
    set: (newValue) => {
        if (!_.isEqual(newValue, props.modelValue)) {
            console.log('NewValue ', newValue, 'OldValue', props.modelValue);
            emit('update:modelValue', newValue);
            emit('change');
        }
    }
});

const handleChange = (event) => {
    const reg = registros.value.find((e) => e.id === event.value);
    emit('changeObject', reg);
};
</script>

<template>
    <div :class="['field', classContainer]">
        <span class="p-float-label">
            <Dropdown
                :id="props.id"
                v-model="localFieldName"
                :options="registros"
                :optionLabel="optionLabel"
                :optionValue="optionValue"
                :placeholder="placeholder"
                class="minimodrop"
                :showClear="true"
                :disabled="disabled"
                :class="{ 'p-invalid': props.erros, 'w-full': true }"
                @before-show="getLista()"
                @change="handleChange"
            >
                <template #header>
                    <div class="col-12 md:col-12">
                        <div class="p-inputgroup">
                            <InputText autofocus placeholder="Digite argumento de pesquisa" v-model="valorFiltro" @keypress.enter="getLista()" />
                            <Button v-if="filtroAtivo" icon="pi pi-times" class="p-button-danger" @click.stop="limparFiltro()" />
                            <Button icon="pi pi-search" class="p-button-warning" @click.stop="getLista()" />
                        </div>
                    </div>
                </template>

                <template #footer>
                    <Paginator :rows="lazyParams.rows" :totalRecords="totalRegistros" @page="onLazyLoad($event)"></Paginator>
                </template>
            </Dropdown>
            <label :for="props.id" v-required="props.required">{{ props.label }}</label>
        </span>
        <span v-if="props.erros">
            <span id="id-error" v-for="(error, index) of props.erros" :key="index">
                <small class="p-error">{{ error }}</small>
            </span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
::v-deep(.minimodrop .p-dropdown-items-wrapper) {
    min-height: 200px;
}
</style>
