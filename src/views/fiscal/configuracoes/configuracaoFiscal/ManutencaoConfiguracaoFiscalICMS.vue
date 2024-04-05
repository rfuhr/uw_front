<script setup>
import { ref, computed, onMounted } from 'vue';
import { SituacaoTributariaService, MotivoDesoneracaoService, TiposService } from '@/service';
import { useFormatString } from '@/composables/useFormatString';

const { truncate } = useFormatString();

const modalidadesBaseCalculo = ref();

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || {configuracaoFiscalIcms: {
        situacaoTributariaId: undefined,
        reducaoBaseCalculo: undefined,
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
        localModelValue.value.motivoDesoneracaoId = undefined;
        localModelValue.value.motivoDesoneracaoNome = undefined;
        localModelValue.value.motivoDesoneracaoCodigo = undefined;
        localModelValue.value.motivoDesoneracaoSTId = undefined;
        localModelValue.value.motivoDesoneracaoSTNome = undefined;
        localModelValue.value.motivoDesoneracaoSTCodigo = undefined;
        localModelValue.value.modalidadeBaseCalculo = undefined;
        localModelValue.value.reducaoBaseCalculo = undefined;
        localModelValue.value.aliquota = undefined;
        localModelValue.value.aliquotaCredito = undefined;
        localModelValue.value.diferencialAliquota = undefined;
        localModelValue.value.somaIpiBaseCalculo = false;
        localModelValue.value.modalidadeBaseCalculoST = undefined;
        localModelValue.value.reducaoBaseCalculoST = undefined;
        localModelValue.value.aliquotaST = undefined;
        localModelValue.value.margemValorAgregadoST = undefined;
        localModelValue.value.somaIpiBaseCalculoST = false;
    }
};

const changeMotivoDesoneracao = (event) => {
    if (event) {
        localModelValue.value.motivoDesoneracaoNome = event.nome;
        localModelValue.value.motivoDesoneracaoCodigo = event.codigo;
    } else {
        localModelValue.value.motivoDesoneracaoId = undefined;
        localModelValue.value.motivoDesoneracaoNome = undefined;
        localModelValue.value.motivoDesoneracaoCodigo = undefined;
    }
};

const changeMotivoDesoneracaoST = (event) => {
    if (event) {
        localModelValue.value.motivoDesoneracaoSTNome = event.nome;
        localModelValue.value.motivoDesoneracaoSTCodigo = event.codigo;
    } else {
        localModelValue.value.motivoDesoneracaoSTId = undefined;
        localModelValue.value.motivoDesoneracaoSTNome = undefined;
        localModelValue.value.motivoDesoneracaoSTCodigo = undefined;
    }
};

onMounted(async () => {
    await TiposService.getModalidadeBaseCalculo().then((data) => {
        modalidadesBaseCalculo.value = data;
    });
});

</script>

