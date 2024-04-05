<script setup>
import { ref, reactive } from 'vue';
import ManutencaoTipoDocumento from './ManutencaoTipoDocumento.vue';
import { useDelete } from '@/composables/useDelete';
import { TipoDocumentoService as Service } from '@/service'

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
        placeholder: '',
        size: '50%',
        sortable: true
    },
    {
        label: 'Sigla',
        field: 'sigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortable: true
    },
    {
        label: 'Código Receita',
        field: 'codigoReceita',
        tipoField: 'text',
        fieldFilter: 'codigoReceita',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortable: true
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
    const textoConfirmacao = `Após a exclusão do tipo de documento, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O tipo de documento, ${dados.nome}, foi excluído com sucesso.`
    const textoCancelado = "A exclusão do tipo de documento não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="tipodocumento" title="Tipo de Documento" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" sortField="nome"/>
    <ManutencaoTipoDocumento :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
