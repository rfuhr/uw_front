<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as yup from 'yup';
import _ from 'lodash';
import { useToast } from 'primevue/usetoast';
import { useContexto } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
import { useFormatDate } from '@/composables/useFormatDate';
import { SolicitacaoMercadoriaService, DepartamentoService, GrupoContabilService, TiposService, ValidaDepartamentoGrupoContabilService } from '@/service';

import ItemSolicitacao from './ItemSolicitacao.vue';
import VisualizarSolicitacao from '../../../administrativo/autorizacao/visualizar/VisualizarSolicitacao.vue';

const createSchema = () => {
    return yup.object().shape({
        dataSolicitacao: yup.date().required('Data da solicitação é obrigatória').max(getToday(), 'Data da Solicitação deve ser menor que a data atual.'),
        departamentoSolicitanteId: yup.number().required('Departamento solicitante é obrigatório'),
        grupoContabilDestinoId: yup.number().required('Grupo contábil destino é obrigatório'),
        departamentoSolicitadoId: yup.number().required('Departamento solicitado é obrigatório'),
        itens: yup.array().min(1, 'Deve ser informado pelo menos 1 item para solicitação').required('Obrigatório informar item para a solicitação')
    });
};

const getToday = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 59);
    return today;
};

const route = useRoute();
const router = useRouter();
const contextoStore = useContexto();
const { formatDate } = useFormatDate();
const toast = useToast();
const isVisualizar = ref(false);
const situacoes = ref([]);
const seletorGrupoContabilDestino = ref();

const formData = ref({
    numero: 0,
    dataSolicitacao: new Date(),
    situacaoSolicitacaoMercadoria: '1',
    informaItemSimplificado: false,
    itens: []
});
const mode = ref('nova');
const formSolicitacaoItem = ref();

const itemsActions = [
    {
        label: 'Apenas Salvar',
        icon: 'pi pi-lock',
        command: () => {
            handleApenasSalvar();
        }
    },
    {
        label: 'Desistir',
        icon: 'pi pi-times-circle',
        disabled: () => mode.value === 'nova',
        command: () => {
            handleDesistir();
        }
    }
];

onMounted(async () => {
    formData.value.empresaFilialId = contextoStore.contexto.empresaFilialId;
    formData.value.situacaoSolicitacaoMercadoria = '1';
    TiposService.getSituacaoSolicitacaoMercadoria().then((data) => {
        situacoes.value = data;
        formData.value.situacaoSolicitacaoMercadoriaNome = situacoes.value.find((s) => s.value === formData.value.situacaoSolicitacaoMercadoria)?.name;
    });
    const id = route.params.id || 0;
    if (id > 0) {
        isVisualizar.value = route.path.includes('/visualizar');
        nextTick(async () => {
            if (isVisualizar.value) {
                mode.value = 'visualizar';
            } else {
                mode.value = 'editar';
            }
            await SolicitacaoMercadoriaService.getById(id).then((data) => {
                _.assign(formData.value, data);
                nextTick(async () => {
                    await seletorGrupoContabilDestino.value.reload(formData.value.grupoContabilDestinoId);
                });
            });
        });
    } else {
        mode.value = 'nova';
    }
});

const changeDepartamento = async (departamento) => {
    if (departamento) {
        await ValidaDepartamentoGrupoContabilService.getValidacao(departamento.id, formData.value.grupoContabilId).then((data) => {
            if (data) {
                formData.value.informaItemSimplificado = data.controlaEstoque === false;
            } else {
                formData.value.informaItemSimplificado = false;
            }
        });
    } else {
        formData.value.informaItemSimplificado.value = false;
    }
};

const changeGrupoContabil = async (grupoContabil) => {
    if (grupoContabil) {
        await ValidaDepartamentoGrupoContabilService.getValidacao(grupoContabil.id, formData.value.grupoContabilId).then((data) => {
            if (data) {
                formData.value.informaItemSimplificado = data.controlaEstoque === false;
            } else {
                formData.value.informaItemSimplificado = false;
            }
        });
    } else {
        formData.value.informaItemSimplificado.value = false;
    }
};

const handleCancelar = () => {
    router.push({ path: '/compra/solicitacao/solicitacao-item' });
};

