<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import CondicaoPagamentoService from '@/service/CondicaoPagamentoService';
import TiposService from '@/service/TiposService';

const createSchema = () => {
    return yup.object().shape({
        nome: yup.string().required('Nome é obrigatório.').max(80, 'Nome deve ter no máximo 80 caracteres.'),
        codigo: yup.number().required('Código é obrigatório.'),
        descricao: yup.string().required('Descrição é obrigatório.').max(250, 'Descrição deve ter no máximo 250 caracteres.'),
        indicadorFormaPagamento: yup.string().required('Forma de Pagamento é obrigatória.'),
        tipoCondicaoPagamento: formData.indicadorFormaPagamento === '1' ? yup.string().nullable() : yup.string().required('Tipo da Condição de Pagamento é obrigatório.'),
        quantidadeParcelas: formData.indicadorFormaPagamento === '1' ? yup.number().nullable() : yup.number().required('Quantidade de parcelas é obrigatória.'),
        diaVencimento: formData.tipoCondicaoPagamento !== '2' ? yup.number().nullable() : yup.number().required('Dia de vencimento é obrigatório.'),
        diasIntervalo: formData.tipoCondicaoPagamento !== '3' ? yup.number().nullable() : yup.number().required('Dias de intervalo é obrigatório.'),
        diasDivisao: formData.tipoCondicaoPagamento === '4' ? yup
            .string()
            .required('Divisão de parcelas é obrigatória.')
            .test('validar-divisao-parcelas', 'Formato inválido ou dias fora de ordem crescente, ou quantidade de parcelas não corresponde.', function (value) {
                // Acessa `quantidadeParcelas` usando `this.parent` para validar ambos os campos
                const { quantidadeParcelas, tipoCondicaoPagamento } = this.parent;
                if (tipoCondicaoPagamento !== '4') return true;

                return validarDivisaoParcelas(value, quantidadeParcelas);
            }) : yup.string().nullable(),
        composicao: formData.tipoCondicaoPagamento === '5' ? yup
            .string()
            .required('Composição de parcelas é obrigatória.')
            .test('validar-composicao-parcelas', 'Formato inválido ou soma dos percentuais diferente de 100%, ou dias fora de ordem crescente, ou quantidade de parcelas não corresponde.', function (value) {
                // Acessa `quantidadeParcelas` usando `this.parent` para validar ambos os campos
                const { quantidadeParcelas, tipoCondicaoPagamento } = this.parent;
                if (tipoCondicaoPagamento !== '5') return true;

                return validarComposicaoParcelas(value, quantidadeParcelas);
            }) : yup.string().nullable()
    });
};

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
    indicadorFormaPagamento: undefined,
    tipoCondicaoPagamento: undefined
});
const indicadoresFormaPagamento = ref([]);
const tiposCondicaoPagamento = ref();

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
    CondicaoPagamentoService.create(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Condição de pagamento criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a condição de pagamento.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    CondicaoPagamentoService.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Condição de pagamento alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a condição de pagamento.', life: 5000 });
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
        formData.codigo = undefined;
        formData.nome = undefined;
        formData.descricao = undefined;
        formData.indicadorFormaPagamento = undefined;
        formData.tipoCondicaoPagamento = undefined;
        formData.possuiEntrada = false;
        formData.quantidadeParcelas = undefined;
        formData.diaVencimento = undefined;
        formData.diasIntervalo = undefined;
        formData.diasDivisao = undefined;
        formData.composicao = undefined;
    } else {
        await CondicaoPagamentoService.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

const getProximoCodigo = () => {
    CondicaoPagamentoService.getProximoCodigo()
        .then((data) => {
            formData.codigo = data;
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível obter o próximo código.', life: 5000 });
        });
};

const tiposCondicaoPagamentoPermitidas = computed(() => {
    if (!formData.indicadorFormaPagamento || formData.indicadorFormaPagamento === '1') return tiposCondicaoPagamento.value.filter((f) => f.value === '1');
    else return tiposCondicaoPagamento.value.filter((f) => f.value !== '1');
});

const changeIndicadorFormaPagamento = (registro) => {
    if (registro.value === '1') {
        formData.tipoCondicaoPagamento = '1';
        return;
    }
    formData.tipoCondicaoPagamento = undefined;
    formData.possuiEntrada = false;
    formData.quantidadeParcelas = undefined;
    formData.diaVencimento = undefined;
    formData.diasIntervalo = undefined;
    formData.diasDivisao = undefined;
    formData.composicao = undefined;
};

const changeTipoCondicaoPagamento = (registro) => {
    formData.diaVencimento = undefined;
    formData.diasIntervalo = undefined;
    formData.diasDivisao = undefined;
    formData.composicao = undefined;
    if (registro.value === '6') formData.possuiEntrada = false;
};

const validarComposicaoParcelas = (textoParcelas, quantidadeParcelas) => {
    let somaPercentuais = 0;
    let diasAnterior = 0;

    // Expressão regular para validar o formato `x%ndias`
    const regexFormato = /^\d+%\d+$/;

    // Separar a string em parcelas usando a vírgula como delimitador
    const parcelas = textoParcelas.split(',');

    // Verificar se a quantidade de parcelas corresponde ao campo quantidadeParcelas
    if (parcelas.length !== quantidadeParcelas) {
        return false; // Número de parcelas não corresponde ao valor esperado
    }

    for (const parcela of parcelas) {
        // Verificar se a estrutura está correta
        if (!regexFormato.test(parcela)) {
            return false; // Formato inválido
        }

        // Separar percentual e dias
        const [percentual, dias] = parcela.split('%').map(Number);

        // Validação da soma dos percentuais
        somaPercentuais += percentual;

        // Validação da ordem dos dias
        if (dias <= diasAnterior) {
            return false; // Dias não estão em ordem crescente
        }

        diasAnterior = dias;
    }

    // Verifica se a soma dos percentuais é 100
    return somaPercentuais === 100;
};

const validarDivisaoParcelas = (textoParcelas, quantidadeParcelas) => {
    let diasAnterior = 0;

    // Expressão regular para validar o formato `x%ndias`
    const regexFormato = /^\d+$/;

    // Separar a string em parcelas usando a vírgula como delimitador
    const parcelas = textoParcelas.split(',');

    // Verificar se a quantidade de parcelas corresponde ao campo quantidadeParcelas
    if (parcelas.length !== quantidadeParcelas) {
        return false; // Número de parcelas não corresponde ao valor esperado
    }

    for (const parcela of parcelas) {
        // Verificar se a estrutura está correta
        if (!regexFormato.test(parcela)) {
            return false; // Formato inválido
        }

        // Validação da ordem dos dias
        if (parcela * 1 <= diasAnterior) {
            return false; // Dias não estão em ordem crescente
        }

        diasAnterior = parcela * 1;
    }

    return true

};


onMounted(() => {
    TiposService.getIndicadorFormaPagamento().then((data) => {
        indicadoresFormaPagamento.value = data;
    });
    TiposService.getTipoCondicaoPagamento().then((data) => {
        tiposCondicaoPagamento.value = data;
    });
});
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '70%' }" :header="mode === 'create' ? 'Nova Condição de Pagamento' : 'Alterar Condição de Pagamento'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="createSchema()" :values="formData" ref="formCondicaoPagamento" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWFieldSet title="Identificação da Condição de Pagamento" class="col-12 h-full flex flex-column justify-content-start border-solid">
                            <div class="p-fluid formgrid grid">
                                <UWInteger id="codigo" label="Código" required autofocus v-model="formData.codigo" :showButton="true" @clickButton="getProximoCodigo" :errors="errors.value?.codigo" classContainer="col-12 md:col-2" />
                                <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-4" />
                                <UWInput id="descricao" label="Descricao" required v-model="formData.descricao" :errors="errors.value?.descricao" classContainer="col-12 md:col-6" />
                            </div>
                        </UWFieldSet>
                        <UWFieldSet title="Configuração da Condição de Pagamento" class="col-12 h-full flex flex-column justify-content-start border-solid mt-2">
                            <div class="p-fluid formgrid grid">
                                <UWPickList
                                    id="indicadorFormaPagamento"
                                    label="Forma de Pagamento"
                                    v-model="formData.indicadorFormaPagamento"
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="indicadoresFormaPagamento"
                                    classContainer="col-12 md:col-2"
                                    :errors="errors.value?.indicadorFormaPagamento"
                                    @changeObject="changeIndicadorFormaPagamento"
                                />
                                <UWPickList
                                    id="tipoCondicaoPagamento"
                                    label="Tipo da Condição de Pagamento"
                                    v-model="formData.tipoCondicaoPagamento"
                                    :disabled="formData.indicadorFormaPagamento === '1'"
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="tiposCondicaoPagamentoPermitidas"
                                    classContainer="col-12 md:col-3"
                                    :errors="errors.value?.tipoCondicaoPagamento"
                                    @changeObject="changeTipoCondicaoPagamento"
                                />
                                <UWToggleButton
                                    v-if="formData.indicadorFormaPagamento !== '1' && formData.tipoCondicaoPagamento !== '6'"
                                    id="possuiEntrada"
                                    classContainer="col-12 md:col-2"
                                    v-model="formData.possuiEntrada"
                                    onLabel="Tem Entrada"
                                    offLabel="Não tem entrada"
                                    onIcon="pi pi-thumbs-up"
                                    offIcon="pi pi-thumbs-down"
                                />
                                <UWInteger
                                    v-if="formData.indicadorFormaPagamento !== '1' && formData.tipoCondicaoPagamento !== '6'"
                                    id="quantidadeParcelas"
                                    label="Quantidade Parcelas"
                                    required
                                    autofocus
                                    v-model="formData.quantidadeParcelas"
                                    :errors="errors.value?.quantidadeParcelas"
                                    classContainer="col-12 md:col-2"
                                />
                                <UWInteger
                                    v-if="formData.indicadorFormaPagamento !== '1' && formData.tipoCondicaoPagamento === '2'"
                                    id="diaVencimento"
                                    label="Dia de Vencimento"
                                    required
                                    autofocus
                                    v-model="formData.diaVencimento"
                                    :errors="errors.value?.diaVencimento"
                                    classContainer="col-12 md:col-3"
                                />
                                <UWInteger
                                    v-if="formData.indicadorFormaPagamento !== '1' && formData.tipoCondicaoPagamento === '3'"
                                    id="diasIntervalo"
                                    label="Dias de Intervalo"
                                    required
                                    autofocus
                                    v-model="formData.diasIntervalo"
                                    :errors="errors.value?.diasIntervalo"
                                    classContainer="col-12 md:col-3"
                                />
                                <UWInput
                                    v-if="formData.indicadorFormaPagamento !== '1' && formData.tipoCondicaoPagamento === '4'"
                                    id="diasDivisao"
                                    label="Divisão de Parcelas"
                                    required
                                    autofocus
                                    v-model="formData.diasDivisao"
                                    :errors="errors.value?.diasDivisao"
                                    classContainer="col-12 md:col-3"
                                />
                                <UWInput
                                    v-if="formData.indicadorFormaPagamento !== '1' && formData.tipoCondicaoPagamento === '5'"
                                    id="composicao"
                                    label="Composição das Parcelas"
                                    required
                                    autofocus
                                    v-model="formData.composicao"
                                    :errors="errors.value?.composicao"
                                    classContainer="col-12 md:col-3"
                                />
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
