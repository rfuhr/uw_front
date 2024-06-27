<script setup>
import { ref } from 'vue';
import SelecaoSubstituicaoCarteira from './SelecaoSubstituicaoCarteira.vue';
import ExecucaoSubstituicaoCarteira from './ExecucaoSubstituicaoCarteira.vue';

const mode = ref('selecao');
const registrosSelecionados = ref([]);
const carteiraFinanceiraDestinoIdSelecionado = ref(null);

const handleSelecao = (registros, carteiraFinanceiraDestinoId) => {
    carteiraFinanceiraDestinoIdSelecionado.value = carteiraFinanceiraDestinoId;
    registrosSelecionados.value = registros;
    mode.value = 'baixa';
};

const handleVoltarVisualizacao = () => {
    mode.value = 'selecao';
};

</script>

<template>
    <SelecaoSubstituicaoCarteira v-if="mode === 'selecao'" @clickSelecao="handleSelecao" />
    <ExecucaoSubstituicaoCarteira v-else v-model="registrosSelecionados" :carteiraDestino="carteiraFinanceiraDestinoIdSelecionado" @doCancelar="handleVoltarVisualizacao"/>
</template>
