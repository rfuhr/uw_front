<script setup>
import { ref, reactive } from 'vue';
import ManutencaoConfigCalculoPreco from './ManutencaoConfigCalculoPreco.vue';
import { useDelete } from '@/composables/useDelete';
import { ConfigCalculoPrecoService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Identificador',
        field: 'id',
        tipoField: 'integer',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '8%'
    },
    {
        label: 'Tipo de Preço',
        field: 'tipoPrecoNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '25%'
    },
    {
        label: 'Dias Busca Preço',
        field: 'diasBuscaPrecos',
        tipoField: 'integer',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '8%'
    },
    {
        label: 'Aplica Índices de Markup',
        field: 'aplicaIndicesMarkup',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%'
    },   
    {
        label: 'Aplica Percentual Fixo',
        field: 'aplicaPercentualFixo',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%'
    },   
    {
        label: 'Percentual',
        field: 'percentual',
        tipoField: 'text',
        filter: false,
        placeholder: '',
        size: '8%'
    },
    {
        label: 'Início Vigência',
        field: 'dataInicioVigencia',
        filter: false,
        placeholder: '',
        size: '12%',
        tipoField: 'maskDate',
        maskDate: 'dd/MM/yyyy'        
    },
    {
        label: 'Final Vigência',
        field: 'dataFinalVigencia',
        filter: false,
        placeholder: '',
        size: '12%',
        tipoField: 'maskDate',
        maskDate: 'dd/MM/yyyy'        
    }
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
    const textoConfirmacao = `Após a exclusão da Configuração do Cálculo de Preço, ${dados.codigo}, você não poderá reverter isso!`
    const textoSucesso = `A Configuração do Cálculo de Preço foi excluída com sucesso.`
    const textoCancelado = "A exclusão da Configuração do Cálculo de Preço não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="configCalculoPreco" title="Configuração do Cálculo de Preço" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoConfigCalculoPreco :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
