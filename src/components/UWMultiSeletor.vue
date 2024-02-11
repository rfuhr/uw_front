<script setup>
import { ref, defineProps, onMounted, onBeforeMount, computed } from 'vue';

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
    classContainer: {}
});

const registros = ref([]);
const totalRegistros = ref(0);
const lazyParams = ref();
const filters = ref();
const valorFiltro = ref();
const filtroAtivo = ref();

const montarFiltros = async (pesquisaId, id) => {
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
            if (pesquisaId) {
                filters.value['id'] = {
                    value: id ? id : props.fieldName,
                    matchMode: 'equals',
                    tipo: 'integer'
                };
            }
        });
    }

    try {
        if (filters.value) lazyParams.value.filters = filters.value;
    } catch {}
};

const getLista = async (pesquisaId, id) => {
    try {
        await montarFiltros(pesquisaId, id);
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
    await getLista(false);
};

// const checkLimparFiltro = () => {
//     if (filtroAtivo.value && (valorFiltro.value || valorFiltro.value === '')) {
//         limparFiltro();
//     }
// };

const onLazyLoad = (event) => {
    if (event) lazyParams.value.first = event.first;
    getLista(false);
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

const emit = defineEmits(['update:modelValue']);

const localFieldName = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});
</script>

<template>
    <div :class="['field', classContainer]">
        <span class="p-float-label">
            <MultiSelect
                :id="props.id"
                v-model="localFieldName"
                :options="registros"
                :optionLabel="optionLabel"
                :optionValue="optionValue"
                :placeholder="placeholder"
                class="minimodrop"
                :showClear="true"
                :class="{ 'p-invalid': props.erros, 'w-11': true }"
                display="chip"
                @before-show="getLista(false)"
            >
                <template #header>
                    <div class="col-12 md:col-12">
                        <div class="p-inputgroup">
                            <InputText autofocus placeholder="Digite argumento de pesquisa" v-model="valorFiltro" @keypress.enter="getLista(false)" />
                            <Button v-if="filtroAtivo" icon="pi pi-times" class="p-button-danger" @click.stop="limparFiltro()" />
                            <Button icon="pi pi-search" class="p-button-warning" @click.stop="getLista(false)" />
                        </div>
                    </div>
                </template>

                <template #footer>
                    <Paginator :rows="lazyParams.rows" :totalRecords="totalRegistros" @page="onLazyLoad($event)"></Paginator>
                </template>
            </MultiSelect>
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
