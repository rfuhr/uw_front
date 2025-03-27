<script setup>
import { ref, computed, onMounted } from 'vue';
import * as yup from 'yup';
import _ from 'lodash';
import { validateCNPJ, validateCPF } from 'validations-br';

import { TiposService, PaisService, UfService, CidadeService, ExternalService } from '@/service';
import Reboques from './Reboques.vue';
import Volumes from './Volumes.vue';
import { useValidationsSchemaNFe } from './useValidationsSchemaNFe';

const createSchemaTransporteNFe = (dynamicFields) => {
    const schemaObject = {
        modalidadeFrete: yup.string().required('Modalidade do Frete é obrigatório'),
        placaVeiculo: localModelValue.value.tipoTransporte === '1' ? yup.string().required('Placa do Veículo é obrigatório') : yup.string(),
        siglaUf: localModelValue.value.tipoTransporte === '1' ? yup.string().required('Sigla UF da placa do Veículo é obrigatório') : yup.string(),
        rntc: localModelValue.value.tipoTransporte === '1' ? yup.string().required('Registro Nacional de Transportador de Carga (ANTT) é obrigatório') : yup.string(),
        vagao: localModelValue.value.tipoTransporte === '2' ? yup.string().required('Identificação do Vagão é obrigatório') : yup.string(),
        balsa: localModelValue.value.tipoTransporte === '3' ? yup.string().required('Identificação da Balsa é obrigatório') : yup.string(),
        tipoPessoa: localModelValue.value.modalidadeFrete !== '9' ? yup.string().required('Tipo Pessoa é obrigatório') : yup.mixed().optional(),
        cnpj:
            localModelValue.value.modalidadeFrete !== '9' && localModelValue.value.tipoPessoa === 'J'
                ? yup
                      .string()
                      .required('Cnpj é obrigatório')
                      .test('is-cnpj', 'CNPJ inválido.', (value) => {
                          return value === '' || validateCNPJ(value);
                      })
                : yup.string(),
        cpf:
            localModelValue.value.modalidadeFrete !== '9' && localModelValue.value.tipoPessoa === 'F'
                ? yup
                      .string()
                      .required('Cpf é obrigatório')
                      .test('is-cpf', 'CNPJ inválido.', (value) => {
                          return value === '' || validateCPF(value);
                      })
                : yup.string(),
        nomeRazaoSocial: localModelValue.value.modalidadeFrete !== '9' ? yup.string().required('Nome/Razão Social é obrigatório') : yup.string(),
    };

    Object.assign(schemaObject, { ...dynamicFields });
    return yup.object().shape(schemaObject);
};

const createSchema = () => {
    const { createSchemaTipoTransporte, createSchemaReboques, createSchemaVolumes } = useValidationsSchemaNFe();

    return createSchemaTransporteNFe({
        tipoTransporte: createSchemaTipoTransporte(localModelValue.value),
        reboques: createSchemaReboques(localModelValue.value),
        volumes: createSchemaVolumes(localModelValue.value)
    });
};

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

const tiposTransporte = ref([]);
const modalidadesFrete = ref([]);
const seletorCidade = ref([]);
const formTransporteNFe = ref([]);
const activeIndexTabView = ref(0);

const tiposPessoa = ref([
    { name: 'Física', value: 'F' },
    { name: 'Jurídica', value: 'J' }
    // { name: 'Exterior', value: 'EX' }
]);

const buscarEndereco = async () => {
    if (localModelValue.value.cep) {
        try {
            const enderecoEncontrado = await ExternalService.getEnderecoByCep(localModelValue.value.cep);
            if (enderecoEncontrado) {
                localModelValue.value.endereco = enderecoEncontrado.logradouro;
                localModelValue.value.numero = '';
                localModelValue.value.complemento = '';
                localModelValue.value.bairro = enderecoEncontrado.bairro;

                UfService.getUfBySigla(enderecoEncontrado.uf).then((uf) => {
                    localModelValue.value.ufId = uf.id;
                    CidadeService.getCidadeByIbge(enderecoEncontrado.ibge * 1).then((cidade) => {
                        localModelValue.value.cidadeId = cidade.id;
                        emit('update:modelValue', localModelValue.value);
                        seletorCidade.value.reload(cidade.id);
                    });
                });
            }
        } catch (error) {
            /* empty */
        }
    }
};

onMounted(() => {
    TiposService.getModalidadesFrete().then((response) => {
        modalidadesFrete.value = response;
    });

    TiposService.getTiposTransporte().then((response) => {
        tiposTransporte.value = response;
    });
});

