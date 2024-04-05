<script setup>
import { ref, reactive } from 'vue';
import ManutencaoCertificado from './ManutencaoCertificado.vue';
import { useDelete } from '@/composables/useDelete';
import { CertificadoService as Service } from '@/service'

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
    const textoConfirmacao = `Após a exclusão do certificado, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O certificado, ${dados.nome}, foi excluído com sucesso.`
    const textoCancelado = "A exclusão do certificado não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="certificado" title="Certificado" subtitle="Gerenciamento do certificados digitais da empresa" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" sortField="empresa.nome"/>
    <ManutencaoCertificado :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
