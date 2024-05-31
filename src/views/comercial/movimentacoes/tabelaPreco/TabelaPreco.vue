<script setup>
import { ref, reactive } from 'vue';
import ManutencaoTabelaPreco from './ManutencaoTabelaPreco.vue';
import { useDelete } from '@/composables/useDelete';
import { TabelaPrecoService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Filial',
        field: 'empresaFilialId',
        tipoField: 'integer',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '5%'
    },
    {
        label: 'Código',
        field: 'codigo',
        tipoField: 'integer',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '5%'
    },
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%'
    },
    {
        label: 'Tipo de Preço',
        field: 'tipoPrecoNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%'
    },
    {
        label: 'Grupo Contábil',
        field: 'grupoContabilNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%'
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
    const textoConfirmacao = `Após a exclusão da Tabela de Preço, ${dados.codigo}, você não poderá reverter isso!`
    const textoSucesso = `A Tabela de Preço foi excluída com sucesso.`
    const textoCancelado = "A exclusão da Tabela de Preço não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="tabelaPreco" title="Tabela de Preço" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoTabelaPreco :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