const changeModalidadeFrete = (value) => {
    localModelValue.value.modalidadeFreteNome = value.name;
    if (value.value === '9') {
        localModelValue.value.tipoTransporte = undefined;
        localModelValue.value.placaVeiculo = undefined;
        localModelValue.value.siglaUf = undefined;
        localModelValue.value.rntc = undefined;
        localModelValue.value.vagao = undefined;
        localModelValue.value.balsa = undefined;

        localModelValue.value.tipoPessoa = undefined;
        localModelValue.value.cnpj = undefined;
        localModelValue.value.cpf = undefined;
        localModelValue.value.nomeRazaoSocial = undefined;
        localModelValue.value.inscricaoEstadual = undefined;
        localModelValue.value.cep = undefined;
        localModelValue.value.endereco = undefined;
        localModelValue.value.numero = undefined;
        localModelValue.value.complemento = undefined;
        localModelValue.value.bairro = undefined;
        localModelValue.value.paisId = undefined;
        localModelValue.value.ufId = undefined;
        localModelValue.value.cidadeId = undefined;

        localModelValue.value.possuiReboque = false;
        localModelValue.value.possuiVolume = false;

        localModelValue.value.reboques = [];
        localModelValue.value.volumes = [];
    }
};

const changeTipoTransporte = (objeto) => {
    if (!objeto) {
        localModelValue.value.placaVeiculo = undefined;
        localModelValue.value.siglaUf = undefined;
        localModelValue.value.rntc = undefined;
        localModelValue.value.vagao = undefined;
        localModelValue.value.balsa = undefined;
    } else if (objeto.value === '1') {
        localModelValue.value.vagao = undefined;
        localModelValue.value.balsa = undefined;
    } else if (objeto.value === '2') {
        localModelValue.value.placaVeiculo = undefined;
        localModelValue.value.siglaUf = undefined;
        localModelValue.value.rntc = undefined;
        localModelValue.value.balsa = undefined;
    } else if (objeto.value === '3') {
        localModelValue.value.placaVeiculo = undefined;
        localModelValue.value.siglaUf = undefined;
        localModelValue.value.rntc = undefined;
        localModelValue.value.vagao = undefined;
    }
};

const temErro = (errors, str) => {
    let caminhoEncontrado = false;
    _.forEach(errors, (value, key) => {
        // Verifica se o caminho base está contido no caminho atual
        if (_.startsWith(key, str)) {
            caminhoEncontrado = true;
            return false; // Sai do loop forEach assim que encontrar um caminho válido
        }
    });
    return caminhoEncontrado;
};

const changePossuiReboque = () => {
    if (!localModelValue.value.possuiReboque) {
        localModelValue.value.reboques = [];
    }
    activeIndexTabView.value = 0;
};

const changePossuiVolume = () => {
    if (!localModelValue.value.possuiVolume) {
        localModelValue.value.volumes = [];
    }
    activeIndexTabView.value = 0;
};

const validateForm = () => {
    if (formTransporteNFe.value) {
        return formTransporteNFe.value.validateForm();
    }
};

defineExpose({
    validateForm
});
</script>

