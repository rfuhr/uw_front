<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { OperacaoInternaService } from '@/service';
import moment from 'moment'

const confirm = useConfirm();
const toast = useToast();

const visibleDialog = ref(false);
const modeDialog = ref('')
const indexOperInternaEdicao = ref(0);

const formData = ref({
    operacaoInternaId: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined
});

const props = defineProps({
    modelValue: {}
});

const createSchema = () => {
    return yup.object().shape({
        operacaoInternaId: yup.number().required('Operação Interna é obrigatória.'),
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

const operInternasModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarOperInterna = () => {
    formData.value = {
        operacaoInternaId: undefined,
        dataInicioVigencia: undefined,
        dataFinalVigencia: undefined
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const confirmarOperInterna = async () => {
    if (modeDialog.value === 'add') {
        const operInterna = operInternasModelValue.value.filter((item) => item.operacaoInternaId === formData.value.operacaoInternaId);
        let existe = false;
        if (operInterna.length > 0) {
            operInterna.map((item) => {
                if ((formData.value.dataInicioVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataInicioVigencia <= new Date(item.dataFinalVigencia))
                    || (formData.value.dataFinalVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia <= new Date(item.dataFinalVigencia)) 
                    || (formData.value.dataInicioVigencia <= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia >= new Date(item.dataFinalVigencia)))
                {
                    existe = true;
                }
            })
            if (existe) {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Não é possível incluir a Operação Interna, pois a mesma já possui uma Configuração nesse Período.', life: 5000 });
                return
            }
        }

        if (!existe) {
            operInternasModelValue.value.push({ ...formData.value });
        }
    } else {
        operInternasModelValue.value[indexOperInternaEdicao.value] = { ...formData.value };
    }
    emit('update:modelValue', operInternasModelValue.value);
    visibleDialog.value = false;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexOperInternaEdicao.value = slot.index;
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
            const listaFiltrada = operInternasModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação Interna removida com sucesso', life: 5000 });
            emit('update:modelValue', listaFiltrada);
        },
        reject: () => {

        }
    });
};

const changeOperacaoInterna = async (object) => {
    if (!object) {
        formData.value.operacaoInternaNome = undefined
        formData.value.operacaoInternaSigla = undefined
        return;
    }
    formData.value.operacaoInternaNome = object.nome
    formData.value.operacaoInternaSigla = object.sigla
}

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Operação Interna" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarOperInterna()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtConfigFiscais" :value="operInternasModelValue" responsiveLayout="scroll">
            <template #empty> Nenhuma Operação Interna informada. </template>

            <Column field="operacaoInternaId" header="Identificador" style="width: 12%"> </Column>
            <Column field="operacaoInternaNome" header="Operação Interna" style="width: 35%"> </Column>
            <Column field="operacaoInternaSigla" header="Sigla" style="width: 15%"> </Column>
            <Column header="Início Vigência" style="width: 15%">
                <template #body="slotProps">
                    <span>{{ formataData(slotProps.data.dataInicioVigencia) }}</span>
                </template>
            </Column>
            <Column header="Final Vigência" style="width: 15%">
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

    <Dialog v-model:visible="visibleDialog" :style="{ width: '70%' }" header="Detalhes da Operação Interna" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarOperInterna" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor 
                                id="seletorOperacaoInterna" 
                                label="Operação Interna" 
                                v-model="formData.operacaoInternaId" 
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione a Operação Interna" 
                                :service="OperacaoInternaService" 
                                classContainer="col-12 md:col-12"
                                :erros="errors?.value?.operacaoInternaId"
                                @changeObject="changeOperacaoInterna"
                            >
                        </UWSeletor>  
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-3" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-3" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>

</template>
