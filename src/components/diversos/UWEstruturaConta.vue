<script setup>
import { ref, onBeforeMount } from 'vue';
import { UsuarioService } from '@/service';
import { useContexto } from '@/stores';

const { contexto } = useContexto();

const props = defineProps({
    nodes: {},
    service: {
        type: Object,
        required: true
    },
    tag: {
        type: String,
        required: false,
        default: undefined
    }
});

const filters = ref({});

const tiposConta = ref([
    { name: 'Analítica', value: false },
    { name: 'Sintética', value: true }
]);

const emit = defineEmits(['openEdit', 'openNew', 'openDelete']);

const handleNew = async () => {
    if (props.tag) {
        await UsuarioService.checkPermissao(contexto.empresaId, contexto.empresaFilialId, props.tag, 'inserir');
    }
    emit('openNew');
};

const handleEdit = async (id) => {
    if (props.tag) {
        await UsuarioService.checkPermissao(contexto.empresaId, contexto.empresaFilialId, props.tag, 'alterar');
        emit('openEdit', id);
    } else {
        emit('openEdit', id);
    }
};

const handleDelete = async (dados) => {
    if (props.tag) {
        await UsuarioService.checkPermissao(contexto.empresaId, contexto.empresaFilialId, props.tag, 'excluir');
        emit('openDelete', dados);
    } else {
        emit('openDelete', dados);
    }
};

const handleAdicionar = async (dados) => {
    if (props.tag) {
        await UsuarioService.checkPermissao(contexto.empresaId, contexto.empresaFilialId, props.tag, 'excluir');
        emit('openAdicionar', dados);
    } else {
        emit('openAdicionar', dados);
    }
};




</script>

<template>
    <TreeTable :value="nodes" :paginator="true" :rows="10" :rowsPerPageOptions="[10, 25, 50]" :filters="filters" filterDisplay="row" filterMode="lenient" rowHover="true">
        <template #header>
            <div class="flex flex-wrap gap-2 align-items-center justify-content-end">
                <Button type="button" icon="pi pi-tag" label="Nova Conta" class="w-full sm:w-auto flex-order-0 sm:flex-order-1" outlined @click="handleNew" />
            </div>
        </template>
        <Column field="codigo" header="Código" :expander="true">
            <template #filter>
                <InputText v-model="filters['codigo']" type="text" class="p-column-filter w-full" placeholder="Filtro pelo código" />
            </template>
        </Column>
        <Column field="nome" header="Nome">
            <template #filter>
                <InputText v-model="filters['nome']" type="text" class="p-column-filter w-full" placeholder="Filtro pelo código" />
            </template>
        </Column>
        <Column field="sintetica" header="Sintética" filterMatchMode="equals">
            <template #filter>
                <Dropdown v-model="filters['sintetica']" :options="tiposConta" optionLabel="name" optionValue="value" placeholder="Selecione" class="w-full" />
            </template>
            <template #body="slotProps">
                <span>{{ slotProps.node.data.sintetica ? 'Sintética' : 'Analítica' }}</span>
            </template>
        </Column>
        <Column header="Ações" style="width: 10%">
            <template #body="slotProps">
                <Button icon="pi pi-tags" class="p-button-success p-button-sm mr-2" outlined @click="handleAdicionar(slotProps.node.data.id)" />
                <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps.node.data.id)" />
                <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete(slotProps.node.data)" />
            </template>
        </Column>
    </TreeTable>
    
</template>
