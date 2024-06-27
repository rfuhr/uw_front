<!-- eslint-disable vue/no-deprecated-filter -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { OperacaoInternaService, TiposService } from '@/service';
import moment from 'moment'

const confirm = useConfirm();
const toast = useToast();

const visibleDialog = ref(false);
const modeDialog = ref('')
const indexIndiceEdicao = ref(0);

const tiposOperacoes = ref();

const formData = ref({
    operacaoInternaId: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined,    
    operacaoEstoque: undefined
});

const props = defineProps({
    modelValue: []
});

const createSchema = () => {
    return yup.object().shape({
        operacaoInternaId: yup.number().required('Operação Interna de Mark Up é obrigatório.'),
        dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
        dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
    });
};

const formataData = (data) => {
    if (data) {
        moment.locale('pt-br')
        return moment(data).format('DD/MM/YYYY')
    }
    return ''
}

const emit = defineEmits(['update:modelValue']);

const operacoesModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarOperacao = () => {
    formData.value = {
        operacaoInternaId: undefined,
        dataInicioVigencia: undefined,
        dataFinalVigencia: undefined,    
        operacaoEstoque: undefined
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const confirmarOperacao = async () => {
    if (modeDialog.value === 'add') {
        const operacao = operacoesModelValue.value.filter((item) => item.operacaoInternaId === formData.value.operacaoInternaId);
        let existe = false;
        if (operacao.length > 0) {
            operacoesModelValue.value.map((item) => {
                if ((formData.value.dataInicioVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataInicioVigencia <= new Date(item.dataFinalVigencia))
                    || (formData.value.dataFinalVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia <= new Date(item.dataFinalVigencia)) 
                    || (formData.value.dataInicioVigencia <= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia >= new Date(item.dataFinalVigencia)))
                {
                    existe = true;
                }
            })
            if (existe) {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Não é possível incluir a Operação Interna, pois o mesmo já possui uma Configuração nesse Período.', life: 5000 });
                return
            }
        }

        if (!existe) {
            operacoesModelValue.value.push({ ...formData.value });
        }
    } else {
        operacoesModelValue.value[indexIndiceEdicao.value] = { ...formData.value };
    }
    emit('update:modelValue', operacoesModelValue.value);
    visibleDialog.value = false;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexIndiceEdicao.value = slot.index;
    formData.value = { ...slot.data };
    modeDialog.value = 'edit';
    visibleDialog.value = true;
};

const handleDelete = (event, data) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir este registro?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            const listaFiltrada = operacoesModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação Interna removida com sucesso', life: 5000 });
            emit('update:modelValue', listaFiltrada);
        },
        reject: () => {

        }
    });
};

const changeOperacao = async (event) => {
    if (!event) {
        formData.value.operacaoInternaSigla = ''
        formData.value.operacaoInternaNome = ''
    } else {
        formData.value.operacaoInternaSigla = event.sigla
        formData.value.operacaoInternaNome = event.nome
    }
}

const changeOperacaoEstoque = async (event) => {
    if (!event) {
        formData.value.operacaoEstoqueName = ''
    } else {
        formData.value.operacaoEstoqueName = event.name
    }
}

onMounted(async () => {
    await TiposService.getOperacaoEstoque().then((data) => {
        tiposOperacoes.value = data;
    });
});

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Operação Interna" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarOperacao()" />
                </div>
            </template>
        </Toolbar>
        <DataTable 
            id="dtOperacoes" 
            ref="dtOperacoes" 
            :value="operacoesModelValue" 
            responsiveLayout="scroll"
            >
            <template #empty> Nenhum Operação Interna informado. </template>

            <Column field="operacaoInternaSigla" header="Sigla" style="width: 12%"> </Column>
            <Column field="operacaoInternaNome" header="Operação Interna" style="width: 30%"> </Column>
            <Column field="operacaoEstoqueName" header="Operação" style="width: 10%"> </Column>
            <Column header="Início Vigência" style="width: 10%">
                <template #body="slotProps">
                    <span>{{ formataData(slotProps.data.dataInicioVigencia) }}</span>
                </template>
            </Column>
            <Column header="Final Vigência" style="width: 10%">
                <template #body="slotProps">
                    <span>{{ formataData(slotProps.data.dataFinalVigencia) }}</span>
                </template>
            </Column>

            <Column header="Ações" style="width: 10%">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps)" />
                    <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="visibleDialog" :style="{ width: '80%' }" header="Detalhes das Operação Internas" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarOperacao" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor 
                                id="seletorOperacaoInterna" 
                                label="Operação Interna" 
                                v-model="formData.operacaoInternaId" 
                                required
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione a Operação Interna" 
                                :service="OperacaoInternaService" 
                                classContainer="col-12 md:col-12"
                                :erros="errors?.value?.operacaoInternaId"
                                @changeObject="changeOperacao"
                            >
                        </UWSeletor>  
                        <UWPickList id="operacaoEstoque" label="Operação" v-model="formData.operacaoEstoque" optionLabel="name" optionValue="value" required :options="tiposOperacoes" @changeObject="changeOperacaoEstoque" classContainer="col-12 md:col-4" />
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-4" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-4" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>

</template>
