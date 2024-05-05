<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { SituacaoTributariaService } from '@/service';
import { useFormatString } from '@/composables/useFormatString';

const { truncate } = useFormatString();

const confirm = useConfirm();
const toast = useToast();

const visibleDialog = ref(false);
const modeDialog = ref('')
const indexSituacTribEdicao = ref(0);

const formData = ref({
    situacaoTributariaId: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined
});

const props = defineProps({
    modelValue: {}
});

const createSchema = () => {
    return yup.object().shape({
        situacaoTributariaId: yup.number().required('Situação Tributária é obrigatória.'),
        dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
        dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
    });
};

const emit = defineEmits(['update:modelValue']);

const situacTribsModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarSituacTrib = () => {
    formData.value = {
        situacaoTributariaId: undefined,
        dataInicioVigencia: undefined,
        dataFinalVigencia: undefined
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const confirmarSituacTrib = async () => {
    if (modeDialog.value === 'add') {
        situacTribsModelValue.value.push({ ...formData.value });
    } else {
        situacTribsModelValue.value[indexSituacTribEdicao.value] = { ...formData.value };
    }
    console.log(situacTribsModelValue.value)
    visibleDialog.value = false;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexSituacTribEdicao.value = slot.index;
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
            situacTribsModelValue.value = situacTribsModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Situação Tributária removida com sucesso', life: 5000 });
        },
        reject: () => {

        }
    });
};

const changeSituacaoTributaria = async (object) => {
    if (!object) {
        formData.value.situacaoTributariaNome = undefined
        formData.value.situacaoTributariaCodigo = undefined
        formData.value.situacaoTributariaTipoTributo = undefined
        return;
    }
    console.log(object)
    formData.value.situacaoTributariaNome = object.nome
    formData.value.situacaoTributariaCodigo = object.codigo
    formData.value.situacaoTributariaTipoTributo = object.tipoTributo
}

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Situação Tributária" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarSituacTrib()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtConfigFiscais" :value="situacTribsModelValue" responsiveLayout="scroll">
            <template #empty> Nenhuma Situação Tributária informada. </template>

            <Column field="situacaoTributariaId" header="Identificador" style="width: 12%"> </Column>
            <Column field="situacaoTributariaNome" header="Situação Tributária" style="width: 35%"> </Column>
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

    <Dialog v-model:visible="visibleDialog" :style="{ width: '70%' }" header="Detalhes da Situação Tributária" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarSituacTrib" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor 
                                id="seletorSituacaoTributaria" 
                                label="Situação Tributária" 
                                v-model="formData.situacaoTributariaId" 
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione a Situação Tributária" 
                                :service="SituacaoTributariaService" 
                                classContainer="col-12 md:col-12"
                                @changeObject="changeSituacaoTributaria"
                                :filtersSearch="[{ field: 'codigo', matchMode: 'equals', tipoField: 'integer', fieldFilter: 'codigo', labelFilter: 'Código'},
                                                { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome'},
                                            ]"
                                fieldSearchDefault="nome"
                                >
                                <template #values> {{ formData.situacaoTributariaTipoTributo }} - {{ formData.situacaoTributariaCodigo }} - {{ formData.situacaoTributariaNome }} </template>
                                <template #options="slotProps">
                                    <div class="flex flex-column">
                                        {{ truncate(slotProps.option.nome, 100 )}} 
                                        <div class="text-700 text-sm"><span>Tipo Tributo:</span> {{ slotProps.option.tipoTributo }} </div>
                                        <div class="text-700 text-sm"><span>Código:</span> {{ slotProps.option.codigo }} </div>
                                    </div>
                                </template>
                        </UWSeletor>
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-3" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-3" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>

</template>
