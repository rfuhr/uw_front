<script setup>
import { ref, computed, onMounted } from 'vue';
import * as yup from 'yup';
import _ from 'lodash';
import { useContexto } from '@/stores';
import { DepartamentoService, OperacaoInternaService, TiposService, RegimeTributarioService } from '@/service';
import UWSeletorCfopByOpInt from '@/components/seletores/UWSeletorCfopByOpInt.vue';
import DocumentosReferenciados from './DocumentosReferenciados.vue';
import AutorizacaoObterXML from './AutorizacaoObterXML.vue';
import LocalRetirada from './LocalRetirada.vue';
import { useValidationsSchemaNFe } from './useValidationsSchemaNFe';

const contextoStore = useContexto();

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});
const createSchemaIdentificacaoNFe = (dynamicFields) => {
    const schemaObject = {
        emitenteId: yup.string().required('Emitente é obrigatório.'),
        operacaoInternaId: yup.string().required('Operação Interna é obrigatória.'),
        cfopId: yup.string().required('Cfop é obrigatório.')
    };
    Object.assign(schemaObject, { ...dynamicFields });
    return yup.object().shape(schemaObject);
};

const createSchema = () => {
    const { createSchemaDataHoraSaidaEntrada, createSchemaDocumentosReferenciados, createSchemaLocalRetirada, createSchemaAutorizacoes } = useValidationsSchemaNFe(localModelValue);

    return createSchemaIdentificacaoNFe({
        documentosReferenciados: createSchemaDocumentosReferenciados(localModelValue.value),
        dataHoraSaidaEntrada: createSchemaDataHoraSaidaEntrada(localModelValue.value),
        localRetirada: createSchemaLocalRetirada(localModelValue.value),
        autorizacoes: createSchemaAutorizacoes(localModelValue.value)
    });
};

const formIdentificacaoNFe = ref(null);

const modeloNFe = ref('55 - Nota Fiscal Eletrônica');
const tiposEmissao = ref([]);
const finalidadesNfe = ref([]);
const tiposConsumidor = ref([]);
const tiposPresenca = ref([]);
const indicadoresOperacao = ref([]);

const destinosOperacao = ref([]);

const activeIndexTabView = ref(0);

const changeOperacaoInterna = (value) => {
    if (value) {
        OperacaoInternaService.getById(value.id)
            .then((response) => {
                localModelValue.value.operacaoInterna = response;
                localModelValue.value.indicadorOperacao = response.naturezaOperacao.indicadorOperacao;
                localModelValue.value.naturezaOperacao = response.naturezaOperacao.nome;
                localModelValue.value.naturezaOperacaoSigla = response.naturezaOperacao.sigla;
                localModelValue.value.destinoOperacao = response.operacaoInternaFiscal.destinoOperacao;
                localModelValue.value.finalidadeNfe = response.operacaoInternaFiscal.finalidadeNfe;
                localModelValue.value.tipoConsumidor = response.operacaoInternaFiscal.tipoConsumidor;
                localModelValue.value.tipoPresencaComprador = response.operacaoInternaFiscal.tipoPresencaComprador;
            })
            .catch(() => {
                localModelValue.value.operacaoInterna = null;
                localModelValue.value.tipoOperacaoId = null;
                localModelValue.value.naturezaOperacao = null;
                localModelValue.value.naturezaOperacaoSigla = null;
                localModelValue.value.destinoOperacao = null;
                localModelValue.value.finalidadeNfe = null;
                localModelValue.value.tipoConsumidor = null;
                localModelValue.value.tipoPresencaComprador = null;
                localModelValue.value.cfopId = null;
            });
    } else {
        localModelValue.value.operacaoInterna = null;
        localModelValue.value.tipoOperacaoId = null;
        localModelValue.value.naturezaOperacao = null;
        localModelValue.value.destinoOperacao = null;
        localModelValue.value.finalidadeNfe = null;
        localModelValue.value.tipoConsumidor = null;
        localModelValue.value.tipoPresencaComprador = null;
        localModelValue.value.cfopId = null;
    }
};

onMounted(async () => {
    TiposService.getIndicadorOperacao().then((data) => {
        indicadoresOperacao.value = data;
    });
    TiposService.getTipoConsumidor().then((data) => {
        tiposConsumidor.value = data;
    });
    TiposService.getTipoEmissao().then((data) => {
        tiposEmissao.value = data;
    });
    TiposService.getFinalidadeNfe().then((data) => {
        finalidadesNfe.value = data;
    });
    TiposService.getTipoPresencaComprador().then((data) => {
        tiposPresenca.value = data;
    });
    TiposService.getDestinoOperacao().then((data) => {
        destinosOperacao.value = data;
    });
});

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

