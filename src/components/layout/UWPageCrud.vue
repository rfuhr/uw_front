<script setup>
import { ref, onMounted, onBeforeMount, defineProps } from 'vue';
import _ from 'lodash'
import UWPageBase from './UWPageBase.vue';
import { UsuarioService } from '@/service';
import { useContexto } from '@/stores';
import { useFormatDate } from '@/composables/useFormatDate'

const { formatDate } = useFormatDate();
const { contexto } = useContexto();

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: false
    },
    columns: {},
    service: {
        type: Object,
        required: true
    },
    tag: {
        type: String,
        required: false,
        default: undefined
    },
    sortField: {
        type: String,
        required: false,
        default: undefined
    },
    iconButtonNew: {
        type: String,
        required: false,
        default: 'pi pi-user-plus'
    },
    labelButtonNew: {
        type: String,
        required: false,
        default: 'Novo'
    },
    showButtonNew: {
        type: Boolean,
        required: false,
        default: true
    },
    showButtonEdit: {
        type: Boolean,
        required: false,
        default: true
    },
    showButtonDelete: {
        type: Boolean,
        required: false,
        default: true
    },
    showAcoes: {
        type: Boolean,
        required: false,
        default: true
    },
    filtersDefault: { // Adicionando nova propriedade para filtros padrão
        type: Object,
        required: false,
        default: () => ({})
    }
});

const emit = defineEmits(['openNew', 'openEdit']);

const registros = ref();
const filters = ref();
const loading = ref(false);
const lazyParams = ref();
const totalRegistros = ref(0);
const tableCrud = ref();

const montarFiltros = () => {
    filters.value = { ...props.filtersDefault }; 

    props.columns.forEach((element) => {
        filters.value[element.field] = {
            value: element.tipoField === 'boolean' ? element.filterValue || null : element.filterValue || '',
            matchMode: element.matchMode,
            tipo: element.tipoField,
            fieldFilter: element.fieldFilter
        };
    });

};

const getPageRegistros = async () => {
    
    if (lazyParams.value.filters && lazyParams.value.filters.length === 0) lazyParams.value.filters = null;

    lazyParams.value.filters = { ...props.filtersDefault, ...filters.value };

    props.service.getPageAll(lazyParams.value).then((data) => {
        registros.value = data.registros;
        totalRegistros.value = data.totalRegistros;
        loading.value = false;
    });
};

onBeforeMount(() => {
    montarFiltros();
});

onMounted(() => {
    loading.value = true;
    lazyParams.value = {
        first: 0,
        page: 0,
        rows: tableCrud.value.rows,
        sortField: props.sortField || props.columns[0].field,
        sortOrder: 1,
        filters: filters.value
    };
    getPageRegistros();
});

const onPage = (event) => {
    lazyParams.value = event;
    getPageRegistros();
};

const onSort = (event) => {
    lazyParams.value = event;
    lazyParams.value.first = 0;
    getPageRegistros();
};

const onFilter = () => {
    lazyParams.value.filters = { ...props.filtersDefault, ...filters.value };
    lazyParams.value.first = 0;

    getPageRegistros();
};

const reload = () => {
    lazyParams.value.first = 0;
    getPageRegistros();
};

const addNew = async () => {
    if (props.tag) {
        await UsuarioService.checkPermissao(contexto.empresaId, contexto.empresaFilialId, props.tag, 'inserir');
        emit('openNew');
    } else {
        emit('openNew');
    }
};

const handleEdit = async (id) => {
    if (props.tag) {
        await UsuarioService.checkPermissao(contexto.empresaId, contexto.empresaFilialId, props.tag, 'alterar');
        emit('openEdit', id);
    } else {
        emit('openEdit', id);
    }
}

const handleDelete = async (dados) => {
    if (props.tag) {
        await UsuarioService.checkPermissao(contexto.empresaId, contexto.empresaFilialId, props.tag, 'excluir');
        emit('openDelete', dados);
    } else {
        emit('openDelete', dados);
    }
}

defineExpose({
    reload
});

</script>

<template>
    <UWPageBase :title="title" :subtitle="subtitle">
        <DataTable
            ref="tableCrud"
            size="small"
            class="p-datatable-sm"
            :value="registros"
            dataKey="id"
            :sortField="props.sortField || props.columns[0].field"
            :sortOrder="1"
            :paginator="true"
            :rows="10"
            :lazy="true"
            v-model:filters="filters"
            :totalRecords="totalRegistros"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50]"
            :loading="loading"
            @page="onPage($event)"
            @sort="onSort($event)"
            @filter="onFilter($event)"
            filterDisplay="row"
            currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} registros"
            responsiveLayout="scroll"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 align-items-center justify-content-end">
                    <slot name="headerActions"></slot>
                    <Button type="button" v-if="props.showButtonNew" :icon="iconButtonNew" :label="labelButtonNew" class="w-full sm:w-auto flex-order-0 sm:flex-order-1" outlined @click="addNew" />
                </div>
            </template>
            <Column
                showFilterMatchModes="true"
                showFilterOperator="true"
                :field="column.field"
                :header="column.label"
                ref="nome"
                :dataType="column.tipoField"
                :sortable="column.sortable"
                :sortField="column.sortField || column.field"
                :style="{ width: column.size }"
                v-for="column in columns"
                :key="column.field"
            >
                <template #filter="{ filterModel, filterCallback }" v-if="column.filter">
                    <Dropdown v-if="column.filterSeletor" :options="column.filterValues" optionLabel="label" optionValue="value" :placeholder="column.placeholder" showClear v-model="filterModel.value" @change="filterCallback()"/>
                    <TriStateCheckbox v-else-if="column.tipoField === 'boolean'" type="text" v-model="filterModel.value" @change="filterCallback()" />
                    <InputNumber v-else-if="column.tipoField === 'decimal'" v-model="filterModel.value" mode="decimal" minFractionDigits="0" maxFractionDigits="5" locale="pt-Br" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="column.placeholder" />
                    <InputText v-else type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="column.placeholder" />
                </template>
                <template #body="slotProps">
                    <div v-if="column.format" v-html="column.format(_.get(slotProps.data, slotProps.field))" :class="{'text-right pr-5': column.tipoField === 'decimal'}" />
                    <i v-else-if="column.tipoField === 'boolean'" class="pi" :class="{ 'font-bold text-green-600 pi-check-circle': _.get(slotProps.data, slotProps.field), 'font-bold text-red-600 pi pi-times-circle': !_.get(slotProps.data, slotProps.field) }"></i>
                    <span v-else-if="column.tipoField === 'maskDate'" >{{ formatDate(slotProps.data[slotProps.field], column.maskDate) }} </span>
                    <span v-else>{{ _.get(slotProps.data, slotProps.field) }} </span>
                </template>
            </Column>
            <Column v-if="props.showAcoes" header="Ações" style="width: 10%">
                <template #body="slotProps">
                    <slot name="tableActions" v-bind="slotProps"></slot>
                    <Button v-if="props.showButtonEdit" icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps.data.id)" />
                    <Button v-if="props.showButtonDelete" icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </UWPageBase>
</template>
