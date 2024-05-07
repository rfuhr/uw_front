<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { TipoIncentivoFiscalService } from '@/service';
import moment from 'moment'

const confirm = useConfirm();
const toast = useToast();

const visibleDialog = ref(false);
const modeDialog = ref('')
const indexTipoIncentFiscalEdicao = ref(0);

const formData = ref({
    tipoIncentivoFiscalId: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined
});

const props = defineProps({
    modelValue: {}
});

const createSchema = () => {
    return yup.object().shape({
        tipoIncentivoFiscalId: yup.number().required('Incentivo Fiscal é obrigatório.'),
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

const tipoIncentFicalsModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarTipoIncentFiscal = () => {
    formData.value = {
        tipoIncentivoFiscalId: undefined,
        dataInicioVigencia: undefined,
        dataFinalVigencia: undefined
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const confirmarTipoIncentFiscal = async () => {
    if (modeDialog.value === 'add') {
        const tipoIncentFiscal = tipoIncentFicalsModelValue.value.filter((item) => item.tipoIncentivoFiscalId === formData.value.tipoIncentivoFiscalId);
        let existe = false;
        if (tipoIncentFiscal.length > 0) {
            tipoIncentFiscal.map((item) => {
                console.log(item)
                if ((formData.value.dataInicioVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataInicioVigencia <= new Date(item.dataFinalVigencia))
                    || (formData.value.dataFinalVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia <= new Date(item.dataFinalVigencia)) 
                    || (formData.value.dataInicioVigencia <= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia >= new Date(item.dataFinalVigencia)))
                {
                    existe = true;
                }
            })
            if (existe) {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Não é possível incluir o Incentivo Fiscal, pois o mesmo já possui uma Configuração nesse Período.', life: 5000 });
                return
            }
        }

        if (!existe) {
            tipoIncentFicalsModelValue.value.push({ ...formData.value });
        }
    } else {
        tipoIncentFicalsModelValue.value[indexTipoIncentFiscalEdicao.value] = { ...formData.value };
    }
    emit('update:modelValue', tipoIncentFicalsModelValue.value);
    visibleDialog.value = false;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexTipoIncentFiscalEdicao.value = slot.index;
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
            const listaFiltrada = tipoIncentFicalsModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Incentivo Fiscal removido com sucesso', life: 5000 });
            emit('update:modelValue', listaFiltrada);
        },
        reject: () => {

        }
    });
};

const changeTipoIncentivoFiscal = async (object) => {
    if (!object) {
        formData.value.tipoIncentivoFiscalNome = undefined
        formData.value.tipoIncentivoFiscalCodigo = undefined
        return;
    }
    console.log(object)
    formData.value.tipoIncentivoFiscalNome = object.nome
    formData.value.tipoIncentivoFiscalCodigo = object.codigo
}

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Incentivo Fiscal" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarTipoIncentFiscal()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtTipoIncentFiscal" :value="tipoIncentFicalsModelValue" responsiveLayout="scroll">
            <template #empty> Nenhum Incentivo Fiscal informado. </template>

            <Column field="tipoIncentivoFiscalCodigo" header="Código" style="width: 12%"> </Column>
            <Column field="tipoIncentivoFiscalNome" header="Incentivo Fiscal" style="width: 35%"> </Column>
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

    <Dialog v-model:visible="visibleDialog" :style="{ width: '70%' }" header="Detalhes do Incentivo Fiscal" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarTipoIncentFiscal" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor 
                                id="seletorTipoIncentivoFiscal" 
                                label="Tipo de Incentivo Fiscal" 
                                v-model="formData.tipoIncentivoFiscalId" 
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione o Tipo de Incentivo Fiscal" 
                                :service="TipoIncentivoFiscalService" 
                                classContainer="col-12 md:col-12"
                                :erros="errors?.value?.tipoIncentivoFiscalId"
                                @changeObject="changeTipoIncentivoFiscal"
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