const changeOutroLocalRetirada = () => {
    activeIndexTabView.value = 0;
    localModelValue.value.localRetirada.tipoPessoa = 'J';
};

const changeDepartamento = async (value) => {
    if (value) {
        localModelValue.value.departamento = value;
    } else {
        
        localModelValue.value.departamento = null;
        localModelValue.value.enderecoEmititente = null;
    }
    
}
const validateForm = () => {
    if (formIdentificacaoNFe.value) {
        return formIdentificacaoNFe.value.validateForm();
    }
};

defineExpose({
    validateForm
});
</script>

<template>
    <div>
        <UWForm :schema="createSchema()" :values="localModelValue" ref="formIdentificacaoNFe" :visibleSave="false" :visibleCancel="false">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-4">
                        <UWFieldSet title="Identificação da NFe" class="h-full flex flex-column justify-content-start bg-primary-50 border-solid">
                            <div class="formgrid grid">
                                <UWInput id="numero" label="Número" v-model="localModelValue.numero" :disabled="true" classContainer="col-12 md:col-6" />
                                <UWInput id="serie" label="Série" v-model="localModelValue.serie" :disabled="true" classContainer="col-12 md:col-6" />
                                <UWInput id="chaveNFe" label="Chave NFe" v-model="localModelValue.chaveNFe" :disabled="true" classContainer="col-12 md:col-12" />
                                <UWInput id="modelo" label="Modelo" v-model="modeloNFe" :disabled="true" classContainer="col-12 md:col-6" />
                                <UWPickList
                                    id="indicadorOperacao"
                                    label="Indicador da Operação"
                                    v-model="localModelValue.indicadorOperacao"
                                    disabled
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="indicadoresOperacao"
                                    classContainer="col-12 md:col-6"
                                />
                                <UWCalendar id="dateHoraEmissao" label="Data de Emissão" v-model="localModelValue.dataHoraEmissao" dateFormat="dd/mm/yy" :showTime="true" :disabled="true" classContainer="col-12 md:col-6" />
                                <UWCalendar
                                    id="dataHoraSaidaEntrada"
                                    :label="localModelValue.indicadorOperacao === 'E' ? 'Data de Entrada' : 'Data de Saída'"
                                    v-model="localModelValue.dataHoraSaidaEntrada"
                                    dateFormat="dd/mm/yy"
                                    :showTime="true"
                                    required
                                    classContainer="col-12 md:col-6"
                                    :errors="errors.value?.dataHoraSaidaEntrada"
                                />
                                <UWSeletor
                                    id="seletorRegimeTributario"
                                    classContainer="col-12 md:col-12"
                                    v-model="localModelValue.regimeTributarioId"
                                    disabled
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Regime Tributário"
                                    :service="RegimeTributarioService"
                                    placeholder="Selecione o regime tributário"
                                    :erros="errors?.value?.regimeTributarioId"
                                />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-8">
                        <UWFieldSet title="Dados da Emissão" class="h-full">
                            <div class="formgrid grid">
                                <UWSeletor
                                    id="departamento"
                                    classContainer="col-12 md:col-6"
                                    v-model="localModelValue.emitenteId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Departamento"
                                    :service="DepartamentoService"
                                    placeholder="Selecione o departamento"
                                    :columnsFilters="[{ field: 'empresaFilial', value: contextoStore.contexto.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                    :erros="errors.value?.emitenteId"
                                    @changeObject="changeDepartamento"
                                />
                                <UWSeletor
                                    id="operacaoInterna"
                                    classContainer="col-12 md:col-6"
                                    v-model="localModelValue.operacaoInternaId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Operação Interna"
                                    :service="OperacaoInternaService"
                                    placeholder="Selecione a operação interna"
                                    @changeObject="changeOperacaoInterna"
                                    :erros="errors.value?.operacaoInternaId"
                                />
                                <UWInput id="naturezaOperacao" label="Natureza da Operação" v-model="localModelValue.naturezaOperacao" :disabled="true" classContainer="col-12 md:col-4" />
                                <UWPickList
                                    id="destinoOperacao"
                                    label="Destino da Operação"
                                    v-model="localModelValue.destinoOperacao"
                                    disabled
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="destinosOperacao"
                                    classContainer="col-12 md:col-4"
                                />
                                <UWPickList id="tipoEmissao" label="Tipo de Emissão" v-model="localModelValue.tipoEmissao" disabled optionLabel="name" optionValue="value" :options="tiposEmissao" classContainer="col-12 md:col-4" />
                                <UWPickList id="finalidadeNfe" label="Finalidade da NFe" v-model="localModelValue.finalidadeNfe" disabled optionLabel="name" optionValue="value" :options="finalidadesNfe" classContainer="col-12 md:col-4" />
                                <UWPickList id="tipoConsumidor" label="Tipo do Consumidor" v-model="localModelValue.tipoConsumidor" disabled optionLabel="name" optionValue="value" :options="tiposConsumidor" classContainer="col-12 md:col-4" />
                                <UWPickList
                                    id="tipoPresenca"
                                    label="Tipo de Presença de comprador"
                                    v-model="localModelValue.tipoPresencaComprador"
                                    disabled
                                    optionLabel="name"
                                    optionValue="value"
                                    :options="tiposPresenca"
                                    classContainer="col-12 md:col-4"
                                />
                                <UWSeletorCfopByOpInt
                                    id="cfop"
                                    v-model:operacaoInternaId="localModelValue.operacaoInternaId"
                                    v-model="localModelValue.cfopId"
                                    :disabled="!localModelValue.operacaoInternaId"
                                    classContainer="col-12 md:col-12"
                                    required
                                    label="Cfop"
                                    :erros="errors.value?.cfopId"
                                />
                                <div class="field md:col-4 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="localModelValue.possuiDocumentoReferenciado"
                                            onLabel="Possui documento referenciado"
                                            offLabel="Não possui documento referenciado"
                                            onIcon="pi pi-lock"
                                            offIcon="pi pi-lock-open"
                                            class="w-full"
                                            aria-label="Do you confirm"
                                            @change="() => (activeIndexTabView = 0)"
                                        />
                                    </span>
                                </div>
                                <div class="field md:col-4 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="localModelValue.outroLocalRetirada"
                                            onLabel="Local de retirada diferente"
                                            offLabel="Mesmo local de retirada"
                                            onIcon="pi pi-lock-open"
                                            offIcon="pi pi-lock"
                                            class="w-full"
                                            aria-label="Do you confirm"
                                            @change="changeOutroLocalRetirada"
                                            :pt="{
                                                root: {
                                                    class: [{ 'h-full': true, 'bg-green-100 border-white': !localModelValue.outroLocalRetirada, 'bg-purple-100 border-white': localModelValue.outroLocalRetirada }]
                                                }
                                            }"
                                        />
                                    </span>
                                </div>
                                <div class="field md:col-4 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="localModelValue.autorizarObterXml"
                                            onLabel="Autorizar terceiros obterem XML"
                                            offLabel="Sem autorização para terceiros obterem XML"
                                            onIcon="pi pi-lock-open"
                                            offIcon="pi pi-lock"
                                            class="w-full"
                                            aria-label="Do you confirm"
                                            @change="() => (activeIndexTabView = 0)"
                                            :pt="{
                                                root: {
                                                    class: [{ 'h-full': true, 'bg-green-100 border-white': !localModelValue.autorizarObterXml, 'bg-purple-100 border-white': localModelValue.autorizarObterXml }]
                                                }
                                            }"
                                        />
                                    </span>
                                </div>
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12">
                        <Message class="col-12 p-0 m-0" :closable="false" severity="error" v-if="_.get(errors?.value, 'documentosReferenciados', null)">{{ _.get(errors?.value, 'documentosReferenciados', null) }}</Message>
                        <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="temErro(errors?.value, 'documentosReferenciados[')">Atenção! Existem documentos referenciados com pendências nas informações informadas.</Message>
                        <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="temErro(errors?.value, 'localRetirada')">Atenção! Local de Retirada com pendências nas informações informadas.</Message>
                        <Message class="col-12 p-0 m-0" :closable="false" severity="error" v-if="_.get(errors?.value, 'autorizacoes', null)">{{ _.get(errors?.value, 'autorizacoes', null) }}</Message>
                        <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="temErro(errors?.value, 'autorizacoes[')">Atenção! Autorizações para obtenção de XML com pendências nas informações informadas.</Message>
                    </div>
                    <TabView class="col-12" v-model:activeIndex="activeIndexTabView">
                        <TabPanel header="Documentos Referenciados" v-if="localModelValue.possuiDocumentoReferenciado">
                            <DocumentosReferenciados v-model="localModelValue.documentosReferenciados" :errors="errors"/>
                        </TabPanel>
                        <TabPanel header="Local de Retirada" v-if="localModelValue.outroLocalRetirada">
                            <LocalRetirada v-model="localModelValue.localRetirada" :errors="errors" />
                        </TabPanel>
                        <TabPanel header="Autorização para obter XML" v-if="localModelValue.autorizarObterXml">
                            <AutorizacaoObterXML v-model="localModelValue.autorizacoes" :errors="errors" />
                        </TabPanel>
                    </TabView>
                </div>
            </template>
        </UWForm>
    </div>
</template>
