<script setup>
import { ref, reactive, computed, defineProps, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useContexto } from '@/stores';
import * as yup from 'yup';
import _ from 'lodash';
import { PrecoAgricolaService as Service, ItemService, TipoPrecoAgricolaService, PredefinicaoPrecoAgricolaService,
        EmpresaFilialService, DepartamentoService } from '@/service';
import UWSeletorSubItemClassAgricolaRomaneio from '@/components/seletores/subItemClassificacaoAgricola/UWSeletorSubItemClassAgricolaRomaneio.vue';
        
const formData = reactive({
    itemId: undefined,
    tipoPrecoAgricolaId: undefined,
    empresaId: undefined,
    empresaFilialId: undefined,
    departamentoId: undefined,
    predefinicaoPrecoAgricolaId: undefined,
    nivelClass1: undefined,
    nivelClass2: undefined,
    nivelClass3: undefined,
    nivelClass4: undefined,
    valorUnitario: undefined,
    dataInicioVigencia: null,
    dataFinalVigencia: null
});

const schema = yup.object().shape({
    itemId: yup.number().required('Produto é obrigatório.'),
    tipoPrecoAgricolaId: yup.number().required('Tipo de Preço Agrícola é obrigatório.'),
    predefinicaoPrecoAgricolaId: yup.number().required('Predefinição de Preço Agrícola é obrigatório.'),
    nivelClass1: formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada?.value?.itemClassificacaoAgricola1Codigo !== 0 ? yup.number().required('Nível Classificação 1 é obrigatório.') : yup.number(),
    nivelClass2: formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada?.value?.itemClassificacaoAgricola2Codigo !== 0 ? yup.number().required('Nível Classificação 2 é obrigatório.') : yup.number(),
    nivelClass3: formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada?.value?.itemClassificacaoAgricola3Codigo !== 0 ? yup.number().required('Nível Classificação 3 é obrigatório.') : yup.number(),
    nivelClass4: formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada?.value?.itemClassificacaoAgricola4Codigo !== 0 ? yup.number().required('Nível Classificação 4 é obrigatório.') : yup.number(),
    valorUnitario: yup.number().required('Valor Unitário é obrigatório.'),
    dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.')
        .nullable()
        .max(yup.ref('dataFinalVigencia'), 'Data de início de vigência deve ser menor que a data final.'),
    dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.')
        .nullable()
        .min(yup.ref('dataInicioVigencia'), 'Data final de vigência deve ser maior que a data inicial.')
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
const contextoStore = useContexto();
const predefinicaoSelecionada = ref();

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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Preço agrícola criado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o preço agrícola.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Preço agrícola alterado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o preço agrícola.', life: 5000 });
        });
};

