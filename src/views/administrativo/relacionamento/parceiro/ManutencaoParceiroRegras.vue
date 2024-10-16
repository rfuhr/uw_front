<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import { RegraAtividadeService } from '@/service';
import { useFormatDate} from '@/composables/useFormatDate';

const props = defineProps({
    modelValue: []
});

const { formatToDDMMYYYY } = useFormatDate();

const confirm = useConfirm();
const toast = useToast();

const createSchema = () => {
    return yup.object().shape({
        regraAtividadeId: yup.string().required('Regra de atividade é obrigatória.'),
        dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.')
            .nullable()
            .max(yup.ref('dataFinalVigencia'), 'Data de início de vigência deve ser menor que a data final.'),
        dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.')
            .nullable()
            .min(yup.ref('dataInicioVigencia'), 'Data final de vigência deve ser maior que a data inicial.')
    });
};

const emit = defineEmits(['update:modelValue']);

const regrasModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const visibleDialog = ref(false);

const formData = ref({
    regraAtividadeId: undefined,
    regraAtividadeNome: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined   
});

const modeDialog = ref('')
const indexRegraEdicao = ref(0);
const regraSelecionada = ref();

const adicionarRegra = () => {
    formData.value = {
        regraAtividadeId: undefined
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const confirmarRegra = async () => {
    if (modeDialog.value === 'add') {
        formData.value.regraAtividadeNome = regraSelecionada.value.nome;
        regrasModelValue.value.push({ ...formData.value });
    } else {
        regrasModelValue.value[indexRegraEdicao.value] = { ...formData.value };
    }
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexRegraEdicao.value = slot.index;
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
            regrasModelValue.value = regrasModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Regra removida com sucesso', life: 5000 });
        },
        reject: () => {

        }
    });
};

const onChangeRegra = (registro) => {
    regraSelecionada.value = registro
}

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Regra" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarRegra()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtRegras" :value="regrasModelValue" responsiveLayout="scroll">
            <template #empty> Nenhuma regra informado. </template>

            <Column field="regraAtividadeNome" header="Regra" style="width: 55%"></Column>
            <Column header="Ínicio de Vigência" style="width: 15%">
                <template #body="slotProps">
                    <span>{{ formatToDDMMYYYY(slotProps.data.dataInicioVigencia) }} </span>
                </template>
            </Column>   
            <Column header="Fim da Vigência" style="width: 15%">
                <template #body="slotProps">
                    <span>{{ formatToDDMMYYYY(slotProps.data.dataFinalVigencia) }} </span>
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

    <Dialog v-model:visible="visibleDialog" :style="{ width: '50%' }" header="Detalhes da Regra" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarRegra" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor
                            classContainer="col-12 md:col-12"
                            v-model="formData.regraAtividadeId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            label="Regra de Atividade"
                            :service="RegraAtividadeService"
                            placeholder="Selecione a regra"
                            @changeObject="onChangeRegra"
                            :erros="errors.value?.regraAtividadeId"
                        />        
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-6" />                        

                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
