<!-- eslint-disable vue/no-deprecated-filter -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { TiposService, UfService } from '@/service';
import moment from 'moment'

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

const formataData = (data) => {
    if (data) {
        moment.locale('pt-br')
        return moment(data).format('DD/MM/YYYY')
    }
    return ''
}

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
        const parceiro = parceirosModelValue.value.filter((item) => item.parceiroLocalId === formData.value.parceiroLocalId);
        let existe = false;
        if (parceiro.length > 0) {
            parceirosModelValue.value.map((item) => {
                if ((formData.value.dataInicioVigencia >= item.dataInicioVigencia && formData.value.dataInicioVigencia <= item.dataFinalVigencia)
                    || (formData.value.dataFinalVigencia >= item.dataInicioVigencia && formData.value.dataFinalVigencia <= item.dataFinalVigencia) 
                    || (formData.value.dataInicioVigencia <= item.dataInicioVigencia && formData.value.dataFinalVigencia >= item.dataFinalVigencia))
                {
                    existe = true;
                }
            })
            if (existe) {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Não é possível incluir o Parceiro, pois o mesmo já possui uma Configuração nesse Período.', life: 5000 });
                return
            }
        }

        if (!existe) {
            parceirosModelValue.value.push({ ...formData.value });
        }
    } else {
        parceirosModelValue.value[indexParceiroEdicao.value] = { ...formData.value };
    }
    emit('update:modelValue', parceirosModelValue.value);
    visibleDialog.value = false;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    console.log(slot.data)
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
            const listaFiltrada = parceirosModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parceiro removido com sucesso', life: 5000 });
            emit('update:modelValue', listaFiltrada);
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
        <DataTable 
            id="dtParceiros" 
            ref="dtParceiros" 
            :value="parceirosModelValue" 
            responsiveLayout="scroll"
            >
            <template #empty> Nenhum parceiro informado. </template>

            <Column field="parceiroCnpjCpf" header="CNPJ/CPF" style="width: 12%"> </Column>
            <Column field="parceiroNomeRazaoSocial" header="Parceiro" style="width: 30%"> </Column>
            <Column field="tipoTributo" header="Tributo" style="width: 8%"> </Column>
            <Column field="ufSigla" header="UF" style="width: 8%"> </Column>
            <Column field="percentualAproveitamento" header="% Aprov." style="width: 10%"> </Column>
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

    <Dialog v-model:visible="visibleDialog" :style="{ width: '80%' }" header="Detalhes do Incentivo Fiscal do Parceiro" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarParceiro" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWParceiroLocal id="seletorParceiro" classContainer="col-12 md:col-6" v-model="formData.parceiroLocalId" required label="Parceiro" @changeObject="changeParceiroLocal" :erros="errors.value?.parceiroLocalId" />
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
