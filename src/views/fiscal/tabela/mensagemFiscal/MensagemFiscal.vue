<script setup>
import { ref, reactive } from 'vue';
import ManutencaoMensagemFiscal from './ManutencaoMensagemFiscal.vue';
import { useDelete } from '@/composables/useDelete';
import { MensagemFiscalService as Service } from '@/service';

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
        matchMode: 'equal',
        placeholder: '',
        size: '10%'
    },
    {
        label: 'Sigla',
        field: 'sigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%'
    },
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '55%'
    },
    {
        label: 'Código Ajuste',
        field: 'codigoAjuste',
        tipoField: 'text',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%'
    },
    {
        label: 'UF',
        field: 'ufSigla',
        tipoField: 'text',
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
    const textoConfirmacao = `Após a exclusão da Mensagem Fiscal, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A Mensagem Fiscal, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão da Mensagem Fiscal não foi realizado :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="MensagemFiscal" title="Mensagem Fiscal" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoMensagemFiscal :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
