<!-- eslint-disable vue/no-deprecated-filter -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { TiposService, UfService } from '@/service';

const confirm = useConfirm();
const toast = useToast();

const visibleDialog = ref(false);
const modeDialog = ref('')
const indexParceiroEdicao = ref(0);
const tiposTributos = ref();

const formData = ref({
    parceiroLocalId: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined,    
    tipoTributo: undefined,
    ufId: undefined,
    percentualAproveitamento: undefined
});

const props = defineProps({
    modelValue: []
});

const createSchema = () => {
    return yup.object().shape({
        parceiroLocalId: yup.number().required('Parceiro é obrigatório.'),
        dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
        dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
    });
};

const emit = defineEmits(['update:modelValue']);

const parceirosModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarParceiro = () => {
    formData.value = {
        parceiroLocalId: undefined,
        dataInicioVigencia: undefined,
        dataFinalVigencia: undefined,    
        tipoTributo: undefined,
        ufId: undefined,
        percentualAproveitamento: undefined
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const confirmarParceiro = async () => {
    if (modeDialog.value === 'add') {
        parceirosModelValue.value.push({ ...formData.value });
    } else {
        parceirosModelValue.value[indexParceiroEdicao.value] = { ...formData.value };
    }
    console.log(parceirosModelValue.value)
    visibleDialog.value = false;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexParceiroEdicao.value = slot.index;
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
            parceirosModelValue.value = parceirosModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parceiro removido com sucesso', life: 5000 });
        },
        reject: () => {

        }
    });
};

const changeParceiroLocal = async (object) => {
    if (!object) {
        formData.value.parceiroNomeRazaoSocial = ''
        formData.value.parceiroCnpjCpf = ''
        return;
    }
    console.log(object)
    formData.value.parceiroNomeRazaoSocial = object.nomeRazaoSocial
    formData.value.parceiroCnpjCpf = object.cpfCnpj
}

onMounted(async () => {
    await TiposService.getTipoTributo().then((data) => {
        tiposTributos.value = data;
    });
});

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Parceiro" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarParceiro()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtParceiros" :value="parceirosModelValue" responsiveLayout="scroll">
            <template #empty> Nenhum parceiro informado. </template>

            <Column field="parceiroCnpjCpf" header="CNPJ/CPF" style="width: 12%"> </Column>
            <Column field="parceiroNomeRazaoSocial" header="Parceiro" style="width: 35%"> </Column>
            <Column field="tipoTributo" header="Tributo" style="width: 8%"> </Column>
            <Column field="ufSigla" header="UF" style="width: 8%"> </Column>
            <Column field="percentualAproveitamento" header="% Aprov." style="width: 10%"> </Column>
            <Column header="Início Vigência" style="width: 15%">
                <template #body="slotProps">
                    <Calendar v-model="slotProps.row.dataInicioVigencia" dateFormat="dd/mm/yy" />
                </template>
            </Column>
            <Column header="Final Vigência" style="width: 15%">
                <template #body="slotProps">
                    <Calendar v-model="slotProps.row.dataFinalVigencia" dateFormat="dd/mm/yy" />
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

    <Dialog v-model:visible="visibleDialog" :style="{ width: '70%' }" header="Detalhes do Incentivo Fiscal do Parceiro" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarParceiro" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWParceiroLocal id="parceiroLocal" classContainer="col-12 md:col-6" v-model="formData.parceiroLocalId" required label="Parceiro" @changeObject="changeParceiroLocal" :erros="errors.value?.parceiroLocalId" />
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-3" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-3" />
                        <UWPickList id="tipoTributo" label="Tipo Tributo" v-model="formData.tipoTributo" optionLabel="name" optionValue="value" :options="tiposTributos" classContainer="col-12 md:col-4" />
                        <UWSeletor 
                                id="seletorUf" 
                                label="UF" 
                                v-model="formData.ufId" 
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione a UF" 
                                :service="UfService" 
                                classContainer="col-12 md:col-4"
                                :erros="errors?.value?.ufId"
                            >
                        </UWSeletor>  
                        <UWDecimal id="percentualAproveitamento" label="% de Aproveitamento" maximoDigitos="3" v-model="formData.percentualAproveitamento" classContainer="col-12 md:col-4" />               
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>

</template>
