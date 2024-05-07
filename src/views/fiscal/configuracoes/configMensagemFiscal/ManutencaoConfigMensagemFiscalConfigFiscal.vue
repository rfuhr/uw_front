<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { ConfiguracaoFiscalService } from '@/service';
import moment from 'moment'

const confirm = useConfirm();
const toast = useToast();

const visibleDialog = ref(false);
const modeDialog = ref('')
const indexConfigFiscalEdicao = ref(0);

const formData = ref({
    configuracaoFiscalId: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined
});

const props = defineProps({
    modelValue: []
});

const createSchema = () => {
    return yup.object().shape({
        configuracaoFiscalId: yup.number().required('Configuração Fiscal é obrigatória.'),
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

const configFiscaisModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarConfigFiscal = () => {
    formData.value = {
        configuracaoFiscalId: undefined,
        dataInicioVigencia: undefined,
        dataFinalVigencia: undefined
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const confirmarConfigFiscal = async () => {
    if (modeDialog.value === 'add') {
        const configFiscal = configFiscaisModelValue.value.filter((item) => item.configuracaoFiscalId === formData.value.configuracaoFiscalId);
        let existe = false;
        if (configFiscal.length > 0) {
            configFiscal.map((item) => {
                console.log(item)
                if ((formData.value.dataInicioVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataInicioVigencia <= new Date(item.dataFinalVigencia))
                    || (formData.value.dataFinalVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia <= new Date(item.dataFinalVigencia)) 
                    || (formData.value.dataInicioVigencia <= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia >= new Date(item.dataFinalVigencia)))
                {
                    existe = true;
                }
            })
            if (existe) {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Não é possível incluir a Configuração Fiscal, pois a mesma já possui uma Configuração nesse Período.', life: 5000 });
                return
            }
        }

        if (!existe) {
            configFiscaisModelValue.value.push({ ...formData.value });
        }
    } else {
        configFiscaisModelValue.value[indexConfigFiscalEdicao.value] = { ...formData.value };
    }
    emit('update:modelValue', configFiscaisModelValue.value);
    visibleDialog.value = false;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexConfigFiscalEdicao.value = slot.index;
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
            const listaFiltrada = configFiscaisModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração Fiscal removida com sucesso', life: 5000 });
            emit('update:modelValue', listaFiltrada);
        },
        reject: () => {

        }
    });
};

const changeConfigFiscal = async (object) => {
    if (!object) {
        formData.value.regimeTributarioNome = ''
        formData.value.ufOrigemSigla = ''
        formData.value.ufDestinoSigla = ''
        formData.value.indicadorOperacao = ''
        formData.value.icms = undefined
        formData.value.ipi = undefined
        formData.value.pis = undefined
        formData.value.cofins = undefined
        return;
    }
    console.log(object)
    formData.value.regimeTributarioNome = object.regimeTributarioNome
    formData.value.ufOrigemSigla = object.ufOrigemSigla
    formData.value.ufDestinoSigla = object.ufDestinoSigla
    formData.value.indicadorOperacao = object.indicadorOperacao
    formData.value.icms = object.icms
    formData.value.ipi = object.ipi
    formData.value.pis = object.pis
    formData.value.cofins = object.cofins
}

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Configuração Fiscal" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarConfigFiscal()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtConfigFiscais" :value="configFiscaisModelValue" responsiveLayout="scroll">
            <template #empty> Nenhuma Configuração Fiscal informada. </template>

            <Column field="configuracaoFiscalId" header="Identificador" style="width: 10%"> </Column>
            <Column field="regimeTributarioNome" header="Regime Fiscal" style="width: 15%"> </Column>
            <Column field="ufOrigemSigla" header="UF Orig" style="width: 8%"> </Column>
            <Column field="ufDestinoSigla" header="UF Dest" style="width: 8%"> </Column>
            <Column field="indicadorOperacao" header="Ent/Sai" style="width: 8%"> </Column>
            <Column header="ICMS" style="width: 5%"> 
                <template #body="slotProps">
                    <TriStateCheckbox disabled v-model="slotProps.data.icms" />
                </template>
            </Column>
            <Column header="IPI" style="width: 5%"> 
                <template #body="slotProps">
                    <TriStateCheckbox disabled v-model="slotProps.data.ipi" />
                </template>
            </Column>
            <Column header="PIS" style="width: 5%"> 
                <template #body="slotProps">
                    <TriStateCheckbox disabled v-model="slotProps.data.pis" />
                </template>
            </Column>
            <Column header="COFINS" style="width: 5%"> 
                <template #body="slotProps">
                    <TriStateCheckbox disabled v-model="slotProps.data.cofins" />
                </template>
            </Column>
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

    <Dialog v-model:visible="visibleDialog" :style="{ width: '70%' }" header="Detalhes da Configuração Fiscal" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarConfigFiscal" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor 
                                id="seletorConfiguracaoFiscal" 
                                label="Configuração Fiscal" 
                                v-model="formData.configuracaoFiscalId" 
                                optionLabel="regimeTributarioNome" 
                                optionValue="id" 
                                placeholder="Selecione a Configuração Fiscal" 
                                :service="ConfiguracaoFiscalService" 
                                classContainer="col-12 md:col-12"
                                :erros="errors?.value?.configuracaoFiscalId"
                                @changeObject="changeConfigFiscal"
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
