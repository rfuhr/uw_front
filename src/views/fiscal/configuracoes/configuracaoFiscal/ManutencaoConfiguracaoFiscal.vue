<script setup>
import { ref, reactive, computed, defineProps, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { ConfiguracaoFiscalService as Service, UfService, PaisService, TiposService, RegimeTributarioService,
         OrigemService, GrupoTributacaoService, OperacaoInternaService, ClassificacaoOperacaoService, CfopService,
         NcmService, ItemService } from '@/service';
import { useFormatString } from '@/composables/useFormatString';
import  ManutencaoConfiguracaoFiscalICMS from './ManutencaoConfiguracaoFiscalICMS.vue';
import  ManutencaoConfiguracaoFiscalIPI from './ManutencaoConfiguracaoFiscalIPI.vue';
import  ManutencaoConfiguracaoFiscalPIS from './ManutencaoConfiguracaoFiscalPIS.vue';
import  ManutencaoConfiguracaoFiscalCOFINS from './ManutencaoConfiguracaoFiscalCOFINS.vue';

const schema = yup.object().shape({
    ufOrigemId: yup.number().required('UF de Origem é obrigatória.'),
    paisDestinoId: yup.number().required('País de Destino é obrigatório.'),
    ufDestinoId: yup.number().required('UF de Destino é obrigatória.'),
    regimeTributarioId: yup.number().required('Regime Tributário é obrigatório.'),
    indicadorOperacao: yup.string().required('Entrada/Saída é obrigatório.'),
    dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
    dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
});

const indicadorOperacao = ref();

const { truncate } = useFormatString();

const props = defineProps({
    showDialog: {
        type: Boolean,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['closeDialog']);

const toast = useToast();

const formData = reactive({
    ufOrigemId: undefined,
    ufOrigemNome: undefined,
    paisDestinoId: undefined,
    paisDestinoNome: undefined,
    ufDestinoId: undefined,
    ufDestinoNome: undefined,
    regimeTributarioId: undefined,
    regimeTributarioNome: undefined,
    regimeTributarioSimplesNacional: false,
    grupoTributacaoId: undefined,
    grupoTributacaoNome: undefined,
    operacaoInternaId: undefined,
    operacaoInternaNome: undefined,
    classificacaoOperacaoId: undefined,
    classificacaoOperacaoNome: undefined,
    cfopId: undefined,
    cfopNome: undefined,
    origemId: undefined,
    origemNome: undefined,
    ncmId: undefined,
    ncmNome: undefined,
    itemId: undefined,
    itemNome: undefined,
    indicadorOperacao: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined,
    configuracaoFiscalIcms: {
        situacaoTributariaId: undefined
    },
    configuracaoFiscalIpi: {
        situacaoTributariaId: undefined
    },
    configuracaoFiscalPis: {
        situacaoTributariaId: undefined
    },
    configuracaoFiscalCofins: {
        situacaoTributariaId: undefined
    }
});

const showDialogComputed = computed({
    get: () => props.showDialog,
    set: (value) => {
        emit('update:showDialog', value);
    }
});

const hideDialog = () => {
    emit('closeDialog');
};

const criarRegistro = () => {
    Service.create(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração Fiscal criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a Configuração Fiscal.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração Fiscal alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a Configuração Fiscal.', life: 5000 });
        });
};

const salvarRegistro = async () => {
    if (props.mode === 'create') {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const showModal = async () => {
    if (props.mode === 'create') {
        formData.id= undefined;
        formData.ufOrigemId = undefined;
        formData.ufOrigemNome = undefined;
        formData.paisDestinoId = undefined;
        formData.paisDestinoNome = undefined;
        formData.ufDestinoId = undefined;
        formData.ufDestinoNome = undefined;
        formData.regimeTributarioId = undefined;
        formData.regimeTributarioNome = undefined;
        formData.regimeTributarioSimplesNacional = false;
        formData.grupoTributacaoId = undefined;
        formData.grupoTributacaoNome = undefined;
        formData.classificacaoOperacaoId = undefined;
        formData.classificacaoOperacaoNome = undefined;
        formData.operacaoInternaId = undefined;
        formData.operacaoInternaNome = undefined;
        formData.cfopId = undefined;
        formData.cfopNome = undefined;
        formData.origemId = undefined;
        formData.origemNome = undefined;
        formData.ncmId = undefined;
        formData.ncmNome = undefined;
        formData.itemId = undefined;
        formData.itemNome = undefined;
        formData.indicadorOperacao = undefined;
        formData.dataInicioVigencia = undefined;
        formData.dataFinalVigencia = undefined;
        formData.configuracaoFiscalIcms = {
            situacaoTributariaId: undefined,
            somaIpiBaseCalculo: false,
            somaIpiBaseCalculoST: false
        }
        formData.configuracaoFiscalIpi = {
            situacaoTributariaId: undefined,
            tipoCalculo: undefined
        }
        formData.configuracaoFiscalPis = {
            situacaoTributariaId: undefined
        }
        formData.configuracaoFiscalCofins = {
            situacaoTributariaId: undefined
        }
        formData.cfop = {};
        formData.origem = {};
        formData.ncm = {};
        formData.item = {};
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
            if (!formData.configuracaoFiscalIcms) {
                formData.configuracaoFiscalIcms = {
                    configuracaoFiscalId: formData.id,
                    somaIpiBaseCalculo: false,
                    somaIpiBaseCalculoST: false
                }
            }
            if (!formData.configuracaoFiscalIpi) {
                formData.configuracaoFiscalIpi = {
                    configuracaoFiscalId: formData.id
                }
            }
            if (!formData.configuracaoFiscalPis) {
                formData.configuracaoFiscalPis = {
                    configuracaoFiscalId: formData.id
                }
            }
            if (!formData.configuracaoFiscalCofins) {
                formData.configuracaoFiscalCofins = {
                    configuracaoFiscalId: formData.id
                }
            }
        });
    }
};

onMounted(async () => {
    await TiposService.getIndicadorOperacao().then((data) => {
        indicadorOperacao.value = data;
    });
});

const changeCfop = (event) => {
    formData.cfop = event;
};

const changeOrigem = (event) => {
    formData.origem = event;
};

const changeNcm = (event) => {
    formData.ncm = event;
};

const changeItem = (event) => {
    if (event) {
        formData.itemNome = event.nome;
        formData.itemCodigo = event.codigo;
    } else {
        formData.itemId = undefined;
        formData.itemNome = undefined;
        formData.itemCodigo = undefined;
    }
};

const changeRegimeTributario = (event) => {
    if (event) {
        formData.regimeTributarioNome = event.nome;
        formData.regimeTributarioCodigo = event.codigo;
        formData.regimeTributarioSimplesNacional = event.simplesNacional;
    } else {
        formData.regimeTributarioId = undefined;
        formData.regimeTributarioNome = undefined;
        formData.regimeTributarioCodigo = undefined;
        formData.regimeTributarioSimplesNacional = false;
    }
    console.log(formData)
};

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '90%' }" :header="mode === 'create' ? 'Novo Configuração Fiscal' : 'Alterar Configuração Fiscal'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formConfiguracaoFiscal" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="id" label="Identificador" disabled="true" autofocus v-model="formData.id" :errors="errors.value?.id" classContainer="col-12 md:col-3" />
                        <UWSeletor 
                                id="seletorUfOrigem" 
                                label="UF Origem" 
                                v-model="formData.ufOrigemId" 
                                :required="true" 
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione a UF de Origem" 
                                :service="UfService" 
                                classContainer="col-12 md:col-3"
                                :erros="errors?.value?.ufOrigemId"
                            >
                        </UWSeletor>                            
                        <UWSeletor 
                                    id="seletorPaisDestino" 
                                    label="País de Destino" 
                                    v-model="formData.paisDestinoId" 
                                    :required="true" 
                                    optionLabel="nome" 
                                    optionValue="id" 
                                    placeholder="Selecione o País de Destino" 
                                    :service="PaisService" 
                                    classContainer="col-12 md:col-3"
                                    :erros="errors?.value?.paisDestinoId"
                                    >
                        </UWSeletor>                                    
                        <UWSeletor 
                                    id="seletorUfDestino" 
                                    label="UF Destino" 
                                    v-model="formData.ufDestinoId" 
                                    :required="true" 
                                    optionLabel="nome" 
                                    optionValue="id" 
                                    placeholder="Selecione a UF de Destino" 
                                    :service="UfService" 
                                    classContainer="col-12 md:col-3" 
                                    :erros="errors?.value?.ufDestinoId"
                                    >
                        </UWSeletor>   
                        <UWSeletor 
                                    id="seletorRegimeTributario" 
                                    label="Regime Tributário" 
                                    v-model="formData.regimeTributarioId" 
                                    :required="true" 
                                    optionLabel="nome" 
                                    optionValue="id" 
                                    placeholder="Selecione o Regime Tributário" 
                                    :service="RegimeTributarioService" 
                                    @changeObject="changeRegimeTributario"
                                    classContainer="col-12 md:col-3" 
                                    :erros="errors?.value?.regimeTributarioId"
                                    >
                        </UWSeletor>   
                        <UWPickList id="indicadorOperacao" label="Entrada/Saída" v-model="formData.indicadorOperacao" optionLabel="name" optionValue="value" required :options="indicadorOperacao" classContainer="col-12 md:col-2" :erros="errors?.value?.indicadorOperacao"/>
                        <UWSeletor 
                                    id="seletorOrigem" 
                                    label="Origem" 
                                    v-model="formData.origemId" 
                                    optionLabel="nome" 
                                    optionValue="id" 
                                    placeholder="Selecione a Origem" 
                                    :service="OrigemService" 
                                    classContainer="col-12 md:col-4" 
                                    @changeObject="changeOrigem"
                                    :filtersSearch="[{ field: 'codigo', matchMode: 'equals', tipoField: 'integer', fieldFilter: 'codigo', labelFilter: 'Código'},
                                                 { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome'},
                                                ]"
                                    fieldSearchDefault="nome"
                                    >
                            <template #values> {{ formData.origem?.codigo }} - {{ formData.origem?.nome }} </template>
                            <template #options="slotProps">
                                <div class="flex flex-column">
                                    {{ truncate(slotProps.option.nome, 100 )}} 
                                    <div class="text-700 text-sm"><span>Código:</span> {{ slotProps.option.codigo }} </div>
                                </div>
                            </template>
                        </UWSeletor>
                        <UWSeletor 
                                    id="seletorGrupoTributacao" 
                                    label="Grupo Tributação" 
                                    v-model="formData.grupoTributacaoId" 
                                    optionLabel="nome" 
                                    optionValue="id" 
                                    placeholder="Selecione o Grupo Tributação" 
                                    :service="GrupoTributacaoService" 
                                    classContainer="col-12 md:col-3" 
                                    >
                        </UWSeletor>
                        <UWSeletor 
                                    id="seletorClassificacaoOperacao" 
                                    label="Classificação da Operação" 
                                    v-model="formData.classificacaoOperacaoId" 
                                    optionLabel="nome" 
                                    optionValue="id" 
                                    placeholder="Selecione a Classificação da Operação" 
                                    :service="ClassificacaoOperacaoService" 
                                    classContainer="col-12 md:col-3" 
                                    >
                        </UWSeletor>                                    
                        <UWSeletor 
                                    id="seletorOperacaoInterna" 
                                    label="Operação Interna" 
                                    v-model="formData.operacaoInternaId" 
                                    optionLabel="nome" 
                                    optionValue="id" 
                                    placeholder="Selecione a Operação Interna" 
                                    :service="OperacaoInternaService" 
                                    classContainer="col-12 md:col-3" 
                                    >
                        </UWSeletor>                                       
                        <UWSeletor 
                                    id="seletorCfop" 
                                    label="Código Fiscal (CFOP)" 
                                    v-model="formData.cfopId" 
                                    optionLabel="nome" 
                                    optionValue="id" 
                                    sortField="codigo"
                                    placeholder="Selecione o Código Fiscal (CFOP)" 
                                    :service="CfopService" 
                                    classContainer="col-12 md:col-6"
                                    @changeObject="changeCfop"
                                    :filtersSearch="[{ field: 'codigo', matchMode: 'equals', tipoField: 'integer', fieldFilter: 'codigo', labelFilter: 'Código'},
                                                 { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome'},
                                                ]"
                                    fieldSearchDefault="nome"
                                    >
                            <template #values> {{ formData.cfop?.codigo }} - {{ formData.cfop?.nome }} </template>
                            <template #options="slotProps">
                                <div class="flex flex-column">
                                    {{ truncate(slotProps.option.nome, 100 )}} 
                                    <div class="text-700 text-sm"><span>Código:</span> {{ slotProps.option.codigo }} </div>
                                </div>
                            </template>
                        </UWSeletor>
                        <UWSeletor 
                                    id="seletorNCM" 
                                    label="NCM" 
                                    v-model="formData.ncmId" 
                                    optionLabel="nome" 
                                    optionValue="id" 
                                    sortField="codigo"
                                    placeholder="Selecione o NCM" 
                                    :service="NcmService" 
                                    classContainer="col-12 md:col-6"
                                    @changeObject="changeNcm"
                                    :filtersSearch="[{ field: 'codigo', matchMode: 'equals', tipoField: 'integer', fieldFilter: 'codigo', labelFilter: 'Código'},
                                                 { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome'},
                                                ]"
                                    fieldSearchDefault="nome"
                                    >
                            <template #values> {{ formData.ncm?.codigo }} - {{ formData.ncm?.nome }} </template>
                            <template #options="slotProps">
                                <div class="flex flex-column">
                                    {{ truncate(slotProps.option.nome, 100 )}} 
                                    <div class="text-700 text-sm"><span>Código:</span> {{ slotProps.option.codigo }} </div>
                                </div>
                            </template>
                        </UWSeletor>
                        <UWSeletor 
                                    id="seletorItem" 
                                    label="Item" 
                                    v-model="formData.itemId" 
                                    optionLabel="nome" 
                                    optionValue="id" 
                                    placeholder="Selecione o Item" 
                                    :service="ItemService" 
                                    classContainer="col-12 md:col-6"
                                    @changeObject="changeItem"
                                    :filtersSearch="[{ field: 'codigo', matchMode: 'equals', tipoField: 'integer', fieldFilter: 'codigo', labelFilter: 'Código'},
                                                 { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome'},
                                                ]"
                                    fieldSearchDefault="nome"
                                    >
                            <template #values> {{ formData.itemCodigo }} - {{ formData.itemNome }} </template>
                            <template #options="slotProps">
                                <div class="flex flex-column">
                                    {{ truncate(slotProps.option.nome, 100 )}} 
                                    <div class="text-700 text-sm"><span>Código:</span> {{ slotProps.option.codigo }} </div>
                                </div>
                            </template>
                        </UWSeletor>
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-2" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-2" />                        
                    </div>
                </div>
                <TabView class="col-12">
                    <TabPanel header="ICMS" class="col-12">
                        <ManutencaoConfiguracaoFiscalICMS v-model="formData.configuracaoFiscalIcms" :simples-nacional="formData.regimeTributarioSimplesNacional" />
                    </TabPanel>
                    <TabPanel header="IPI" class="col-12">
                        <ManutencaoConfiguracaoFiscalIPI v-model="formData.configuracaoFiscalIpi" />
                    </TabPanel>
                    <TabPanel header="PIS" class="col-12">
                        <ManutencaoConfiguracaoFiscalPIS v-model="formData.configuracaoFiscalPis" />
                    </TabPanel>
                    <TabPanel header="COFINS" class="col-12">
                        <ManutencaoConfiguracaoFiscalCOFINS v-model="formData.configuracaoFiscalCofins" />
                    </TabPanel>
                </TabView>        
            </template>
        </UWForm>
    </Dialog>
</template>
