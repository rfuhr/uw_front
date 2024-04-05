<script setup>
import { ref, computed, onMounted } from 'vue';
import _ from 'lodash'
import { useContexto } from '@/stores';
import { DepartamentoService, OperacaoInternaService, TiposService, RegimeTributarioService, ConfigEmpresaService } from '@/service';
import UWSeletorCfop from '@/components/seletores/UWSeletorCfop.vue';
import DocumentosReferenciados from './DocumentosReferenciados.vue';
const contextoStore = useContexto();

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

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
        localModelValue.value.operacaoInterna = value
        localModelValue.value.indicadorOperacao = value.naturezaOperacao.indicadorOperacao;
        localModelValue.value.naturezaOperacao = value.naturezaOperacao.nome;
    } else {
        localModelValue.value.operacaoInterna = null
        localModelValue.value.tipoOperacaoId = null;
        localModelValue.value.naturezaOperacao = null;
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
    ConfigEmpresaService.getConfigByEmpresa(contextoStore.contexto.empresaId).then((data) => {
        localModelValue.value.regimeTributarioId = data.regimeTributarioId
    });
});
</script>

<template>
    <div>
        <div class="grid nested-grid">
            <div class="col-3">
                <UWFieldSet title="Identificação da NFe" class="h-full flex flex-column justify-content-start bg-primary-50 border-solid">
                    <div class="formgrid grid">
                        <UWInput id="modelo" label="Modelo" v-model="modeloNFe" :disabled="true" classContainer="col-12 md:col-12" />
                        <UWInput id="serie" label="Série" v-model="localModelValue.serie" :disabled="true" classContainer="col-12 md:col-6" />
                        <UWPickList id="indicadorOperacao" label="Indicador da Operação" v-model="localModelValue.indicadorOperacao" disabled optionLabel="name" optionValue="value" required :options="indicadoresOperacao" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dateHoraEmissao" label="Data de Emissão" v-model="localModelValue.dataHoraEmissao" dateFormat="dd/mm/yy" :showTime="true" :disabled="true" classContainer="col-12 md:col-6" />
                        <UWCalendar
                            id="dataHoraSaidaEntrada"
                            :label="localModelValue.indicadorOperacao === 'E' ? 'Data de Entrada' : 'Data de Saída'"
                            v-model="localModelValue.dataHoraSaidaEntrada"
                            dateFormat="dd/mm/yy"
                            :showTime="true"
                            required
                            classContainer="col-12 md:col-6"
                            :errors="_.get(errors.value, 'identificacaoNFe.dataHoraSaidaEntrada', null)"
                        />
                        <UWSeletor classContainer="col-12 md:col-12" v-model="localModelValue.regimeTributarioId" disabled optionLabel="nome" optionValue="id" label="Regime Tributário" :service="RegimeTributarioService" placeholder="Selecione o regime tributário" :erros="errors.value?.regimeTributarioId" />
                    </div>
                </UWFieldSet>
            </div>            
            <div class="col-9">
                <UWFieldSet title="Dados da Emissão" class="h-full">
                    <div class="formgrid grid">
                        <UWSeletor
                            :id="departamento"
                            classContainer="col-12 md:col-6"
                            v-model="localModelValue.emitenteId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            label="Departamento"
                            :service="DepartamentoService"
                            placeholder="Selecione o departamento"
                            :columnsFilters="[{ field: 'empresaFilial', value: contextoStore.contexto.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                            :erros="_.get(errors.value, 'identificacaoNFe.emitenteId', null)"
                        />
                        <UWSeletor
                            :id="operacaoInterna"
                            classContainer="col-12 md:col-6"
                            v-model="localModelValue.operacaoInternaId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            label="Operação Interna"
                            :service="OperacaoInternaService"
                            placeholder="Selecione a operação interna"
                            @changeObject="changeOperacaoInterna"
                            :erros="_.get(errors.value, 'identificacaoNFe.operacaoInternaId', null)"
                        />
                        <UWInput id="naturezaOperacao" label="Natureza da Operação" v-model="localModelValue.naturezaOperacao" :disabled="true" classContainer="col-12 md:col-4" />
                        <UWPickList id="destinoOperacao" label="Destino da Operação" v-model="localModelValue.destinoOperacao" optionLabel="name" optionValue="value" required :options="destinosOperacao" classContainer="col-12 md:col-4" />
                        <UWPickList id="tipoEmissao" label="Tipo de Emissão" v-model="localModelValue.tipoEmissao" disabled optionLabel="name" optionValue="value" :options="tiposEmissao" classContainer="col-12 md:col-4" />
                        <UWPickList id="finalidadeNfe" label="Finalidade da NFe" v-model="localModelValue.finalidadeNfe" optionLabel="name" optionValue="value" :options="finalidadesNfe" classContainer="col-12 md:col-4" />
                        <UWPickList id="tipoConsumidor" label="Tipo do Consumidor" v-model="localModelValue.tipoConsumidor" optionLabel="name" optionValue="value" :options="tiposConsumidor" classContainer="col-12 md:col-4" />
                        <UWPickList id="tipoPresenca" label="Tipo de Presença de comprador" v-model="localModelValue.tipoPresenca" optionLabel="name" optionValue="value" :options="tiposPresenca" classContainer="col-12 md:col-4" />
                        <UWInput    id="codigoMunicipioFG" label="Código do Município de Ocorrência Icms" v-model="localModelValue.codigoMunicipioFG" :disabled="true" classContainer="col-12 md:col-4" />
                        <UWSeletorCfop id="cfop" v-model="localModelValue.cfopIdentificacaoNFe" classContainer="col-12 md:col-8" required label="Cfop" />
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
                                    :pt="{
                                        root: {
                                            class: [{ 'h-full': true, 'bg-green-100 border-white': !localModelValue.possuiDocumentoReferenciado, 'bg-purple-100 border-white': localModelValue.possuiDocumentoReferenciado }]
                                        }
                                    }"
                                    @change="() => activeIndexTabView = 0"
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
                                    @change="() => activeIndexTabView = 0"
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
                                    @change="() => activeIndexTabView = 0"
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
            <TabView class="col-12" v-model:activeIndex="activeIndexTabView">
                <TabPanel header="Documentos Referenciados" class="col-12" v-if="localModelValue.possuiDocumentoReferenciado">
                    <DocumentosReferenciados v-model="localModelValue.documentosReferenciados"/>
                </TabPanel>
                <TabPanel header="Local de Retirada" class="col-12" v-if="localModelValue.outroLocalRetirada"> </TabPanel>
                <TabPanel header="Autorização para obter XML" class="col-12" v-if="localModelValue.autorizarObterXml"><span>Test3</span> </TabPanel>
            </TabView>
        </div>
    </div>
</template>
