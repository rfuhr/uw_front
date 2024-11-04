<script setup>
import { ref, reactive } from 'vue';
import ManutencaoConfigAutorizacaoSolicitacaoMercadoria from './ManutencaoConfigAutorizacaoSolicitacaoMercadoria.vue';
import { useDelete } from '@/composables/useDelete';
import { ConfigAutorizacaoSolicitacaoMercadoriaService as Service } from '@/service';

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
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        fieldFilter: 'empresa.nome'
    },  
    {
        label: 'Filial',
        field: 'empresaFilialNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '25%',
        fieldFilter: 'empresaFilial.nome'
    },
    {
        label: 'Departamento',
        field: 'departamentoNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '25%',
        fieldFilter: 'departamento.nome'
    },
    {
        label: 'Grupo Contábil',
        field: 'grupoContabilNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '25%',
        fieldFilter: 'grupoContabil.nome'
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
    const textoConfirmacao = `Após a exclusão da configuração de autorização, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A configuração de autorização, ${dados.nome}, foi excluida com sucesso.`
    const textoCancelado = "A exclusão da configuração de autorização não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="configautorizacaosolicitacaomercadoria" title="Configuração de Autorização para Solicitação" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoConfigAutorizacaoSolicitacaoMercadoria :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
