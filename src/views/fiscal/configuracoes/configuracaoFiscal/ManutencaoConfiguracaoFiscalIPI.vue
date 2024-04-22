<script setup>
import { ref, computed, onMounted } from 'vue';
import { SituacaoTributariaService, EnquadramentoService, TiposService } from '@/service';
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
    get: () => props.modelValue || {configuracaoFiscalIpi: {
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
        localModelValue.value.enquadramentoId = undefined;
        localModelValue.value.enquadramentoNome = undefined;
        localModelValue.value.enquadramentoCodigo = undefined;
        localModelValue.value.tipoCalculo = undefined;
        localModelValue.value.aliquota = undefined;
        localModelValue.value.codigoSelo = undefined;
        localModelValue.value.quantidadeSelo = undefined;
    }
};

const changeTipoCalculo = (event) => {
    if (event) {
        if (event.value == 'Q') {
            localModelValue.value.aliquota = undefined;
        } else if (event.value == 'A') {
            localModelValue.value.valorUnidade = undefined;
        }
    } else {
        localModelValue.value.aliquota = undefined;
        localModelValue.value.valorUnidade = undefined;
    }
}

const changeEnquadramento = (event) => {
    if (event) {
        localModelValue.value.enquadramentoNome = truncate(event.nome, 100);
        localModelValue.value.enquadramentoCodigo = event.codigo;
    } else {
        localModelValue.value.enquadramentoId = undefined;
        localModelValue.value.enquadramentoNome = undefined;
        localModelValue.value.enquadramentoCodigo = undefined;
    }
};

onMounted(async () => {
    await TiposService.getTipoCalculo().then((data) => {
        tiposCalculo.value = data;
    });
});

</script>

<template>
    <UWFieldSet title="Configuração Fiscal do IPI" class="col-12">
        <div class="p-fluid formgrid grid">
            <UWSeletor 
                        id="seletorSituacaoTributaria" 
                        label="Situação Tributária" 
                        v-model="localModelValue.situacaoTributariaId" 
                        optionLabel="nome" 
                        optionValue="id" 
                        placeholder="Selecione a Situação Tributária" 
                        :service="SituacaoTributariaService" 
                        classContainer="col-12 md:col-6"
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
            <UWSeletor 
                        id="seletorEnquadramento" 
                        label="Enquadramento" 
                        v-model="localModelValue.enquadramentoId" 
                        optionLabel="nome" 
                        optionValue="id" 
                        placeholder="Selecione a Enquadramento" 
                        :service="EnquadramentoService" 
                        classContainer="col-12 md:col-6"
                        @changeObject="changeEnquadramento"
                        :filtersSearch="[{ field: 'codigo', matchMode: 'equals', tipoField: 'integer', fieldFilter: 'codigo', labelFilter: 'Código'},
                                        { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome'},
                                    ]"
                        fieldSearchDefault="nome"
                        >
                        <template #values> {{ localModelValue.enquadramentoCodigo }} - {{ localModelValue.enquadramentoNome }} </template>
                        <template #options="slotProps">
                            <div class="flex flex-column">
                                {{ truncate(slotProps.option.nome, 100 )}} 
                                <div class="text-700 text-sm"><span>Código:</span> {{ slotProps.option.codigo }} </div>
                            </div>
                        </template>
            </UWSeletor>
            <UWPickList id="tipoCalculo" label="Tipo de Cálculo" @changeObject="changeTipoCalculo" v-model="localModelValue.tipoCalculo" optionLabel="name" optionValue="value" :options="tiposCalculo" classContainer="col-12 md:col-2" />        
            <UWDecimal id="aliquota" label="Aliquota" :disabled="localModelValue.tipoCalculo === 'Q'" maximoDigitos="3" v-model="localModelValue.aliquota" classContainer="col-12 md:col-3" />
            <UWDecimal id="valorUnidade" label="Valor Unidade" :disabled="localModelValue.tipoCalculo === 'A'" maximoDigitos="5" v-model="localModelValue.valorUnidade" classContainer="col-12 md:col-3" />               
            <UWInput id="codigoSelo" label="Código do Selo" uppercase v-model="localModelValue.codigoSelo" classContainer="col-12 md:col-2" />
            <UWInteger id="quantidadeSelo" label="Quantidade Selo" maximoDigitos="3" v-model="localModelValue.quantidadeSelo" classContainer="col-12 md:col-2" />               
        </div>
    </UWFieldSet>
</template>
