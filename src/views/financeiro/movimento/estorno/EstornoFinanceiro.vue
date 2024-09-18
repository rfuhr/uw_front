<script setup>
import { ref } from 'vue';
import SelecaoEstornoFinanceiro from './SelecaoEstornoFinanceiro.vue';
import ExecucaoEstornoFinanceiro from './ExecucaoEstornoFinanceiro.vue';

const mode = ref('selecao');
const registrosSelecionados = ref([]);

const handleSelecao = (registros) => {
    mode.value = 'baixa';
    registrosSelecionados.value = registros;
};

const handleCancelarExecucao = () => {
    mode.value = 'selecao';
};

</script>

<template>
    <SelecaoEstornoFinanceiro v-if="mode === 'selecao'" @clickSelecao="handleSelecao" />
    <ExecucaoEstornoFinanceiro v-else v-model="registrosSelecionados" @doCancelar="handleCancelarExecucao"/>
</template>
