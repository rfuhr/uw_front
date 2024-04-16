<script setup>
import { computed } from 'vue';
import { MotivoDesoneracaoService } from '@/service';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const itemModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const situacaoTributaria = computed(() => {
    return itemModelValue.value.tributacaoIcms?.configuracaoFiscalIcms?.situacaoTributariaCodigo + ' - ' + itemModelValue.value.tributacaoIcms?.configuracaoFiscalIcms?.situacaoTributariaNome;
});

</script>

<template>
    <div>
        <div class="grid nested-grid">
            <div class="col-12">
                <UWFieldSet title="Informações do ICMS da Operação própria e ST" class="h-full">
                    <div class="p-fluid formgrid grid">
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <UWInput id="origemProduto" label="Origem da Mercadoria" v-model="itemModelValue.item.origemNome" disabled classContainer="col-12 md:col-6" />
                                <UWInput id="grupoTributacao" label="Situação Tributária" v-model="situacaoTributaria" disabled classContainer="col-12 md:col-6" />
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>Desoneração</b>
                                </Divider>
                                <UWCurrency id="valorIcmsDesoneracao" label="Valor do ICMS desonerado" disabled v-model="itemModelValue.tributacaoIcms.valorIcmsDesoneracao" classContainer="col-12 md:col-offset-3 md:col-3" />
                                <UWSeletor
                                    id="motivoDesoneracao"
                                    classContainer="col-12 md:col-3"
                                    v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.motivoDesoneracaoId"
                                    disabled
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Motivo da Desoneração"
                                    :service="MotivoDesoneracaoService"
                                    placeholder="Selecione o motivo da desoneração"
                                />
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
