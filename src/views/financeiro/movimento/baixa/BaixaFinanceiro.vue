<script setup>
import { ref } from 'vue';
import SelecaoBaixaFinanceiro from './SelecaoBaixaFinanceiro.vue';
import ExecucaoBaixaFinanceiro from './ExecucaoBaixaFinanceiro.vue';

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
    <SelecaoBaixaFinanceiro v-if="mode === 'selecao'" @clickSelecao="handleSelecao" />
    <ExecucaoBaixaFinanceiro v-else v-model="registrosSelecionados" @doCancelar="handleCancelarExecucao"/>
</template>
