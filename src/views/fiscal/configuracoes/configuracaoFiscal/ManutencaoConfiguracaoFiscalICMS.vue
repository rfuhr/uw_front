<script setup>
import { ref, computed, onMounted } from 'vue';
import { SituacaoTributariaService, MotivoDesoneracaoService, TiposService } from '@/service';
import { useFormatString } from '@/composables/useFormatString';

const { truncate } = useFormatString();

const modalidadesBaseCalculo = ref();

const seletorSituacaoTributaria = ref(null);
const seletorMotivoDesoneracao = ref(null);

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    simplesNacional: {
        type: Boolean,
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
        localModelValue.value.somaFreteBaseCalculo = false;
        localModelValue.value.modalidadeBaseCalculoST = undefined;
        localModelValue.value.reducaoBaseCalculoST = undefined;
        localModelValue.value.aliquotaST = undefined;
        localModelValue.value.margemValorAgregadoST = undefined;
        localModelValue.value.somaIpiBaseCalculoST = false;
        localModelValue.value.somaFreteBaseCalculoST = false;
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

// const changeMotivoDesoneracaoST = (event) => {
//     if (event) {
//         localModelValue.value.motivoDesoneracaoSTNome = event.nome;
//         localModelValue.value.motivoDesoneracaoSTCodigo = event.codigo;
//     } else {
//         localModelValue.value.motivoDesoneracaoSTId = undefined;
//         localModelValue.value.motivoDesoneracaoSTNome = undefined;
//         localModelValue.value.motivoDesoneracaoSTCodigo = undefined;
//     }
// };

const mostrarMotivoDesoneracao = computed(() => {
    if (localModelValue.value.situacaoTributariaCodigo != null && (
        localModelValue.value.situacaoTributariaCodigo === 20 ||
        localModelValue.value.situacaoTributariaCodigo === 30 ||
        localModelValue.value.situacaoTributariaCodigo === 40 ||
        localModelValue.value.situacaoTributariaCodigo === 41 ||
        localModelValue.value.situacaoTributariaCodigo === 50 ||
        localModelValue.value.situacaoTributariaCodigo === 70 ||
        localModelValue.value.situacaoTributariaCodigo === 90
        )
    ) {
        return true
    } else {
        return false
    }
})

const mostrarAliquotaICMS = computed(() => {
    if (localModelValue.value.situacaoTributariaCodigo != null && (
        localModelValue.value.situacaoTributariaCodigo === 0 ||
        localModelValue.value.situacaoTributariaCodigo === 10 ||
        localModelValue.value.situacaoTributariaCodigo === 20 ||
        localModelValue.value.situacaoTributariaCodigo === 51 ||
        localModelValue.value.situacaoTributariaCodigo === 70 ||
        localModelValue.value.situacaoTributariaCodigo === 90 ||
        localModelValue.value.situacaoTributariaCodigo === 900
        )
    ) {
        return true
    } else {
        return false
    }        
})

const mostrarAliquotaICMSST = computed(() => {
    if (localModelValue.value.situacaoTributariaCodigo != null && (
        localModelValue.value.situacaoTributariaCodigo === 10 ||
        localModelValue.value.situacaoTributariaCodigo === 30 ||
        localModelValue.value.situacaoTributariaCodigo === 70 ||
        localModelValue.value.situacaoTributariaCodigo === 90 ||
        localModelValue.value.situacaoTributariaCodigo === 201 ||
        localModelValue.value.situacaoTributariaCodigo === 202 ||
        localModelValue.value.situacaoTributariaCodigo === 203 ||
        localModelValue.value.situacaoTributariaCodigo === 900
        )
    ) {
        return true
    } else {
        return false
    }        
})

const mostrarAliquotaCredito = computed(() => {
    if (localModelValue.value.situacaoTributariaCodigo != null && (
        localModelValue.value.situacaoTributariaCodigo === 101 ||
        localModelValue.value.situacaoTributariaCodigo === 201 ||
        localModelValue.value.situacaoTributariaCodigo === 900
        )
    ) {
        return true
    } else {
        return false
    }        
})

const mostrarDiferencialAliquota = computed(() => {
    if (localModelValue.value.situacaoTributariaCodigo != null && (
        localModelValue.value.situacaoTributariaCodigo === 51
        )
    ) {
        return true
    } else {
        return false
    }        
})

const mostrarMargemValorAgregado = computed(() => {
    if (localModelValue.value.situacaoTributariaCodigo != null && (
        localModelValue.value.situacaoTributariaCodigo === 10 ||
        localModelValue.value.situacaoTributariaCodigo === 30 ||
        localModelValue.value.situacaoTributariaCodigo === 70 ||
        localModelValue.value.situacaoTributariaCodigo === 90 ||
        localModelValue.value.situacaoTributariaCodigo === 201 ||
        localModelValue.value.situacaoTributariaCodigo === 202 ||
        localModelValue.value.situacaoTributariaCodigo === 203 ||
        localModelValue.value.situacaoTributariaCodigo === 900
        )
    ) {
        return true
    } else {
        return false
    }        
})

const mostrarModalidadeBaseCalculo = computed(() => {
    if (localModelValue.value.situacaoTributariaCodigo != null && (
        localModelValue.value.situacaoTributariaCodigo === 0 ||
        localModelValue.value.situacaoTributariaCodigo === 10 ||
        localModelValue.value.situacaoTributariaCodigo === 20 ||
        localModelValue.value.situacaoTributariaCodigo === 51 ||
        localModelValue.value.situacaoTributariaCodigo === 70 ||
        localModelValue.value.situacaoTributariaCodigo === 90 ||
        localModelValue.value.situacaoTributariaCodigo === 900
        )
    ) {
        return true
    } else {
        return false
    }        
})

const mostrarReducaoBaseCalculo = computed(() => {
    if (localModelValue.value.situacaoTributariaCodigo != null && (
        localModelValue.value.situacaoTributariaCodigo === 20 ||
        localModelValue.value.situacaoTributariaCodigo === 51 ||
        localModelValue.value.situacaoTributariaCodigo === 70 ||
        localModelValue.value.situacaoTributariaCodigo === 90 ||
        localModelValue.value.situacaoTributariaCodigo === 900
        )
    ) {
        return true
    } else {
        return false
    }        
})

const mostrarReducaoBaseCalculoST = computed(() => {
    if (localModelValue.value.situacaoTributariaCodigo != null && (
        localModelValue.value.situacaoTributariaCodigo === 10 ||
        localModelValue.value.situacaoTributariaCodigo === 30 ||
        localModelValue.value.situacaoTributariaCodigo === 70 ||
        localModelValue.value.situacaoTributariaCodigo === 90 ||
        localModelValue.value.situacaoTributariaCodigo === 201 ||
        localModelValue.value.situacaoTributariaCodigo === 202 ||
        localModelValue.value.situacaoTributariaCodigo === 203 ||
        localModelValue.value.situacaoTributariaCodigo === 900
        )
    ) {
        return true
    } else {
        return false
    }        
})

const mostrarModalidadeBaseCalculoST = computed(() => {
    if (localModelValue.value.situacaoTributariaCodigo != null && (
        localModelValue.value.situacaoTributariaCodigo === 10 ||
        localModelValue.value.situacaoTributariaCodigo === 30 ||
        localModelValue.value.situacaoTributariaCodigo === 70 ||
        localModelValue.value.situacaoTributariaCodigo === 90 ||
        localModelValue.value.situacaoTributariaCodigo === 201 ||
        localModelValue.value.situacaoTributariaCodigo === 202 ||
        localModelValue.value.situacaoTributariaCodigo === 203 ||
        localModelValue.value.situacaoTributariaCodigo === 900
        )
    ) {
        return true
    } else {
        return false
    }        
})

const mostrarInformacoesST = computed(() => {
    if (localModelValue.value.situacaoTributariaCodigo != null && (
        localModelValue.value.situacaoTributariaCodigo === 10 ||
        localModelValue.value.situacaoTributariaCodigo === 30 ||
        localModelValue.value.situacaoTributariaCodigo === 60 ||
        localModelValue.value.situacaoTributariaCodigo === 70 ||
        localModelValue.value.situacaoTributariaCodigo === 90 ||
        localModelValue.value.situacaoTributariaCodigo === 201 ||
        localModelValue.value.situacaoTributariaCodigo === 202 ||
        localModelValue.value.situacaoTributariaCodigo === 203 ||
        localModelValue.value.situacaoTributariaCodigo === 500 ||
        localModelValue.value.situacaoTributariaCodigo === 900
        )
    ) {
        return true
    } else {
        return false
    }
})
const showModal = async () => {
    console.log(localModelValue.value)
    seletorSituacaoTributaria.value.reload(localModelValue.value.situacaoTributariaId);
    seletorMotivoDesoneracao.value.reload(localModelValue.value.motivoDesoneracaoId);
}

onMounted(async () => {
    await TiposService.getModalidadeBaseCalculo().then((data) => {
        modalidadesBaseCalculo.value = data;
    });
    console.log(localModelValue.value)
    seletorSituacaoTributaria.value.reload(localModelValue.value.situacaoTributariaId);
    seletorMotivoDesoneracao.value.reload(localModelValue.value.motivoDesoneracaoId);
});

</script>

<template>
    <UWFieldSet title="Configuração Fiscal do ICMS" class="col-12">
        <div class="p-fluid formgrid grid">
            <UWSeletor 
                        id="seletorSituacaoTributaria" 
                        ref="seletorSituacaoTributaria" 
                        label="Situação Tributária" 
                        v-model="localModelValue.situacaoTributariaId" 
                        optionLabel="nome" 
                        optionValue="id" 
                        sortField="codigo"
                        placeholder="Selecione a Situação Tributária" 
                        :service="SituacaoTributariaService" 
                        classContainer="col-12 md:col-6"
                        @changeObject="changeSituacaoTributaria"
                        @loadeddata="showModal"
                        :filtersSearch="[{ field: 'codigo', matchMode: 'equals', tipoField: 'integer', fieldFilter: 'codigo', labelFilter: 'Código'},
                                        { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome'},
                                    ]"
                        fieldSearchDefault="nome"
                        :columnsFilters="[{ field: 'tipoTributo', value: 'ICMS', matchMode: 'equal', tipoField: 'text', fieldFilter: 'tipoTributo' },
                                          { field: 'simplesNacional', value: props.simplesNacional, matchMode: 'equal', tipoField: 'boolean', fieldFilter: 'simplesNacional'}
                        ]"
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
                        ref="seletorMotivoDesoneracao" 
                        label="Motivo Desoneração" 
                        v-model="localModelValue.motivoDesoneracaoId" 
                        optionLabel="nome" 
                        optionValue="id" 
                        sortField="codigo"
                        placeholder="Selecione a Motivo Desoneração" 
                        :service="MotivoDesoneracaoService" 
                        classContainer="col-12 md:col-6"
                        @changeObject="changeMotivoDesoneracao"
                        :visible="mostrarMotivoDesoneracao"
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
            <UWPickList id="modalidadeBaseCalculo" :visible="mostrarModalidadeBaseCalculo" label="Modalidade da Base de Cálculo" v-model="localModelValue.modalidadeBaseCalculo" optionLabel="name" optionValue="value" :options="modalidadesBaseCalculo" classContainer="col-12 md:col-3" />        
            <UWDecimal id="reducaoBaseCalculo" :visible="mostrarReducaoBaseCalculo" label="% de Redução da Base de Cálculo" maximoDigitos="3" v-model="localModelValue.reducaoBaseCalculo" classContainer="col-12 md:col-3" />               
            <UWDecimal id="aliquota" :visible="mostrarAliquotaICMS" label="Aliquota" maximoDigitos="3" v-model="localModelValue.aliquota" classContainer="col-12 md:col-3" />               
            <UWDecimal id="aliquotaCredito" :visible="mostrarAliquotaCredito" label="Aliquota Crédito" maximoDigitos="3" v-model="localModelValue.aliquotaCredito" classContainer="col-12 md:col-3" />               
            <UWDecimal id="diferencialAliquota" :visible="mostrarDiferencialAliquota" label="Diferencial Aliquota" maximoDigitos="3" v-model="localModelValue.diferencialAliquota" classContainer="col-12 md:col-3" />               
            <div class="field md:col-3 pt-0">
                    <span class="p-float-label">
                        <ToggleButton
                            v-model="localModelValue.somaIpiBaseCalculo"
                            onLabel="Soma IPI na Base de Cálculo"
                            offLabel="NÃO Soma IPI na Base de Cálculo"
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
            <div class="field md:col-3 pt-0">
                    <span class="p-float-label">
                        <ToggleButton
                            v-model="localModelValue.somaFreteBaseCalculo"
                            onLabel="Soma Frete na Base de Cálculo"
                            offLabel="NÃO Soma Frete na Base de Cálculo"
                            onIcon="pi pi-lock"
                            offIcon="pi pi-lock-open"
                            class="w-full"
                            aria-label="Do you confirm"
                            :pt="{
                                root: {
                                    class: [{ 'h-full': true, 'bg-green-100 border-white': localModelValue.somaFreteBaseCalculo, 'bg-red-100 border-white': !localModelValue.somaFreteBaseCalculo }]
                                }
                            }"
                        />
                    </span>
            </div>
        </div>
    </UWFieldSet>
    <UWFieldSet :visible="mostrarInformacoesST" title="Configuração Fiscal do ICMS de Substituição Tributária" class="col-12">
        <div class="p-fluid formgrid grid">
            <UWPickList id="modalidadeBaseCalculoST" :visible="mostrarModalidadeBaseCalculoST" label="Modalidade da Base de Cálculo ST" v-model="localModelValue.modalidadeBaseCalculoST" optionLabel="name" optionValue="value" :options="modalidadesBaseCalculo" classContainer="col-12 md:col-3" />        
            <UWDecimal id="reducaoBaseCalculoST" :visible="mostrarReducaoBaseCalculoST" label="% de Redução da Base de Cálculo ST" maximoDigitos="3" v-model="localModelValue.reducaoBaseCalculoST" classContainer="col-12 md:col-3" />               
            <UWDecimal id="aliquotaST" :visible="mostrarAliquotaICMSST" label="Aliquota ST" maximoDigitos="3" v-model="localModelValue.aliquotaST" classContainer="col-12 md:col-3" />               
            <UWDecimal id="margemValorAgregadoST" :visible="mostrarMargemValorAgregado" label="Margem Valor Agregado ST" maximoDigitos="3" v-model="localModelValue.margemValorAgregadoST" classContainer="col-12 md:col-3" /> 
            <div class="field md:col-3 pt-0">
                    <span class="p-float-label">
                        <ToggleButton
                            v-model="localModelValue.somaIpiBaseCalculoST "
                            onLabel="Soma IPI na Base de Cálculo ST"
                            offLabel="NÃO Soma IPI na Base de Cálculo ST"
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
            <div class="field md:col-3 pt-0">
                    <span class="p-float-label">
                        <ToggleButton
                            v-model="localModelValue.somaFreteBaseCalculoST "
                            onLabel="Soma Frete na Base de Cálculo ST"
                            offLabel="NÃO Soma Frete na Base de Cálculo ST"
                            onIcon="pi pi-lock"
                            offIcon="pi pi-lock-open"
                            class="w-full"
                            aria-label="Do you confirm"
                            :pt="{
                                root: {
                                    class: [{ 'h-full': true, 'bg-green-100 border-white': localModelValue.somaFreteBaseCalculoST, 'bg-red-100 border-white': !localModelValue.somaFreteBaseCalculoST }]
                                }
                            }"
                        />
                    </span>
            </div>
        </div>
    </UWFieldSet>
</template>
