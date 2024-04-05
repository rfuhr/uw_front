<script setup>
import { ref, reactive } from 'vue';
import ManutencaoConfigEmpresa from './ManutencaoConfigEmpresa.vue';
import { useDelete } from '@/composables/useDelete';
import { ConfigEmpresaService as Service } from '@/service'

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Empresa',
        field: 'empresaNome',
        tipoField: 'string',
        filter: false,
        matchMode: 'contains',
        placeholder: '',
        size: '80%',
        sortable: true,
        sortField: 'empresa.nome'
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
    const textoConfirmacao = `Após a exclusão da configuração, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A configuração, ${dados.nome}, foi excluída com sucesso.`
    const textoCancelado = "A exclusão da configuração não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="configempresa" title="Configuração da Empresa" subtitle="Realizar as configurações no âmbito da empresa" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" sortField="empresa.nome"/>
    <ManutencaoConfigEmpresa :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
