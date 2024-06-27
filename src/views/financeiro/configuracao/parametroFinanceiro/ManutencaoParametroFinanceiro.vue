<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import {
    ParametroFinanceiroService as Service,
    TipoTituloService,
    CaracteristicaMovimentoFinanceiroService,
    CarteiraFinanceiraService,
    FatoGeradorService,
    PlanoClassificacaoFinanceiraService,
    OperacaoMovimentacaoFinanceiroService,
    OperacaoAcessoriaFinanceiraService,
    TiposService
} from '@/service';

const schema = yup.object().shape({});

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
    codigo: undefined
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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetro financeiro criado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o parâmetro financeiro.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parâmetro financeiro alterado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o parâmetro financeiro.', life: 5000 });
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
        formData.codigo = undefined;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

onMounted(() => {
    TiposService.getIndicadorDC().then((data) => {
        indicadoresDC.value = data;
    });
});
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '60%' }" :header="mode === 'create' ? 'Novo Parâmetro Financeiro' : 'Alterar Parâmetro Financeiro'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formParametroFinanceiro" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="grid nested-grid">
                        <div class="col-12">
                            <UWFieldSet title="Característica do Lançamento" class="h-full">
                                <div class="p-fluid formgrid grid">
                                    <UWSeletor
                                        id="tipoTitulo"
                                        classContainer="col-12 md:col-6"
                                        v-model="formData.tipoTituloId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        required
                                        label="Tipo de Título"
                                        :service="TipoTituloService"
                                        placeholder="Selecione o tipo de título"
                                        :erros="errors.value?.tipoTituloId"
                                    />
                                    <UWSeletor
                                        id="caracteristicaMovimentoFinanceiro"
                                        classContainer="col-12 md:col-6"
                                        v-model="formData.caracteristicaMovimentoFinanceiroId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        required
                                        label="Característica de Movimento"
                                        :service="CaracteristicaMovimentoFinanceiroService"
                                        placeholder="Selecione a característica de movimento"
                                        :erros="errors.value?.caracteristicaMovimentoFinanceiroId"
                                    />
                                    <UWSeletor
                                        id="fatoGerador"
                                        classContainer="col-12 md:col-6"
                                        v-model="formData.fatoGeradorId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        required
                                        label="Fato Gerador"
                                        :service="FatoGeradorService"
                                        placeholder="Selecione o fato gerador"
                                        :erros="errors.value?.fatoGeradorId"
                                    />
                                    <UWSeletor
                                        id="carteiraFinanceira"
                                        classContainer="col-12 md:col-6"
                                        v-model="formData.carteiraFinanceiraId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        required
                                        label="Carteira Financeira"
                                        :service="CarteiraFinanceiraService"
                                        placeholder="Selecione a carteira financeira"
                                        :erros="errors.value?.carteiraFinanceiraId"
                                        @changeObject="onChangeCarteira"
                                    />
                                </div>
                            </UWFieldSet>
                        </div>
                        <div class="col-12">
                            <UWFieldSet title="Característica da Operação" class="h-full">
                                <div class="p-fluid formgrid grid">
                                    <UWSeletor
                                        id="operacaoMovimentoFinanceiro"
                                        classContainer="col-12 md:col-5"
                                        v-model="formData.operacaoMovimentoFinanceiroId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        required
                                        label="Operação de Movimento"
                                        :service="OperacaoMovimentacaoFinanceiroService"
                                        placeholder="Selecione a operação"
                                        :erros="errors.value?.operacaoMovimentoFinanceiroId"
                                    />
                                    <UWSeletor
                                        id="operacaoAcessoriaFinanceira"
                                        classContainer="col-12 md:col-5"
                                        v-model="formData.operacaoAcessoriaFinanceiraId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        required
                                        label="Operação Acessória"
                                        :service="OperacaoAcessoriaFinanceiraService"
                                        placeholder="Selecione a operação"
                                        :erros="errors.value?.operacaoAcessoriaFinanceira"
                                    />
                                    <UWPickList
                                        id="indicadorDC"
                                        label="Indicador D/C"
                                        v-model="formData.indicadorDC"
                                        optionLabel="name"
                                        optionValue="value"
                                        :options="indicadoresDC"
                                        classContainer="col-12 md:col-2"
                                        :erros="errors.value?.indicadorDC"
                                    />
                                </div>
                            </UWFieldSet>
                        </div>
                        <div class="col-12">
                            <UWFieldSet title="Identificação da Conta" class="h-full">
                                <div class="p-fluid formgrid grid">
                                    <UWSeletor
                                        classContainer="col-12 md:col-12"
                                        v-model="formData.planoClassificacaoFinanceiraId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        label="Classificação Financeira"
                                        :service="PlanoClassificacaoFinanceiraService"
                                        placeholder="Selecione a classificação"
                                        :erros="errors?.value?.planoClassificacaoFinanceiraId"
                                        positionTooltip="left"
                                    />
                                </div>
                            </UWFieldSet>
                        </div>
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