const salvarRegistro = async () => {
    formData.empresaId = contextoStore.contexto.empresaId;
    if (props.mode === 'create') {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const showModal = async () => {
    if (props.mode === 'create') {
        formData.itemId = undefined;
        formData.tipoPrecoAgricolaId = undefined;
        formData.empresaId = undefined;
        formData.empresaFilialId = undefined;
        formData.departamentoId = undefined;
        formData.predefinicaoPrecoAgricolaId = undefined;
        formData.nivelClass1 = undefined;
        formData.nivelClass2 = undefined;
        formData.nivelClass3 = undefined;
        formData.nivelClass4 = undefined;
        formData.valorUnitario = undefined;
        formData.dataInicioVigencia = undefined;
        formData.dataFinalVigencia = undefined;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

const changePredefinicaoPrecoAgricola = (predefinicao) => {
    if (predefinicao) {
        predefinicaoSelecionada.value = predefinicao;
    } else {
        predefinicaoSelecionada.value = undefined;
        formData.nivelClass1 = undefined;
        formData.nivelClass2 = undefined;
        formData.nivelClass3 = undefined;
        formData.nivelClass4 = undefined;
    }
};

onMounted(async () => {
    formData.value.empresaId = contextoStore.contexto.empresaId;
});
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '50%' }" :header="mode === 'create' ? 'Novo Preço Agrícola' : 'Alterar Preço Agrícola'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formPrecoAgricola" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor
                            label="Produto"
                            classContainer="col-12 md:col-12"
                            v-model="formData.itemId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="ItemService"
                            placeholder="Selecione o produto"
                            :erros="errors.value?.itemId"
                        />
                        <UWSeletor
                            id="empresaFilial"
                            classContainer="col-12 md:col-6"
                            v-model="formData.empresaFilialId"
                            optionLabel="nome"
                            optionValue="id"
                            label="Filial"
                            :service="EmpresaFilialService"
                            placeholder="Selecione a filial"
                            :erros="errors.value?.empresaFilialId"
                            @changeObject="formData.departamentoId = undefined"
                            :columnsFilters="[{ field: 'empresa', value: contextoStore.contexto.empresaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresa.id' }]"
                        />
                        <UWSeletor
                            id="departamento"
                            classContainer="col-12 md:col-6"
                            v-model="formData.departamentoId"
                            optionLabel="nome"
                            optionValue="id"
                            label="Departamento"
                            :service="DepartamentoService"
                            placeholder="Selecione o departamento"
                            :erros="errors.value?.departamentoId"
                            :columnsFilters="[{ field: 'empresaFilial', value: formData.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                        />
                        <UWSeletor
                            label="Tipo de Preço Agrícola"
                            classContainer="col-12 md:col-6"
                            v-model="formData.tipoPrecoAgricolaId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="TipoPrecoAgricolaService"
                            placeholder="Selecione o tipo de preço agrícola"
                            :erros="errors.value?.tipoPrecoAgricolaId"
                        />
                        <UWSeletor
                            label="Predefinição de Preço Agrícola"
                            classContainer="col-12 md:col-6"
                            v-model="formData.predefinicaoPrecoAgricolaId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="PredefinicaoPrecoAgricolaService"
                            placeholder="Selecione a definição de preço agrícola"
                            :erros="errors.value?.predefinicaoPrecoAgricolaId"
                            @changeObject="changePredefinicaoPrecoAgricola"
                        />               
                        <UWSeletorSubItemClassAgricolaRomaneio
                            classContainer="col-12 md:col-6"
                            :required="formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada.itemClassificacaoAgricola1Codigo !== 0"
                            :disabled="!formData.predefinicaoPrecoAgricolaId || (predefinicaoSelecionada && predefinicaoSelecionada.itemClassificacaoAgricola1Codigo === 0)"
                            :label="formData.predefinicaoPrecoAgricolaId ? predefinicaoSelecionada.itemClassificacaoAgricola1Nome : 'Nível Classificação 1'"
                            v-model="formData.nivelClass1"
                            :itemId="formData.itemId"
                            :itemClassificacaoAgricolaId="predefinicaoSelecionada?.itemClassificacaoAgricola1Id"
                            :dataRomaneio="new Date()"
                            optionLabel="nome"
                            optionValue="id"
                            :erros="errors.value?.nivelClass1"
                        /> 
                        <UWSeletorSubItemClassAgricolaRomaneio
                            classContainer="col-12 md:col-6"
                            :required="formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada.itemClassificacaoAgricola2Codigo !== 0"
                            :disabled="!formData.predefinicaoPrecoAgricolaId || (predefinicaoSelecionada && predefinicaoSelecionada.itemClassificacaoAgricola2Codigo === 0)"
                            :label="formData.predefinicaoPrecoAgricolaId ? predefinicaoSelecionada.itemClassificacaoAgricola2Nome : 'Nível Classificação 2'"
                            v-model="formData.nivelClass2"
                            :itemId="formData.itemId"
                            :itemClassificacaoAgricolaId="predefinicaoSelecionada?.itemClassificacaoAgricola2Id"
                            :dataRomaneio="new Date()"
                            optionLabel="nome"
                            optionValue="id"
                            :erros="errors.value?.nivelClass3"
                        />         
                        <UWSeletorSubItemClassAgricolaRomaneio
                            classContainer="col-12 md:col-6"
                            :required="formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada.itemClassificacaoAgricola3Codigo !== 0"
                            :disabled="!formData.predefinicaoPrecoAgricolaId || (predefinicaoSelecionada && predefinicaoSelecionada.itemClassificacaoAgricola3Codigo === 0)"
                            :label="formData.predefinicaoPrecoAgricolaId ? predefinicaoSelecionada.itemClassificacaoAgricola3Nome : 'Nível Classificação 3'"
                            v-model="formData.nivelClass3"
                            :itemId="formData.itemId"
                            :itemClassificacaoAgricolaId="predefinicaoSelecionada?.itemClassificacaoAgricola3Id"
                            :dataRomaneio="new Date()"
                            optionLabel="nome"
                            optionValue="id"
                            :erros="errors.value?.nivelClass3"
                        />    
                        <UWSeletorSubItemClassAgricolaRomaneio
                            classContainer="col-12 md:col-6"
                            :required="formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada.itemClassificacaoAgricola4Codigo !== 0"
                            :disabled="!formData.predefinicaoPrecoAgricolaId || (predefinicaoSelecionada && predefinicaoSelecionada.itemClassificacaoAgricola4Codigo === 0)"
                            :label="formData.predefinicaoPrecoAgricolaId ? predefinicaoSelecionada.itemClassificacaoAgricola4Nome : 'Nível Classificação 4'"
                            v-model="formData.nivelClass4"
                            :itemId="formData.itemId"
                            :itemClassificacaoAgricolaId="predefinicaoSelecionada?.itemClassificacaoAgricola4Id"
                            :dataRomaneio="new Date()"
                            optionLabel="nome"
                            optionValue="id"
                            :erros="errors.value?.nivelClass4"
                        />             
                        <UWCurrency id="valorUnitário" label="Valor Unitário" required v-model="formData.valorUnitario" :errors="errors.value?.valorUnitario" classContainer="col-12 md:col-4" />
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-4" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-4" />                        
                    </div>
                </div>
                <code>FormData: {{  predefinicaoSelecionada }}</code>
            </template>
        </UWForm>
    </Dialog>
</template>
