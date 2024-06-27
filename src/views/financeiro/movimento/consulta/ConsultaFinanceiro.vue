<script setup>
import { ref } from 'vue';
import SelecaoConsultaFinanceiro from './SelecaoConsultaFinanceiro.vue';
import VisualizacaoConsultaFinanceiro from './VisualizacaoConsultaFinanceiro.vue';

const mode = ref('selecao');
const registrosSelecionados = ref([]);

const handleSelecao = (registros) => {
    mode.value = 'baixa';
    registrosSelecionados.value = registros;
};

const handleVoltarVisualizacao = () => {
    mode.value = 'selecao';
};

</script>

<template>
    <SelecaoConsultaFinanceiro v-if="mode === 'selecao'" @clickSelecao="handleSelecao" />
    <VisualizacaoConsultaFinanceiro v-else v-model="registrosSelecionados" @doVoltar="handleVoltarVisualizacao"/>
</template>
