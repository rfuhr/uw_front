<script setup>
import { ref, reactive } from 'vue';
import { useDelete } from '@/composables/useDelete';
import { TipoContratoAgricolaService as Service } from '@/service';
import ManutencaoTipoContratoAgricola from './ManutencaoTipoContratoAgricola.vue';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Código',
        field: 'codigo',
        tipoField: 'number',
        filter: true,
        matchMode: 'equals',
        placeholder: '',
        size: '8%'
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
        label: 'Sigla',
        field: 'sigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%'
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
    const textoConfirmacao = `Após a exclusão do tipo de contrato agrícola, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O tipo de contrato agrícola, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão do tipo de contrato agrícola não foi realizado :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="tipocontratoagricola" title="Tipo de Contrato Agrícola" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoTipoContratoAgricola :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
