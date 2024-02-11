<script setup>
import { ref, reactive } from 'vue';
import ManutencaoUF from './ManutencaoUf.vue';
import { useDelete } from '@/composables/useDelete';
import { UfService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: 'Busca por Nome...',
        size: '40%'
    },
    {
        label: 'Sigla',
        field: 'sigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: 'Busca por Sigla...',
        size: '10%'
    },
    {
        label: 'Código',
        field: 'codigo',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: 'Busca por Código...',
        size: '20%'
    }
]);

const openNew = () => {
    crudDialog.value = true;
};

const openEdit = (selectId) => {
    mode.value = 'edit';
    id.value = selectId;
    crudDialog.value = true;
};


const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão do estado, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O estado, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão do estado não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="sexo" title="UFs" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoUF :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
