<script setup>
import { ref, reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { OperacaoInternaService as Service, NaturezaOperacaoService } from '@/service';
import OperacaoInternaConfigFiscal from './OperacaoInternaConfigFiscal.vue';
import OperacaoInternaConfigEstoque from './OperacaoInternaConfigEstoque.vue';
import OperacaoInternaConfigAgricola from './OperacaoInternaConfigAgricola.vue';

const schema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório.').max(120, 'Nome deve ter no máximo 120 caracteres.'),
    sigla: yup.string().required('Sigla é obrigatória.').max(120, 'Sigla deve ter no máximo 120 caracteres.'),
    naturezaOperacaoId: yup.string().required('Natureza da Operação é obrigatório.')
});

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

const initialValues = () => {
    (formData.id = undefined),
        (formData.naturezaOperacaoId = undefined),
        (formData.naturezaOperacao = undefined),
        (formData.nome = undefined),
        (formData.sigla = undefined),
        (formData.caracteristicaFiscal = false),
        (formData.caracteristicaEstoque = false),
        (formData.caracteristicaAgricola = false),
        (formData.operacaoInternaFiscal = {}),
        (formData.operacaoInternaEstoque = {}),
        (formData.operacaoInternaAgricola = {});
};

const formData = reactive({});
const activeIndexTabView = ref(0);

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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação interna criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a operação interna.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação interna alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a operação interna.', life: 5000 });
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
        initialValues();
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '80%' }" :header="mode === 'create' ? 'Nova Operação Interna' : 'Alterar Operação Interna'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formOperacaoInterna" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <UWFieldSet title="Identificação da Operação Interna" class="h-full">
                        <div class="p-fluid formgrid grid">
                            <UWSeletor
                                v-model="formData.naturezaOperacaoId"
                                optionLabel="nome"
                                optionValue="id"
                                required
                                label="Natureza da Operação"
                                :service="NaturezaOperacaoService"
                                placeholder="Selecione a natureza da operação"
                                :erros="errors.value?.naturezaOperacaoId"
                                classContainer="col-12 md:col-4"
                            />
                            <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-6" />
                            <UWInput id="sigla" label="Sigla" required v-model="formData.sigla" :errors="errors.value?.sigla" classContainer="col-12 md:col-2" />
                        </div>
                    </UWFieldSet>
                </div>
                <div class="col-12 pt-0 pb-0">
                    <UWFieldSet title="Definição de Características" class="h-full pb-0 mb-0 w-full">
                        <div class="p-fluid formgrid grid col-12">
                    <UWCheckBox
                        label="Tem Característica Fiscal"
                        v-model="formData.caracteristicaFiscal"
                        classContainer="col-12 md:col-2 mb-1 p-1"
                        @change="
                            () => {
                                activeIndexTabView = 0;
                                formData.operacaoInternaFiscal = {};
                            }
                        "
                    />
                    <UWCheckBox
                        label="Tem Característica de Estoque"
                        v-model="formData.caracteristicaEstoque"
                        classContainer="col-12 md:col-2 mb-1 p-1"
                        @change="
                            () => {
                                formData.operacaoInternaEstoque = {
                                    informaLocalEstoque: false,
                                    informaGrupoContabil: false,
                                    calculaCustoMedio: false
                                };
                                activeIndexTabView = 1;
                            }
                        "
                    />
                    <UWCheckBox
                        label="Tem Característica Agrícola"
                        v-model="formData.caracteristicaAgricola"
                        classContainer="col-12 md:col-2 mb-1 p-1"
                        @change="
                            () => {
                                formData.operacaoInternaAgricola = {
                                    selecionaPesagem: false
                                };
                                activeIndexTabView = 2;
                            }
                        "
                    />
                </div>
                </UWFieldSet>
                </div>
                <div class="col-12 pt-0">
                    <TabView class="col-12" v-model:activeIndex="activeIndexTabView">
                        <TabPanel header="Configuração Fiscal" class="col-12" :disabled="!formData.caracteristicaFiscal">
                            <Message v-if="!formData.caracteristicaFiscal" severity="warn" :closable="false">Operação Interna não possui Característica Fiscal!</Message>
                            <OperacaoInternaConfigFiscal v-if="formData.caracteristicaFiscal" v-model="formData.operacaoInternaFiscal" />
                        </TabPanel>
                        <TabPanel header="Configuração Estoque" class="col-12" :disabled="!formData.caracteristicaEstoque">
                            <Message v-if="!formData.caracteristicaEstoque" severity="warn" :closable="false">Operação Interna não possui Característica de Estoque!</Message>
                            <OperacaoInternaConfigEstoque v-if="formData.caracteristicaEstoque" v-model="formData.operacaoInternaEstoque" />
                        </TabPanel>
                        <TabPanel header="Configuração Agrícola" class="col-12" :disabled="!formData.caracteristicaAgricola">
                            <Message v-if="!formData.caracteristicaAgricola" severity="warn" :closable="false">Operação Interna não possui Característica Agrícola!</Message>
                            <OperacaoInternaConfigAgricola v-if="formData.caracteristicaAgricola" v-model="formData.operacaoInternaAgricola" />
                        </TabPanel>
                    </TabView>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
