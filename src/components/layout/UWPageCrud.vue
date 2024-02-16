<script setup>
import { ref, onMounted, onBeforeMount, defineProps } from 'vue';
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
});

const emit = defineEmits(['openNew', 'openEdit']);

const registros = ref();
const filters = ref();
const loading = ref(false);
const lazyParams = ref();
const totalRegistros = ref(0);
const tableCrud = ref();

const montarFiltros = () => {
    filters.value = [];
    props.columns.forEach((element) => {
        filters.value[element.field] = {
            value: element.tipoField === 'boolean' ? null : '',
            matchMode: element.matchMode,
            tipo: element.tipoField,
            fieldFilter: element.fieldFilter
        };
    });
};

const getPageRegistros = async () => {
    if (lazyParams.value.filters && lazyParams.value.filters.length === 0) lazyParams.value.filters = null;

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
    lazyParams.value.filters = filters.value;
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
            :rows="20"
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
                    <Button type="button" icon="pi pi-user-plus" label="Novo" class="w-full sm:w-auto flex-order-0 sm:flex-order-1" outlined @click="addNew" />
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
                    <TriStateCheckbox v-if="column.tipoField === 'boolean'" type="text" v-model="filterModel.value" @change="filterCallback()" />
                    <InputText v-else type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="column.placeholder" />
                </template>
                <template #body="slotProps">
                    <i v-if="column.tipoField === 'boolean'" class="pi" :class="{ 'p-sucess pi-check-circle': slotProps.data[slotProps.field], 'p-error pi-times-circle': !slotProps.data[slotProps.field] }"></i>
                    <span v-if="column.tipoField === 'maskDate'" >{{ formatDate(slotProps.data[slotProps.field], column.maskDate) }} </span>
                    <span v-else>{{ slotProps.data[slotProps.field] }} </span>
                </template>
            </Column>
            <Column header="Ações" style="width: 10%">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps.data.id)" />
                    <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </UWPageBase>
</template>
