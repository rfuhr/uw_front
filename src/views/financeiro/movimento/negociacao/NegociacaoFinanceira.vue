<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SelecaoNegociacaoFinanceira from './SelecaoNegociacaoFinanceira.vue';
import ExecucaoNegociacaoFinanceira from './ExecucaoNegociacaoFinanceira.vue';

const router = useRouter();

const mode = ref('selecao');
const registrosSelecionados = ref([]);
const parceiroLocalIdSelecionado = ref(null);
const tipoTituloIdSelecionado = ref(null);

const handleSelecao = (registros, parceiroLocalId, tipoTituloId) => {
    parceiroLocalIdSelecionado.value = parceiroLocalId;
    registrosSelecionados.value = registros;
    tipoTituloIdSelecionado.value = tipoTituloId;
    mode.value = 'negociar';
};

const handleCancelarSelecao = () => {
    router.push({ path: '/financeiro/movimento/negociacao' });
};

const handleCancelarExecucao = () => {
    router.push({ path: '/financeiro/movimento/negociacao' });
};

</script>

<template>
    <SelecaoNegociacaoFinanceira v-if="mode === 'selecao'" @clickSelecao="handleSelecao" @clickCancelar="handleCancelarSelecao"/>
    <ExecucaoNegociacaoFinanceira v-else v-model="registrosSelecionados" :tipoTitulo="tipoTituloIdSelecionado" :parceiroLocal="parceiroLocalIdSelecionado" @doCancelar="handleCancelarExecucao"/>
</template>
