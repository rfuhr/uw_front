<script setup>
import { ref, computed, onMounted } from 'vue';
import * as yup from 'yup';
import { TiposService, ParceiroLocalService } from '@/service';
import { useFormatDocumentos } from '@/composables/useFormatDocumentos';
import LocalEntrega from './LocalEntrega.vue';
import { useValidationsSchemaNFe } from './useValidationsSchemaNFe';

const { formatDocumento } = useFormatDocumentos();

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    visualizacao: {
        type: Boolean,
        required: true,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const indicadoresIE = ref([]);
const seletorDestinatario = ref(null);

const createSchemaDestinatarioNFe = (dynamicFields) => {
    const schemaObject = {
        destinatarioId: yup.string().required('Destinatário é obrigatório.')
    };
    Object.assign(schemaObject, { ...dynamicFields });
    return yup.object().shape(schemaObject);
};

const createSchema = () => {
    const { createSchemaLocalEntrega } = useValidationsSchemaNFe(localModelValue);

    return createSchemaDestinatarioNFe({
        localEntrega: createSchemaLocalEntrega(localModelValue.value)
    });
};
const formDestinatarioNFe = ref(null);
const activeIndexTabView = ref(0);
const dadosParceiroLocal = ref({});

const getEnderecoCompleto = (objetoEndereco) => {
    return `${objetoEndereco.endereco}, ${objetoEndereco.numero}, ${objetoEndereco.bairro}, ${objetoEndereco.cidadeNome} - ${objetoEndereco.ufSigla}, ${objetoEndereco.paisNome}, CEP: ${objetoEndereco.cep.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3')}`;
};

const getTelefoneFormatado = (objetoTelefone) => {
    const telefone = objetoTelefone.numero;
    const formattedTelefone = telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    return formattedTelefone;
};

const changeParceiroLocal = async (object) => {
    if (!object) {
        dadosParceiroLocal.value = {};
        localModelValue.value.dadosParceiroLocal = {}
        return;
    }

    ParceiroLocalService.getById(object.id).then(async (data) => {
        dadosParceiroLocal.value = data;
        dadosParceiroLocal.value.tipoPessoa = dadosParceiroLocal.value.cpfCnpj.length === 14 ? 'J' : 'F';
        dadosParceiroLocal.value.cpfCnpj = formatDocumento(dadosParceiroLocal.value.cpfCnpj);

        await ParceiroLocalService.getEnderecoNFe(data.id).then((response) => {
            dadosParceiroLocal.value.enderecoCompleto = getEnderecoCompleto(response);
            dadosParceiroLocal.value.endereco = response
            localModelValue.value.enderecoId = response.id,
            localModelValue.value.endereco = response;
        }).catch(() => {
            dadosParceiroLocal.value.enderecoCompleto = null
            dadosParceiroLocal.value.endereco = null
            localModelValue.value.enderecoId = null    
            localModelValue.value.endereco = null;        
        });

        if (dadosParceiroLocal.value.telefones) {
            dadosParceiroLocal.value.telefone = dadosParceiroLocal.value.telefones[0];
            dadosParceiroLocal.value.telefoneFormatado = getTelefoneFormatado(dadosParceiroLocal.value.telefones[0]);
            dadosParceiroLocal.value.telefoneId = dadosParceiroLocal.value.telefones[0].id;
            localModelValue.value.telefoneId = dadosParceiroLocal.value.telefones[0].id;
        }
        if (dadosParceiroLocal.value.emails) {
            dadosParceiroLocal.value.email = dadosParceiroLocal.value.emails[0].email;
            dadosParceiroLocal.value.emailId = dadosParceiroLocal.value.emails[0].id;
            localModelValue.value.emailId = dadosParceiroLocal.value.emails[0].id;
        }
        if (dadosParceiroLocal.value.dadosPessoaJuridica) {
            dadosParceiroLocal.value.inscricaoEstadual = dadosParceiroLocal.value.dadosPessoaJuridica.inscricaoEstadual;
            dadosParceiroLocal.value.suframa = '';
            dadosParceiroLocal.value.indicadorIE = dadosParceiroLocal.value.dadosPessoaJuridica.indicadorIE;
            dadosParceiroLocal.value.suframa = dadosParceiroLocal.value.dadosPessoaJuridica.suframa;
        }
        localModelValue.value.dadosParceiroLocal = dadosParceiroLocal.value;
    });
};

const validateForm = () => {
    if (formDestinatarioNFe.value) {
        return formDestinatarioNFe.value.validateForm();
    }
};

onMounted(() => {
    TiposService.getIndicadorIEDestinatario().then((data) => {
        indicadoresIE.value = data;
    });
});

const reloadSeletorDestinatario = (id) => {
    if (seletorDestinatario.value)
        seletorDestinatario.value.reload(id);
}

defineExpose({
    validateForm,
    reloadSeletorDestinatario
});

const changeOutroLocalEntrega = () => {
    activeIndexTabView.value = 0;
    localModelValue.value.localEntrega.tipoPessoa = 'J';
};
</script>

<template>
    <div>
        <UWForm :schema="createSchema()" :values="localModelValue" ref="formDestinatarioNFe" :visibleSave="false" :visibleCancel="false">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Dados do Destinatário" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWParceiroLocal id="parceiroLocal" ref="seletorDestinatario" classContainer="col-12 md:col-4" v-model="localModelValue.destinatarioId" required label="Parceiro" @changeObject="changeParceiroLocal" :erros="errors.value?.destinatarioId" :disabled="visualizacao"/>
                                <UWInput id="cpfCnpj" :label="!dadosParceiroLocal.tipoPessoa || dadosParceiroLocal.tipoPessoa === 'J' ? 'Cnpj' : 'Cpf'" uppercase disabled v-model="dadosParceiroLocal.cpfCnpj" classContainer="col-12 md:col-3" :disabled="visualizacao"/>
                                <UWInput v-if="!dadosParceiroLocal.tipoPessoa || dadosParceiroLocal.tipoPessoa === 'J'" id="nomeLocal" label="Filial" uppercase disabled v-model="dadosParceiroLocal.nomeLocal" classContainer="col-12 md:col-5" :disabled="visualizacao"/>
                                <UWInput id="endereco" label="Endereço" uppercase disabled v-model="dadosParceiroLocal.enderecoCompleto" classContainer="col-12 md:col-6" :disabled="visualizacao"/>
                                <UWInput id="telefone" label="Telefone" disabled v-model="dadosParceiroLocal.telefoneFormatado" classContainer="col-12 md:col-3" :disabled="visualizacao"/>
                                <UWInput id="email" label="Email" disabled v-model="dadosParceiroLocal.email" classContainer="col-12 md:col-3" :disabled="visualizacao"/>

                                <UWPickList
                                    v-if="!dadosParceiroLocal.tipoPessoa || dadosParceiroLocal.tipoPessoa === 'J'"
                                    id="indicadorIE"
                                    label="Indicador IE Destinatário"
                                    v-model="dadosParceiroLocal.indicadorIE"
                                    optionLabel="name"
                                    optionValue="value"
                                    disabled
                                    :options="indicadoresIE"
                                    classContainer="col-12 md:col-2"
                                />

                                <UWInput v-if="!dadosParceiroLocal.tipoPessoa || dadosParceiroLocal.tipoPessoa === 'J'" id="inscricaoSuframa" label="Suframa" disabled v-model="dadosParceiroLocal.suframa" classContainer="col-12 md:col-3" />
                                <div class="field md:col-3 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="localModelValue.outroLocalEntrega"
                                            onLabel="Local de entrega diferente"
                                            offLabel="Mesmo local de entrega"
                                            onIcon="pi pi-lock-open"
                                            offIcon="pi pi-lock"
                                            class="w-full"
                                            aria-label="Do you confirm"
                                            @change="changeOutroLocalEntrega"
                                            :pt="{
                                                root: {
                                                    class: [{ 'h-full': true, 'bg-green-100 border-white': !localModelValue.outroLocalEntrega, 'bg-purple-100 border-white': localModelValue.outroLocalEntrega }]
                                                }
                                            }"
                                            :disabled="visualizacao"
                                        />
                                    </span>
                                </div>
                            </div>
                        </UWFieldSet>
                    </div>
                    <TabView class="col-12" v-model:activeIndex="activeIndexTabView">
                        <TabPanel header="Local de Entrega" v-if="localModelValue.outroLocalEntrega">
                            <LocalEntrega v-model="localModelValue.localEntrega" :errors="errors" />
                        </TabPanel>
                    </TabView>
                </div>
            </template>
        </UWForm>
    </div>
</template>