const salvarRegistro = () => {
    if (mode.value === 'nova') {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const criarRegistro = () => {
    const payload = { ...formData.value };
    payload.dataSolicitacao = formatDate(payload.dataSolicitacao, 'yyyy-MM-dd');
    payload.itens.forEach((item) => {
        item.dataSolicitacao = formatDate(item.dataSolicitacao, 'yyyy-MM-dd');
    });

    SolicitacaoMercadoriaService.create(payload)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação de item salva com sucesso', life: 5000 });
            router.push({ path: '/compra/solicitacao/solicitacao-item' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível salvar a solicitação de item.', life: 5000 });
        });
};

const alterarRegistro = () => {
    const payload = { ...formData.value };
    SolicitacaoMercadoriaService.update(payload)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação de item salva com sucesso', life: 5000 });
            router.push({ path: '/compra/solicitacao/solicitacao-item' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível salvar a solicitação de item', life: 5000 });
        });
};

const handleConfirmar = async () => {
    nextTick(() => {
        formData.value.situacaoSolicitacaoMercadoria = '2';
        formSolicitacaoItem.value.handleSubmit();
    });
};

const handleApenasSalvar = async () => {
    nextTick(() => {
        formData.value.situacaoSolicitacaoMercadoria = '1';
        formSolicitacaoItem.value.handleSubmit();
    });
};

const handleDesistir = () => {
    const solicitacaoMercadoriaItemId = formData.value.id;
    SolicitacaoMercadoriaService.delete(solicitacaoMercadoriaItemId)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Desistência da Solicitação com sucesso', life: 5000 });
            router.push({ path: '/compra/solicitacao/solicitacao-item' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível realizar a desistência da solicitação.', life: 5000 });
        });
};

const getSubTitle = () => {
    if (mode.value === 'nova') {
        return 'Criar uma nova solicitação de produtos e itens';
    }
    if (mode.value === 'editar') {
        return 'Editar uma solicitação de produtos e itens';
    }
    return 'Visualizar uma solicitação de produtos e itens';
}

const handleVoltar = () => {
    router.push({ path: '/compra/solicitacao/solicitacao-item' });
};
</script>

<template>
    <UWPageBase title="Solicitação de item" :subtitle="getSubTitle()">
        <UWForm :schema="createSchema()" :values="formData" ref="formSolicitacaoItem" 
        :visibleSave="false" 
        :visibleCancel="mode !== 'visualizar'"
        :visibleVoltar="mode === 'visualizar'"
        @doSubmit="salvarRegistro" @doCancel="handleCancelar" @doVoltar="handleVoltar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Identificação da Solicitação" class="col-12">
                            <div class="p-fluid formgrid grid">
                                <UWInteger id="numero" label="Número" disabled v-model="formData.numero" classContainer="col-12 md:col-1" />
                                <UWCalendar id="dataSolicitacao" label="Data da Solicitação" dateFormat="dd/mm/yy" disabled required v-model="formData.dataSolicitacao" :errors="errors.value?.dataSolicitacao" classContainer="col-12 md:col-2" />
                                <UWSeletor
                                    id="departamento"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.departamentoSolicitanteId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    :disabled="mode === 'visualizar'"
                                    label="Departamento Solicitante"
                                    :service="DepartamentoService"
                                    placeholder="Selecione o departamento"
                                    :erros="errors.value?.departamentoSolicitanteId"
                                    :columnsFilters="[{ field: 'empresaFilial', value: formData.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                    @changeObject="changeDepartamento"
                                    :selecaoAutomatica="false"
                                />
                                <UWSeletor
                                    id="grupoContabilDestino"
                                    ref="seletorGrupoContabilDestino"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.grupoContabilDestinoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    :disabled="mode === 'visualizar'"
                                    label="Grupo Contábil Destinação"
                                    :service="GrupoContabilService"
                                    placeholder="Selecione o grupo contábil"
                                    :erros="errors.value?.grupoContabilDestinoId"
                                    @changeObject="changeGrupoContabil"
                                />
                                <UWInput id="situacaoSolicitacaoMercadoria" label="Situação" disabled v-model="formData.situacaoSolicitacaoMercadoriaNome" classContainer="col-12 md:col-3" />
                            </div>
                        </UWFieldSet>
                        <UWFieldSet title="Informações Gerais" class="col-12 mt-2">
                            <div class="p-fluid formgrid grid">
                                <UWSeletor
                                    id="departamentoSolicitado"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.departamentoSolicitadoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    :disabled="mode === 'visualizar'"
                                    label="Departamento Solicitado"
                                    :service="DepartamentoService"
                                    placeholder="Selecione o departamento"
                                    :erros="errors.value?.departamentoSolicitadoId"
                                    :columnsFilters="[{ field: 'empresaFilial', value: formData.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                />
                                <UWInput id="observacao" label="Observação" :disabled="mode === 'visualizar'" v-model="formData.observacao" classContainer="col-12 md:col-9" :erros="errors.value?.observacao" />
                            </div>
                        </UWFieldSet>
                        <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="errors?.value?.itens">Atenção! Deve ser informada item para solicitação.</Message>
                        <TabView class="w-full">
                            <TabPanel header="Itens da Solicitação">
                                <ItemSolicitacao ref="itensSolicitacao" v-model="formData.itens" :informaItemSimplificado="formData.informaItemSimplificado" :isVisualizar="isVisualizar"/>
                            </TabPanel>
                            <TabPanel v-if="isVisualizar" header="Autorizações da Solicitação">
                                <VisualizarSolicitacao :documento-origem-id="formData.id" :tipo-autorizacao="1"/>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </template>
            <template #buttonsRight>
                <SplitButton v-if="!isVisualizar" label="Confirmar" icon="pi pi-check" menuButtonIcon="pi pi-cog" :model="itemsActions" @click="handleConfirmar" />
            </template>
        </UWForm>
    </UWPageBase>
</template>
