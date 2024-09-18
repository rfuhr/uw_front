<script setup>
import { ref, reactive, computed, defineProps, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { OperacaoCaixaBancoService as Service, TipoContaCxBcoService, TiposService, HistoricoPadraoService, FatoGeradorService } from '@/service';

const schema = yup.object().shape({
    codigo: yup.number().required('Código é obrigatório.'),
    nome: yup.string().required('Nome é obrigatório.').max(120, 'Nome deve ter no máximo 120 caracteres.'),
    sigla: yup.string().required('Sigla é obrigatório.').max(3, 'Sigla deve ter no máximo 3 caracteres.'),
    tipoContaCxBcoId: yup.number().required('Tipo da conta é obrigatório.'),
    operacaoCaixaBancoIdTransferencia: yup.number().test('required', 'Operação destino da transferência é obrigatória.', function (value) {
        return this.parent.transferencia ? value !== undefined : true;
    }),
    parceiroLocalDefault: yup.number().test('required', 'Parceiro default é obrigatório.', function (value) {
        return this.parent.digitaParceiro ? value !== undefined : true;
    }),
    fatoGeradorDefault: yup.number().test('required', 'Fato gerador default é obrigatório.', function (value) {
        return this.parent.digitaFatoGerador ? value !== undefined : true;
    }),
    historicoPadraoDefault: yup.number().test('required', 'Histórico padrão default é obrigatório.', function (value) {
        return this.parent.digitaHistoricoPadrao ? value !== undefined : true;
    })
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

const formData = reactive({
    nome: undefined,
    indicadorDC: "D",
});
const indicadoresDC = ref([]);

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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a operação.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a operação.', life: 5000 });
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
        formData.nome = undefined;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

const getProximoCodigo = () => {
    Service.getProximoCodigo()
        .then((data) => {
            formData.codigo = data;
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível obter o próximo código.', life: 5000 });
        });
};

const changeOperacaoTransferencia = () => {
    if (!formData.transferencia) {
        formData.operacaoCaixaBancoIdTransferencia = undefined;
    }
}

const changeInformarParceiro = () => {
    if (!formData.digitaParceiro) {
        formData.parceiroLocalDefault = undefined;
    }
}

const changeFatoGerador = () => {
    if (!formData.digitaFatoGerador) {
        formData.fatoGeradorDefault = undefined;
    }
}

const changeHistoricoPadrao = () => {
    if (!formData.digitaHistoricoPadrao) {
        formData.historicoPadraoDefault = undefined;
        formData.digitaComplementoHp = false;
    }

}

onMounted(() => {
    TiposService.getIndicadorDC().then((data) => {
        indicadoresDC.value = data;
    });
});
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '80%' }" :header="mode === 'create' ? 'Nova Operação' : 'Alterar Operação'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formOperacao" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Identificação da Operação">
                            <div class="formgrid grid">
                                <UWInteger id="codigo" label="Código" required autofocus v-model="formData.codigo" :showButton="true" @clickButton="getProximoCodigo" :errors="errors.value?.codigo" classContainer="col-12 md:col-1" />
                                <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-8" />
                                <UWInput id="sigla" label="Sigla" required v-model="formData.sigla" :errors="errors.value?.sigla" classContainer="col-12 md:col-3" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12">
                        <UWFieldSet title="Configuração da Operação">
                            <div class="formgrid grid">
                                <UWSeletor
                                    v-model="formData.tipoContaCxBcoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Tipo da Conta"
                                    :service="TipoContaCxBcoService"
                                    placeholder="Selecione o tipo da conta"
                                    :erros="errors.value?.tipoContaCxBcoId"
                                    classContainer="col-12 md:col-3"
                                />
                                <UWPickList
                                    id="indicadorDC"
                                    label="Indicador D/C"
                                    v-model="formData.indicadorDC"
                                    optionLabel="name"
                                    optionValue="value"
                                    :options="indicadoresDC"
                                    classContainer="col-12 md:col-3"
                                    :erros="errors.value?.indicadorDC"
                                />
                                <div class="field md:col-3 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton v-model="formData.transferencia" onLabel="Transferência" offLabel="Operação Normal" onIcon="pi pi-lock" offIcon="pi pi-lock-open" 
                                        class="w-full" aria-label="digitar vencimento" 
                                        @change="changeOperacaoTransferencia"/>
                                    </span>
                                </div>
                                <UWSeletor
                                    v-model="formData.operacaoCaixaBancoIdTransferencia"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="formData.transferencia"
                                    :disabled="!formData.transferencia"
                                    label="Operação de Destino para Transferência"
                                    :service="TipoContaCxBcoService"
                                    placeholder="Selecione a operação Destino da transferência"
                                    :erros="errors.value?.operacaoCaixaBancoIdTransferencia"
                                    classContainer="col-12 md:col-3"
                                />
                                <div class="field md:col-3 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="formData.digitaVencimento"
                                            onLabel="Digita Vencimento"
                                            offLabel="Não Digita Vencimento"
                                            onIcon="pi pi-lock"
                                            offIcon="pi pi-lock-open"
                                            class="w-full"
                                            aria-label="digitar vencimento"
                                            :pt="{
                                                root: {
                                                    class: [{ 'h-full': true, 'bg-green-100 border-white': formData.digitaVencimento, 'bg-red-100 border-white': !formData.digitaVencimento }]
                                                }
                                            }"
                                        />
                                    </span>
                                </div>
                                <div class="field md:col-3 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="formData.digitaDataMovimento"
                                            onLabel="Digita Data de Movimento"
                                            offLabel="Não Digita Data de Movimento"
                                            onIcon="pi pi-lock"
                                            offIcon="pi pi-lock-open"
                                            class="w-full"
                                            aria-label="digitar vencimento"
                                            :pt="{
                                                root: {
                                                    class: [{ 'h-full': true, 'bg-green-100 border-white': formData.digitaDataMovimento, 'bg-red-100 border-white': !formData.digitaDataMovimento }]
                                                }
                                            }"
                                        />
                                    </span>
                                </div>
                                <div class="field md:col-3 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="formData.digitaDocumento"
                                            onLabel="Digita Documento"
                                            offLabel="Não Digita Documento"
                                            onIcon="pi pi-lock"
                                            offIcon="pi pi-lock-open"
                                            class="w-full"
                                            aria-label="digitar vencimento"
                                            :pt="{
                                                root: {
                                                    class: [{ 'h-full': true, 'bg-green-100 border-white': formData.digitaDocumento, 'bg-red-100 border-white': !formData.digitaDocumento }]
                                                }
                                            }"
                                        />
                                    </span>
                                </div>
                                <div class="field md:col-3 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="formData.emiteRecibo"
                                            onLabel="Emitir Recibo"
                                            offLabel="Não Emitir Recibo"
                                            onIcon="pi pi-lock"
                                            offIcon="pi pi-lock-open"
                                            class="w-full"
                                            aria-label="digitar vencimento"
                                            :pt="{
                                                root: {
                                                    class: [{ 'h-full': true, 'bg-green-100 border-white': formData.emiteRecibo, 'bg-red-100 border-white': !formData.emiteRecibo }]
                                                }
                                            }"
                                        />
                                    </span>
                                </div>
                                <div class="field md:col-3 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="formData.digitaParceiro"
                                            onLabel="Informar Parceiro"
                                            offLabel="Não Informar Parceiro"
                                            onIcon="pi pi-lock"
                                            offIcon="pi pi-lock-open"
                                            class="w-full"
                                            @change="changeInformarParceiro"
                                        />
                                    </span>
                                </div>
                                <UWParceiroLocal id="parceiroLocal" classContainer="col-12 md:col-3" v-model="formData.parceiroLocalDefault" 
                                    :required="formData.digitaParceiro" :disabled="!formData.digitaParceiro" label="Parceiro Default" :erros="errors.value?.parceiroLocalDefault" />
                                <div class="field md:col-3 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="formData.digitaFatoGerador"
                                            onLabel="Informar Fato Gerador"
                                            offLabel="Não Informar Fato Gerador"
                                            onIcon="pi pi-lock"
                                            offIcon="pi pi-lock-open"
                                            class="w-full"
                                            @change="changeFatoGerador"
                                        />
                                    </span>
                                </div>
                                <UWSeletor
                                    v-model="formData.fatoGeradorDefault"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="formData.digitaFatoGerador"
                                    :disabled="!formData.digitaFatoGerador"
                                    label="Fato Gerador Default"
                                    :service="FatoGeradorService"
                                    placeholder="Selecione o fato gerador"
                                    :erros="errors.value?.fatoGeradorDefault"
                                    classContainer="col-12 md:col-3"
                                />
                                <div class="field md:col-3 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="formData.digitaHistoricoPadrao"
                                            onLabel="Informar Histórico Padrão"
                                            offLabel="Não Informar Histórico Padrão"
                                            onIcon="pi pi-lock"
                                            offIcon="pi pi-lock-open"
                                            class="w-full"
                                            aria-label="digitar vencimento"
                                            @change="changeHistoricoPadrao"
                                        />
                                    </span>
                                </div>
                                <UWSeletor
                                    v-model="formData.historicoPadraoDefault"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="formData.digitaHistoricoPadrao"
                                    :disabled="!formData.digitaHistoricoPadrao"
                                    label="Histórico Padrão Default"
                                    :service="HistoricoPadraoService"
                                    placeholder="Selecione o histórico padrão default"
                                    :erros="errors.value?.historicoPadraoDefault"
                                    classContainer="col-12 md:col-3"
                                />
                                <div class="field md:col-3 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="formData.digitaComplementoHp"
                                            onLabel="Informar Complemento Histórico Padrão"
                                            offLabel="Não Informar Complemento Histórico Padrão"
                                            onIcon="pi pi-lock"
                                            offIcon="pi pi-lock-open"
                                            :disabled="!formData.digitaHistoricoPadrao"
                                            class="w-full"
                                            aria-label="digitar vencimento"
                                        />
                                    </span>
                                </div>
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
