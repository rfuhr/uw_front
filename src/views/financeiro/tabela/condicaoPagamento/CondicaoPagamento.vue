<script setup>
import { ref, reactive } from 'vue';
import ManutencaoCondicaoPagamento from './ManutencaoCondicaoPagamento.vue';
import { useDelete } from '@/composables/useDelete';
import CondicaoPagamentoService from '@/service/CondicaoPagamentoService';

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
        size: '10%'
    },
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '30%'
    },
    {
        label: 'Descrição',
        field: 'descricao',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '50%'
    }
]);

const openNew = () => {
    mode.value = 'create'
    crudDialog.value = true;
};

const openEdit = (selectId) => {
    mode.value = 'edit';
    id.value = selectId;
    crudDialog.value = true;
};


const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão da condição de pagamento, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A condição de pagamento, ${dados.nome}, foi excluida com sucesso.`
    const textoCancelado = "A exclusão da condição de pagamento não foi realizada :)"
    
    const result = await execute(CondicaoPagamentoService, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="condicaopagamento" title="Condição de Pagamento" :columns="columns" :service="CondicaoPagamentoService" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoCondicaoPagamento :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
