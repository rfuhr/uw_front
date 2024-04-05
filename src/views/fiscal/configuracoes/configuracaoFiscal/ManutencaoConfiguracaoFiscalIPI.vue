<script setup>
import { ref, computed, onMounted } from 'vue';
import { SituacaoTributariaService, EnquadramentoService, TiposService } from '@/service';
import { useFormatString } from '@/composables/useFormatString';

const { truncate } = useFormatString();

const modalidadesBaseCalculo = ref();
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
        situacaoTributariaId: undefined,
        reducaoBaseCalculo: undefined,
    }},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const changeSituacaoTributaria = (event) => {
    console.log(event)
    if (event) {
        localModelValue.value.situacaoTributariaNome = event.nome;
        localModelValue.value.situacaoTributariaCodigo = event.codigo;
    } else {
        localModelValue.value.situacaoTributariaId = undefined;
        localModelValue.value.situacaoTributariaNome = undefined;
        localModelValue.value.situacaoTributariaCodigo = undefined;
        localModelValue.value.EnquadramentoId = undefined;
        localModelValue.value.EnquadramentoNome = undefined;
        localModelValue.value.EnquadramentoCodigo = undefined;
        localModelValue.value.modalidadeBaseCalculo = undefined;
        localModelValue.value.tipoCalculo = undefined;
        localModelValue.value.aliquota = undefined;
        localModelValue.value.codigoSelo = undefined;
        localModelValue.value.quantidadeSelo = undefined;
    }
};

const changeEnquadramento = (event) => {
    console.log(event)
    if (event) {
        localModelValue.value.EnquadramentoNome = truncate(event.nome, 100);
        localModelValue.value.EnquadramentoCodigo = event.codigo;
    } else {
        localModelValue.value.EnquadramentoId = undefined;
        localModelValue.value.EnquadramentoNome = undefined;
        localModelValue.value.EnquadramentoCodigo = undefined;
    }
    console.log(localModelValue.value)
};

onMounted(async () => {
    await TiposService.getModalidadeBaseCalculo().then((data) => {
        modalidadesBaseCalculo.value = data;
    });
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
            <UWPickList id="modalidadeBaseCalculo" label="Modalidade da Base de Cálculo" v-model="localModelValue.modalidadeBaseCalculo" optionLabel="name" optionValue="value" :options="modalidadesBaseCalculo" classContainer="col-12 md:col-3" />        
            <UWDecimal id="reducaoBaseCalculo" label="% de Redução da Base de Cálculo" maximoDigitos="3" v-model="localModelValue.reducaoBaseCalculo" classContainer="col-12 md:col-3" />               
            <UWDecimal id="aliquota" label="Aliquota" maximoDigitos="3" v-model="localModelValue.aliquota" classContainer="col-12 md:col-3" />               
            <UWDecimal id="aliquotaCredito" label="Aliquota Crédito" maximoDigitos="3" v-model="localModelValue.aliquotaCredito" classContainer="col-12 md:col-3" />               
            <UWDecimal id="diferencialAliquota" label="Diferencial Aliquota" maximoDigitos="3" v-model="localModelValue.diferencialAliquota" classContainer="col-12 md:col-3" />               
        </div>
    </UWFieldSet>
</template>
