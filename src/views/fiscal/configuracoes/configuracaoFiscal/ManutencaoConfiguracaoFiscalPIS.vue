<script setup>
import { ref, computed, onMounted } from 'vue';
import { SituacaoTributariaService, TiposService } from '@/service';
import { useFormatString } from '@/composables/useFormatString';

const { truncate } = useFormatString();

const tiposCalculo = ref();

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || {configuracaoFiscalPis: {
        situacaoTributariaId: undefined
    }},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const changeSituacaoTributaria = (event) => {
    if (event) {
        localModelValue.value.situacaoTributariaNome = event.nome;
        localModelValue.value.situacaoTributariaCodigo = event.codigo;
    } else {
        localModelValue.value.situacaoTributariaId = undefined;
        localModelValue.value.situacaoTributariaNome = undefined;
        localModelValue.value.situacaoTributariaCodigo = undefined;
        localModelValue.value.tipoCalculo = undefined;
        localModelValue.value.aliquota = undefined;
        localModelValue.value.tipoCalculoST = undefined;
        localModelValue.value.aliquotaST = undefined;
    }
};

const changeTipoCalculo = (event) => {
    if (event) {
        if (event.value == 'V') {
            localModelValue.value.aliquota = undefined;
        } else if (event.value == 'P') {
            localModelValue.value.valorUnidade = undefined;
        }
    } else {
        localModelValue.value.aliquota = undefined;
        localModelValue.value.valorUnidade = undefined;
    }
}

const changeTipoCalculoST = (event) => {
    if (event) {
        if (event.value == 'V') {
            localModelValue.value.aliquotaST = undefined;
        } else if (event.value == 'P') {
            localModelValue.value.valorUnidadeST = undefined;
        }
    } else {
        localModelValue.value.aliquotaST = undefined;
        localModelValue.value.valorUnidadeST = undefined;
    }
}

onMounted(async () => {
    await TiposService.getTipoCalculo().then((data) => {
        tiposCalculo.value = data;
    });
});

</script>

<template>
    <UWFieldSet title="Configuração Fiscal do PIS" class="col-12">
        <div class="p-fluid formgrid grid">
            <UWSeletor 
                        id="seletorSituacaoTributaria" 
                        label="Situação Tributária" 
                        v-model="localModelValue.situacaoTributariaId" 
                        optionLabel="nome" 
                        optionValue="id" 
                        placeholder="Selecione a Situação Tributária" 
                        :service="SituacaoTributariaService" 
                        classContainer="col-12 md:col-12"
                        @changeObject="changeSituacaoTributaria"
                        :filtersSearch="[{ field: 'codigo', matchMode: 'equals', tipoField: 'integer', fieldFilter: 'codigo', labelFilter: 'Código'},
                                        { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome'},
                                    ]"
                        fieldSearchDefault="nome"
                        :columnsFilters="[{ field: 'tipoTributo', value: 'IPI', matchMode: 'equal', tipoField: 'text', fieldFilter: 'tipoTributo' }]"
                        >
                        <template #values> {{ localModelValue.situacaoTributariaCodigo }} - {{ localModelValue.situacaoTributariaNome }} </template>
                        <template #options="slotProps">
                            <div class="flex flex-column">
                                {{ truncate(slotProps.option.nome, 100 )}} 
                                <div class="text-700 text-sm"><span>Código:</span> {{ slotProps.option.codigo }} </div>
                            </div>
                        </template>
            </UWSeletor>
            <UWPickList id="tipoCalculo" label="Tipo de Cálculo" @changeObject="changeTipoCalculo" v-model="localModelValue.tipoCalculo" optionLabel="name" optionValue="value" :options="tiposCalculo" classContainer="col-12 md:col-2" />        
            <UWDecimal id="aliquota" label="Aliquota" maximoDigitos="3" :disabled="localModelValue.tipoCalculo === 'V'" v-model="localModelValue.aliquota" classContainer="col-12 md:col-2" />               
            <UWDecimal id="valorUnidade" label="Valor Unidade" maximoDigitos="2" :disabled="localModelValue.tipoCalculo === 'P'" v-model="localModelValue.valorUnidade" classContainer="col-12 md:col-2" />               
            <UWPickList id="tipoCalculoST" label="Tipo de Cálculo ST" @changeObject="changeTipoCalculoST" v-model="localModelValue.tipoCalculoST" optionLabel="name" optionValue="value" :options="tiposCalculo" classContainer="col-12 md:col-2" />        
            <UWDecimal id="aliquotaST" label="Aliquota ST" maximoDigitos="3" :disabled="localModelValue.tipoCalculoST === 'V'" v-model="localModelValue.aliquotaST" classContainer="col-12 md:col-2" />               
            <UWDecimal id="valorUnidadeST" label="Valor Unidade ST" maximoDigitos="2" :disabled="localModelValue.tipoCalculoST === 'P'" v-model="localModelValue.valorUnidadeST" classContainer="col-12 md:col-2" />               
        </div>
    </UWFieldSet>
</template>
