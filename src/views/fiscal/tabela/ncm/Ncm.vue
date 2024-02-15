<script setup>
import { ref, reactive } from 'vue';
import ManutencaoNcm from './ManutencaoNcm.vue';
import { useDelete } from '@/composables/useDelete';
import { NcmService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Código',
        field: 'codigo',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%'
    },
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '45%'
    },
    {
        label: 'Início Vigência',
        field: 'dataInicioVigencia',
        tipoField: 'date',
        filter: false,
        placeholder: '',
        size: '15%'
    },
    {
        label: 'Final Vigência',
        field: 'dataFinalVigencia',
        tipoField: 'date',
        filter: false,
        placeholder: '',
        size: '15%'
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
    const textoConfirmacao = `Após a exclusão do NCM, ${dados.codigo}, você não poderá reverter isso!`
    const textoSucesso = `O NCM, ${dados.codigo}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão do NCM não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="ncm" title="NCM" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoNcm :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
