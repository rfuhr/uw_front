<script setup>
import { ref, reactive } from 'vue';
import ManutencaoCarteiraFinanceira from './ManutencaoCarteiraFinanceira.vue';
import { useDelete } from '@/composables/useDelete';
import { CarteiraFinanceiraService as Service } from '@/service';

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
        size: '50%'
    },
    {
        label: 'Sigla',
        field: 'sigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
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
    const textoConfirmacao = `Após a exclusão da carteira financeira, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A carteira financeira, ${dados.nome}, foi excluida com sucesso.`
    const textoCancelado = "A exclusão da carteira financeira não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="carteirafinanceira" title="Carteira Financeira" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoCarteiraFinanceira :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
