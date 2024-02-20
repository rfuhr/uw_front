<script setup>
import { ref, reactive } from 'vue';
import ManutencaoConfiguracaoFiscal from './ManutencaoConfiguracaoFiscal.vue';
import { useDelete } from '@/composables/useDelete';
import { ConfiguracaoFiscalService as Service } from '@/service';

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
    const textoConfirmacao = `Após a exclusão da Configuração Fiscal, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A Configuração Fiscal, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão da Configuração Fiscal não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="configuraçãofiscal" title="Configuração Fiscal" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoConfiguracaoFiscal :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
