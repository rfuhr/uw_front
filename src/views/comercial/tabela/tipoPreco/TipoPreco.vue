<script setup>
import { ref, reactive } from 'vue';
import ManutencaoTipoPreco from './ManutencaoTipoPreco.vue';
import { useDelete } from '@/composables/useDelete';
import { TipoPrecoService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Código',
        field: 'codigo',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '20%'
    },
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '40%'
    },
    {
        label: 'Transferência',
        field: 'transferencia',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%'
    },   
    {
        label: 'Promocional',
        field: 'promocional',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%'
    },   
]);

const openNew = () => {
    mode.value = 'create';
    crudDialog.value = true;
};

const openEdit = (selectId) => {
    mode.value = 'edit';
    id.value = selectId;
    crudDialog.value = true;
};


const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão do Tipo do Preço, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O Tipo do Preço, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão do Tipo do Preço não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="TipoPreco" title="Tipo do Preço" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoTipoPreco :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
