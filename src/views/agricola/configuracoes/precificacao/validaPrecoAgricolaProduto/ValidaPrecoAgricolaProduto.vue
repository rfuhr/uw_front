<script setup>
import { ref, reactive } from 'vue';
import ManutencaoValidaPrecoAgricolaProduto from './ManutencaoValidaPrecoAgricolaProduto.vue';
import { useDelete } from '@/composables/useDelete';
import { ValidaPrecoAgricolaItemService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Produto',
        field: 'itemNome',
        tipoField: 'string',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '25%',
        fieldFilter: 'item.nome'
    },  
    {
        label: 'Tipo de Preço Agrícola',
        field: 'tipoPrecoAgricolaNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '25%',
        fieldFilter: 'tipoPrecoAgricola.nome'
    },
    {
        label: 'Predefinição de Preço Agrícola',
        field: 'predefinicaoPrecoAgricolaNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '25%',
        fieldFilter: 'predefinicaoPrecoAgricola.nome'
    },
    {
        label: 'Início Vigência',
        field: 'dataInicioVigencia',
        tipoField: 'maskDate',
        filter: false,
        placeholder: '',
        size: '8%',
        maskDate: 'dd/MM/yyyy'
    },
    {
        label: 'Final Vigência',
        field: 'dataFinalVigencia',
        filter: false,
        placeholder: '',
        size: '8%',
        tipoField: 'maskDate',
        maskDate: 'dd/MM/yyyy'
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
    const textoConfirmacao = `Após a exclusão da validação de preço agrícola x produto, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A validação de preço agrícola x produto, ${dados.nome}, foi excluida com sucesso.`
    const textoCancelado = "A exclusão da validação de preço agrícola x produto não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="validaprecoagricolaproduto" title="Validação de Preço Agrícola x Produto" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoValidaPrecoAgricolaProduto :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