<template>
    <div>
        <UWForm :schema="createSchema()" :values="localModelValue" ref="formTransporteNFe" :visibleSave="false" :visibleCancel="false">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Identificação do Transporte" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWPickList
                                    id="modalidadeFrete"
                                    label="Modalidade do Frete"
                                    v-model="localModelValue.modalidadeFrete"
                                    required
                                    optionLabel="name"
                                    optionValue="value"
                                    :options="modalidadesFrete"
                                    classContainer="col-12 md:col-3"
                                    :errors="errors.value?.modalidadeFrete"
                                    @changeObject="changeModalidadeFrete"
                                    :disabled="visualizacao"
                                />
                                <UWPickList
                                    v-if="localModelValue.modalidadeFrete && localModelValue.modalidadeFrete !== '9'"
                                    id="tipoTransporte"
                                    label="Tipo do Transporte"
                                    v-model="localModelValue.tipoTransporte"
                                    optionLabel="name"
                                    optionValue="value"
                                    :required="localModelValue.modalidadeFrete !== '9'"
                                    :options="tiposTransporte"
                                    classContainer="col-12 md:col-2"
                                    :errors="errors.value?.tipoTransporte"
                                    @onChangeObject="changeTipoTransporte"
                                    :disabled="visualizacao"
                                />
                                <UWInput
                                    v-if="localModelValue.modalidadeFrete && localModelValue.modalidadeFrete !== '9' && localModelValue.tipoTransporte === '1'"
                                    id="placa"
                                    label="Placa do Veículo"
                                    uppercase
                                    :required="localModelValue.tipoTransporte === '1'"
                                    v-model="localModelValue.placaVeiculo"
                                    classContainer="col-12 md:col-2"
                                    :errors="errors.value?.placaVeiculo"
                                    :disabled="visualizacao"
                                />
                                <UWInput
                                    v-if="localModelValue.modalidadeFrete && localModelValue.modalidadeFrete !== '9' && localModelValue.tipoTransporte === '1'"
                                    id="siglaUF"
                                    label="Sigla da UF"
                                    uppercase
                                    v-model="localModelValue.siglaUf"
                                    classContainer="col-12 md:col-2"
                                    :disabled="visualizacao"
                                />
                                <UWInput
                                    v-if="localModelValue.modalidadeFrete && localModelValue.modalidadeFrete !== '9' && localModelValue.tipoTransporte === '1'"
                                    id="siglaUF"
                                    label="Registro Nacional de Transportador de Carga (ANTT)"
                                    v-model="localModelValue.rntc"
                                    classContainer="col-12 md:col-3"
                                    :disabled="visualizacao"
                                />
                                <UWInput
                                    v-if="localModelValue.modalidadeFrete && localModelValue.modalidadeFrete !== '9' && localModelValue.tipoTransporte === '2'"
                                    id="siglaUF"
                                    label="Identificação do Vagão"
                                    :required="localModelValue.tipoTransporte === '2'"
                                    v-model="localModelValue.vagao"
                                    classContainer="col-12 md:col-3"
                                    :errors="errors.value?.vagao"
                                    :disabled="visualizacao"
                                />
                                <UWInput
                                    v-if="localModelValue.modalidadeFrete && localModelValue.modalidadeFrete !== '9' && localModelValue.tipoTransporte === '3'"
                                    id="siglaUF"
                                    label="Identificação da Balsa"
                                    :required="localModelValue.tipoTransporte === '3'"
                                    v-model="localModelValue.balsa"
                                    classContainer="col-12 md:col-3"
                                    :errors="errors.value?.balsa"
                                    :disabled="visualizacao"
                                />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12">
                        <UWFieldSet v-if="localModelValue.modalidadeFrete && localModelValue.modalidadeFrete !== '9'" title="Dados do Transportador" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWPickList
                                    id="tipoPessoa"
                                    label="Tipo Pessoa"
                                    v-model="localModelValue.tipoPessoa"
                                    optionLabel="name"
                                    optionValue="value"
                                    :options="tiposPessoa"
                                    classContainer="col-12 md:col-2"
                                    @change="changeTipoPessoa()"
                                    :required="localModelValue.modalidadeFrete !== '9'"
                                    :errors="errors.value?.tipoPessoa"
                                    :disabled="visualizacao"
                                />
                                <UWInputMask
                                    id="cnpj"
                                    v-if="!localModelValue.tipoPessoa || localModelValue.tipoPessoa === 'J'"
                                    label="Cnpj"
                                    mask="99.999.999/9999-99"
                                    v-model="localModelValue.cnpj"
                                    classContainer="col-12 md:col-2"
                                    :required="localModelValue.modalidadeFrete !== '9'"
                                    :errors="errors.value?.cnpj"
                                    :disabled="visualizacao"
                                />
                                <UWInputMask
                                    id="cnpj"
                                    v-if="localModelValue.tipoPessoa === 'F'"
                                    label="Cpf"
                                    mask="999.999.999-99"
                                    v-model="localModelValue.cpf"
                                    classContainer="col-12 md:col-2"
                                    :required="localModelValue.modalidadeFrete !== '9'"
                                    :errors="errors.value?.cpf"
                                    :disabled="visualizacao"
                                />
                                <UWInput
                                    id="razaoSocial"
                                    :label="!localModelValue.tipoPessoa || localModelValue.tipoPessoa === 'J' ? 'Razão Social' : 'Nome'"
                                    v-model="localModelValue.nomeRazaoSocial"
                                    :classContainer="['col-12', localModelValue.tipoPessoa === 'J' ? 'md:col-6' : 'md:col-8']"
                                    :required="localModelValue.modalidadeFrete !== '9'"
                                    :errors="errors.value?.nomeRazaoSocial"
                                    :disabled="visualizacao"
                                />
                                <UWInput
                                    v-if="!localModelValue.tipoPessoa || localModelValue.tipoPessoa === 'J'"
                                    id="inscricaoEstadual"
                                    label="Inscrição Estadual do Expedidor"
                                    uppercase
                                    v-model="localModelValue.inscricaoEstadual"
                                    classContainer="col-12 md:col-2"
                                    :disabled="visualizacao"
                                />
                                <UWInputMask id="cep" :disabled="visualizacao" label="Cep" :mask="'99.999-999'" :unmask="true" v-model="localModelValue.cep" :showButton="true" @clickButton="buscarEndereco" iconButton="pi pi-search" classContainer="col-12 md:col-2" />
                                <UWInput id="endereco" :disabled="visualizacao" label="Logradouro" uppercase v-model="localModelValue.endereco" classContainer="col-12 md:col-6" />
                                <UWInput id="numero" :disabled="visualizacao" label="Número" uppercase v-model="localModelValue.numero" classContainer="col-12 md:col-2" />
                                <UWInput id="complemento" :disabled="visualizacao" label="Complemento" uppercase v-model="localModelValue.complemento" classContainer="col-12 md:col-2" />
                                <UWInput id="bairro" :disabled="visualizacao" label="Bairro" uppercase v-model="localModelValue.bairro" classContainer="col-12 md:col-3" />
                                <UWSeletor id="pais" :disabled="visualizacao" classContainer="col-12 md:col-2" v-model="localModelValue.paisId" optionLabel="nome" optionValue="id" label="País" :service="PaisService" placeholder="Selecione o pais" />
                                <UWSeletor id="uf" :disabled="visualizacao" classContainer="col-12 md:col-2" v-model="localModelValue.ufId" optionLabel="nome" optionValue="id" label="UF" :service="UfService" placeholder="Selecione a uf" />
                                <UWSeletor
                                    id="cidade"
                                    ref="seletorCidade"
                                    classContainer="col-12 md:col-5"
                                    v-model="localModelValue.cidadeId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Cidade"
                                    :service="CidadeService"
                                    placeholder="Selecione a cidade"
                                    :columnsFilters="[{ field: 'uf', value: localModelValue.ufId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'uf.id' }]"
                                    :disabled="visualizacao"
                                />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12">
                        <Message class="col-12 p-0 m-0" :closable="false" severity="error" v-if="_.get(errors?.value, 'reboques', null)">{{ _.get(errors?.value, 'reboques', null) }}</Message>
                        <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="temErro(errors?.value, 'reboques[')">Atenção! Existem reboques com pendências nas informações informadas.</Message>
                        <Message class="col-12 p-0 m-0" :closable="false" severity="error" v-if="_.get(errors?.value, 'volumes', null)">{{ _.get(errors?.value, 'volumes', null) }}</Message>
                        <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="temErro(errors?.value, 'volumes[')">Atenção! Volumes com pendências nas informações informadas.</Message>
                    </div>                    
                    <div class="col-12">
                        <UWFieldSet v-if="localModelValue.modalidadeFrete && localModelValue.modalidadeFrete !== '9'" title="Especificações do Transporte" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <div class="field md:col-6 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="localModelValue.possuiReboque"
                                            :disabled="localModelValue.tipoTransporte !== '1' || visualizacao"
                                            onLabel="Possui reboques"
                                            offLabel="Não possui reboques"
                                            onIcon="pi pi-lock"
                                            offIcon="pi pi-lock-open"
                                            class="w-full"
                                            aria-label="Do you confirm"
                                            @change="changePossuiReboque"
                                        />
                                    </span>
                                </div>
                                <div class="field md:col-6 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="localModelValue.possuiVolume"
                                            onLabel="Possui volumes"
                                            offLabel="Não possui volumes"
                                            onIcon="pi pi-lock-open"
                                            offIcon="pi pi-lock"
                                            class="w-full"
                                            aria-label="Do you confirm"
                                            @change="changePossuiVolume"
                                            :disabled="visualizacao"
                                        />
                                    </span>
                                </div>
                            </div>
                            <TabView class="col-12" v-model:activeIndex="activeIndexTabView">
                                <TabPanel header="Reboques" v-if="localModelValue.possuiReboque">
                                    <Reboques v-model="localModelValue.reboques" :errors="errors" />
                                </TabPanel>
                                <TabPanel header="Volumes" v-if="localModelValue.possuiVolume">
                                    <Volumes v-model="localModelValue.volumes" :errors="errors" />
                                </TabPanel>
                            </TabView>
                        </UWFieldSet>
                    </div>
                </div>
                <!-- <code>{{ errors }}</code> -->
            </template>
        </UWForm>
    </div>
</template>
