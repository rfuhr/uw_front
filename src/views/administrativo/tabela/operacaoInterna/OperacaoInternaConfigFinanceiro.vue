<script setup>
import { computed  } from 'vue';
import { IndiceFinanceiroService, TipoTituloService, GrupoFinanceiroService, CaracteristicaMovimentoFinanceiroService, HistoricoPadraoService,
            CarteiraFinanceiraService, FatoGeradorService, MotivoEstornoFinanceiroService
 } from '@/service';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});


</script>

<template>
    <div class="formgrid grid pt-0">
        <UWSeletor
            label="Índice Financeiro Padrão"
            classContainer="col-12 md:col-3"
            v-model="localModelValue.indiceFinanceiroPadraoId"
            optionLabel="nome"
            optionValue="id"
            required
            :service="IndiceFinanceiroService"
            placeholder="Selecione o índice financeiro"
            :erros="errors.value?.indiceFinanceiroPadraoId"
        />
        <UWSeletor
            id="tipoTitulo"
            classContainer="col-12 md:col-3"
            v-model="localModelValue.tipoTituloId"
            optionLabel="nome"
            optionValue="id"
            required
            label="Tipo de Título"
            :service="TipoTituloService"
            placeholder="Selecione o tipo de título"
            :erros="errors.value?.tipoTituloId"
        />        
        <UWSeletor
            id="grupoFinanceiro"
            classContainer="col-12 md:col-3"
            v-model="localModelValue.grupoFinanceiroId"
            optionLabel="nome"
            optionValue="id"
            label="Grupo Financeiro"
            required
            :service="GrupoFinanceiroService"
            placeholder="Selecione o grupo financeiro"
        />
        <UWSeletor
            id="caracteristicaMovimentoFinanceiro"
            classContainer="col-12 md:col-3"
            v-model="localModelValue.caracteristicaMovimentoFinanceiroId"
            optionLabel="nome"
            optionValue="id"
            label="Característica de Movimento"
            required
            :service="CaracteristicaMovimentoFinanceiroService"
            placeholder="Selecione a característica de movimento"
        />  
        <UWSeletor
            id="historicoPadrao"
            classContainer="col-12 md:col-3"
            v-model="localModelValue.historicoPadraoId"
            optionLabel="nome"
            optionValue="id"
            label="Histórico Padrão"
            required
            :service="HistoricoPadraoService"
            placeholder="Selecione o histórico padrão"
        />                      
        <UWSeletor
            id="carteiraFinanceira"
            classContainer="col-12 md:col-3"
            v-model="localModelValue.carteiraFinanceiraId"
            optionLabel="nome"
            optionValue="id"
            label="Carteira Financeira"
            required
            :service="CarteiraFinanceiraService"
            placeholder="Selecione a carteira financeira"
        />                      
        <UWSeletor
            id="fatoGerador"
            classContainer="col-12 md:col-3"
            v-model="localModelValue.fatoGeradorId"
            optionLabel="nome"
            optionValue="id"
            label="Fato Gerador"
            required
            :service="FatoGeradorService"
            placeholder="Selecione o fato gerador"
        />        
        <UWSeletor
            id="motivoEstornoFinanceiro"
            classContainer="col-12 md:col-3"
            v-model="localModelValue.motivoEstornoFinanceiroId"
            optionLabel="nome"
            optionValue="id"
            label="Motivo Estorno Financeiro"
            required
            :service="MotivoEstornoFinanceiroService"
            placeholder="Selecione o motivo do estorno financeiro"
        />        
    </div>
</template>
