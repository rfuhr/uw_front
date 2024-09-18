<script setup>
import { ref, onMounted } from 'vue';
import { useDelete } from '@/composables/useDelete';
import { PlanoClassificacaoFinanceiraService } from '@/service';
import ManutencaoClassificacaoFinanceira from './ManutencaoClassificacaoFinanceira.vue';

const { execute } = useDelete();

const treeTableValue = ref(null);
const mode = ref();
const idRegistro = ref(0);
const idRegistroSuperior = ref(0);
const visibleDialog = ref(false);
const contaSuperior = ref();

const newConta = () => {
    mode.value = 'novaConta';
    visibleDialog.value = true;
    contaSuperior.value = null;
};

const closeDialog = () => {
    getEstrutura();
    visibleDialog.value = false;
};

const getEstrutura = () => {
    PlanoClassificacaoFinanceiraService.getJsonEstrutura().then(response => {
        treeTableValue.value = response;
    });
}

const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão da conta, ${dados?.nome}, você não poderá reverter isso!`
    const textoSucesso = `A conta, ${dados?.nome}, foi excluído com sucesso.`
    const textoCancelado = "A exclusão da conta não foi realizada :)"
    
    const result = await execute(PlanoClassificacaoFinanceiraService, dados?.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) getEstrutura();
};

const openEdit = (selectId) => {
    mode.value = 'edit';
    idRegistro.value = selectId;
    visibleDialog.value = true;
};

const openAdicionar = (selectIdContaSuperior) => {
    mode.value = 'novaSubConta';
    idRegistroSuperior.value = selectIdContaSuperior;
    visibleDialog.value = true;
};

onMounted(() => {
    getEstrutura();
});

</script>

<template>
    <UWPageBase title="Classificação Financeira" subtitle="Definição da estrutura de contas para classificação financeira.">
        <UWEstruturaConta :nodes="treeTableValue" @openNew="newConta" @openDelete="openDelete" @openEdit="openEdit" @openAdicionar="openAdicionar"/> 
    </UWPageBase>
    <ManutencaoClassificacaoFinanceira :idRegistro="idRegistro" :showDialog="visibleDialog" :mode="mode" :idRegistroSuperior="idRegistroSuperior" @closeDialog="closeDialog"/>
</template>
