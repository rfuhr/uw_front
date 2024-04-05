<script setup>
import { ref, defineProps, onMounted, onBeforeMount, computed } from 'vue';
import _ from 'lodash';

import { ItemService as Service } from '@/service';

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
    required: {
        type: Boolean,
        default: false
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
const optionsPesq = ref(['Nome', 'Código']);
const tipofiltro = ref('Nome');

const montarFiltros = async () => {
    filters.value = {
        nome: {
            value: valorFiltro.value,
            matchMode: 'contains',
            tipo: tipofiltro.value === 'Nome' ? 'text' : 'integer',
            fieldFilter: tipofiltro.value === 'Nome' ? 'nome' : 'codigo'
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

    if (filters.value) lazyParams.value.filters = filters.value;
    if (props.modelValue && props.modelValue > 0) lazyParams.value.id = props.modelValue;
    else lazyParams.value.id = null;
};

const getLista = async () => {
    try {
        await montarFiltros();
        const data = await Service.getPageAll(lazyParams.value);
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

const onLazyLoad = (event) => {
    if (event) lazyParams.value.first = event.first;
    getLista();
};

onBeforeMount(async () => {
    await montarFiltros();
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
            emit('update:modelValue', newValue);
            emit('change');
        }
    }
});

const handleChange = (event) => {
    const reg = registros.value.find((e) => e.id === event.value);
    emit('changeObject', reg);
};

const beforeShow = () => {
    limparFiltro();
    getLista();
};
</script>

<template>
    <div :class="['field', classContainer]">
        <span class="p-float-label">
            <Dropdown
                :id="props.id"
                v-model="localFieldName"
                :options="registros"
                optionLabel="nome"
                optionValue="id"
                placeholder="Selecione o item"
                class="minimodrop"
                :showClear="true"
                :disabled="disabled"
                :class="{ 'p-invalid': props.erros, 'w-full': true }"
                @before-show="beforeShow()"
                @change="handleChange"
            >
                <template #header>
                    <div class="col-12 md:col-12">
                        <div class="flex justify-content-start align-items-center"><span>Pesquisar por: </span> <SelectButton v-model="tipofiltro" :options="optionsPesq" aria-labelledby="basic" /></div>

                        <div class="p-inputgroup">
                            <InputText autofocus placeholder="Digite argumento de pesquisa" v-model="valorFiltro" @keypress.enter="getLista()" />
                            <Button v-if="filtroAtivo" icon="pi pi-times" class="p-button-danger" @click.stop="limparFiltro()" />
                            <Button icon="pi pi-search" class="p-button-warning" @click.stop="getLista()" />
                        </div>
                    </div>
                </template>
                <template #option="slotProps">
                    <div class="flex flex-column align-items-start">
                        <span>[ {{ slotProps.option.codigo }} ] - {{ slotProps.option.nome }}</span>
                        <!-- <span v-if="slotProps.option.cpfCnpj.length === 9" style="font-size: 0.9rem; color: black">Filial: {{ slotProps.option.nomeLocal }}</span> -->
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