<template>
    <UWFieldSet title="Configuração Fiscal do ICMS" class="col-12">
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
                        :columnsFilters="[{ field: 'tipoTributo', value: 'ICMS', matchMode: 'equal', tipoField: 'text', fieldFilter: 'tipoTributo' }]"
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
                        id="seletorMotivoDesoneracao" 
                        label="Motivo Desoneração" 
                        v-model="localModelValue.motivoDesoneracaoId" 
                        optionLabel="nome" 
                        optionValue="id" 
                        placeholder="Selecione a Motivo Desoneração" 
                        :service="MotivoDesoneracaoService" 
                        classContainer="col-12 md:col-6"
                        @changeObject="changeMotivoDesoneracao"
                        :filtersSearch="[{ field: 'codigo', matchMode: 'equals', tipoField: 'integer', fieldFilter: 'codigo', labelFilter: 'Código'},
                                        { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome'},
                                    ]"
                        fieldSearchDefault="nome"
                        >
                        <template #values> {{ localModelValue.motivoDesoneracaoCodigo }} - {{ localModelValue.motivoDesoneracaoNome }} </template>
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
            <div class="field md:col-3 pt-0">
                    <span class="p-float-label">
                        <ToggleButton
                            v-model="localModelValue.somaIpiBaseCalculo"
                            onLabel="Soma IPI na Base de Cálculo"
                            offLabel="Soma IPI na Base de Cálculo"
                            onIcon="pi pi-lock"
                            offIcon="pi pi-lock-open"
                            class="w-full"
                            aria-label="Do you confirm"
                            :pt="{
                                root: {
                                    class: [{ 'h-full': true, 'bg-green-100 border-white': localModelValue.somaIpiBaseCalculo, 'bg-red-100 border-white': !localModelValue.somaIpiBaseCalculo }]
                                }
                            }"
                        />
                    </span>
            </div>
        </div>
    </UWFieldSet>
    <UWFieldSet title="Configuração Fiscal do ICMS de Substituição Tributária" class="col-12">
        <div class="p-fluid formgrid grid">
            <UWSeletor 
                        id="seletorMotivoDesoneracaoST" 
                        label="Motivo Desoneração ST" 
                        v-model="localModelValue.motivoDesoneracaoSTId" 
                        optionLabel="nome" 
                        optionValue="id" 
                        placeholder="Selecione a Motivo Desoneração ST" 
                        :service="MotivoDesoneracaoService" 
                        classContainer="col-12 md:col-6"
                        @changeObject="changeMotivoDesoneracaoST"
                        :filtersSearch="[{ field: 'codigo', matchMode: 'equals', tipoField: 'integer', fieldFilter: 'codigo', labelFilter: 'Código'},
                                        { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome'},
                                    ]"
                        fieldSearchDefault="nome"
                        >
                        <template #values> {{ localModelValue.motivoDesoneracaoSTCodigo }} - {{ localModelValue.motivoDesoneracaoSTNome }} </template>
                        <template #options="slotProps">
                            <div class="flex flex-column">
                                {{ truncate(slotProps.option.nome, 100 )}} 
                                <div class="text-700 text-sm"><span>Código:</span> {{ slotProps.option.codigo }} </div>
                            </div>
                        </template>
            </UWSeletor>
            <UWPickList id="modalidadeBaseCalculoST" label="Modalidade da Base de Cálculo ST" v-model="localModelValue.modalidadeBaseCalculoST" optionLabel="name" optionValue="value" :options="modalidadesBaseCalculo" classContainer="col-12 md:col-3" />        
            <UWDecimal id="reducaoBaseCalculoST" label="% de Redução da Base de Cálculo ST" maximoDigitos="3" v-model="localModelValue.reducaoBaseCalculoST" classContainer="col-12 md:col-3" />               
            <UWDecimal id="aliquotaST" label="Aliquota ST" maximoDigitos="3" v-model="localModelValue.aliquotaST" classContainer="col-12 md:col-3" />               
            <UWDecimal id="margemValorAgregadoST" label="Margem Valor Agregado ST" maximoDigitos="3" v-model="localModelValue.margemValorAgregadoST" classContainer="col-12 md:col-3" /> 
            <div class="field md:col-3 pt-0">
                    <span class="p-float-label">
                        <ToggleButton
                            v-model="localModelValue.somaIpiBaseCalculoST "
                            onLabel="Soma IPI na Base de Cálculo ST"
                            offLabel="Soma IPI na Base de Cálculo ST"
                            onIcon="pi pi-lock"
                            offIcon="pi pi-lock-open"
                            class="w-full"
                            aria-label="Do you confirm"
                            :pt="{
                                root: {
                                    class: [{ 'h-full': true, 'bg-green-100 border-white': localModelValue.somaIpiBaseCalculoST, 'bg-red-100 border-white': !localModelValue.somaIpiBaseCalculoST }]
                                }
                            }"
                        />
                    </span>
            </div>
        </div>
    </UWFieldSet>
</template>
