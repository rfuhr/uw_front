<!-- eslint-disable vue/no-deprecated-filter -->
<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { IndiceMarkupService } from '@/service';
import moment from 'moment'

const confirm = useConfirm();
const toast = useToast();

const visibleDialog = ref(false);
const modeDialog = ref('')
const indexIndiceEdicao = ref(0);

const formData = ref({
    indiceMarkupId: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined,    
    percentual: undefined
});

const props = defineProps({
    modelValue: []
});

const createSchema = () => {
    return yup.object().shape({
        indiceMarkupId: yup.number().required('Índice de Mark Up é obrigatório.'),
        dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
        dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
        percentual: yup.number().test('custom-validation', 'Erro de validação personalizado', function (value) {
                    if (!formData.value.indiceMarkupTributo && !value) {
                        throw new yup.ValidationError(this.createError({ message: 'Percentual é obrigatório' }));
                    }
                    return true;
        }),
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

const indicesModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarIndice = () => {
    formData.value = {
        indiceMarkupId: undefined,
        dataInicioVigencia: undefined,
        dataFinalVigencia: undefined,    
        percentual: undefined,
        indiceMarkupTributo: false
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const confirmarIndice = async () => {
    if (modeDialog.value === 'add') {
        const indice = indicesModelValue.value.filter((item) => item.indiceMarkupId === formData.value.indiceMarkupId);
        let existe = false;
        if (indice.length > 0) {
            indicesModelValue.value.map((item) => {
                if ((formData.value.dataInicioVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataInicioVigencia <= new Date(item.dataFinalVigencia))
                    || (formData.value.dataFinalVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia <= new Date(item.dataFinalVigencia)) 
                    || (formData.value.dataInicioVigencia <= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia >= new Date(item.dataFinalVigencia)))
                {
                    existe = true;
                }
            })
            if (existe) {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Não é possível incluir o Índice, pois o mesmo já possui uma Configuração nesse Período.', life: 5000 });
                return
            }
        }

        if (!existe) {
            indicesModelValue.value.push({ ...formData.value });
        }
    } else {
        indicesModelValue.value[indexIndiceEdicao.value] = { ...formData.value };
    }
    emit('update:modelValue', indicesModelValue.value);
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
            const listaFiltrada = indicesModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Índice removido com sucesso', life: 5000 });
            emit('update:modelValue', listaFiltrada);
        },
        reject: () => {

        }
    });
};

const changeIndice = async (event) => {
    if (!event) {
        formData.value.indiceMarkupCodigo = ''
        formData.value.indiceMarkupNome = ''
        formData.value.indiceMarkupTributo = false
    } else {
        formData.value.indiceMarkupCodigo = event.codigo
        formData.value.indiceMarkupNome = event.nome
        formData.value.indiceMarkupTributo = event.tributo
    }
}

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Índice" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarIndice()" />
                </div>
            </template>
        </Toolbar>
        <DataTable 
            id="dtIndice" 
            ref="dtIndice" 
            :value="indicesModelValue" 
            responsiveLayout="scroll"
            >
            <template #empty> Nenhum índice informado. </template>

            <Column field="indiceMarkupCodigo" header="Código" style="width: 12%"> </Column>
            <Column field="indiceMarkupNome" header="Índice" style="width: 30%"> </Column>
            <Column field="percentual" header="Percentual" style="width: 10%"> </Column>
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

    <Dialog v-model:visible="visibleDialog" :style="{ width: '80%' }" header="Detalhes dos Índices" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarIndice" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor 
                                id="seletorIndiceMarkup" 
                                label="Índice de Mark Up" 
                                v-model="formData.indiceMarkupId" 
                                required
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione o Índice de Mark Up" 
                                :service="IndiceMarkupService" 
                                classContainer="col-12 md:col-12"
                                :erros="errors?.value?.indiceMarkupId"
                                @changeObject="changeIndice"
                            >
                        </UWSeletor>  
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-3" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-3" />
                        <UWDecimal id="percentual" label="Percentual" maximoDigitos="3" :disabled="formData.indiceMarkupTributo" :required="!formData.indiceMarkupTributo" v-model="formData.percentual" :errors="errors.value?.percentual" classContainer="col-12 md:col-4" />               
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>

</template>
