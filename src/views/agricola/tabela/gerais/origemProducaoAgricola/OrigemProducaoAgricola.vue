<script setup>
import { ref, reactive } from 'vue';
import ManutencaoOrigemProducaoAgricola from './ManutencaoOrigemProducaoAgricola.vue';
import { useDelete } from '@/composables/useDelete';
import { OrigemProducaoAgricolaService as Service } from '@/service';

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
        matchMode: 'equals',
        placeholder: '',
        size: '7%'
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
    const textoConfirmacao = `Após a exclusão da origem de produção, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A origem de produção, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão da origem de produção não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="origemproducaoagricola" title="Origem de Produção Agrícola" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoOrigemProducaoAgricola :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
