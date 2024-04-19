<script setup>
import { ref, computed } from 'vue';
import _ from 'lodash';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const toast = useToast();
const confirm = useConfirm();
const visibleDialog = ref(false);
const modeDialog = ref('');

const reboquesModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const reboqueSelecionado = ref();
const reboqueEmDigitacao = ref({
    placaVeiculo: undefined,
    siglaUF: undefined,
    rntc: undefined
});
const indexSelecionado = ref();

const adicionarReboque = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;
    reboqueEmDigitacao.value = { idLine: idLine };
    const idx = reboquesModelValue.value.length;
    reboquesModelValue.value.push(reboqueEmDigitacao.value);
    reboqueSelecionado.value = reboqueEmDigitacao.value;
    indexSelecionado.value = idx;
    visibleDialog.value = true;
    modeDialog.value = 'add';
};

const onRowSelect = (event) => {
    reboqueEmDigitacao.value = event.data;
    indexSelecionado.value = event.index;
};

const onRowUnselect = () => {
    reboqueEmDigitacao.value = {};
    indexSelecionado.value = null;
};

const handleDelete = (event, data) => {
    reboqueSelecionado.value = data;
    reboqueEmDigitacao.value = data;
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir este registro?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            reboquesModelValue.value = reboquesModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Reboque removido com sucesso', life: 5000 });
            reboqueSelecionado.value = null;
            reboqueEmDigitacao.value = {};
        },
        reject: () => {}
    });
};

const handleEdit = (values) => {
    reboqueEmDigitacao.value = values.data;
    reboqueSelecionado.value = values.data;
    indexSelecionado.value = values.index;
    modeDialog.value = 'edit';
    visibleDialog.value = true;
};

const handleVoltar = () => {
    if (modeDialog.value === 'add') {
        reboquesModelValue.value = reboquesModelValue.value.filter((item) => item !== reboqueEmDigitacao.value);
        reboqueSelecionado.value = null;
        reboqueEmDigitacao.value = {};
    }
    visibleDialog.value = false;
};

const handleConfirmar = () => {
    visibleDialog.value = false;
};

const temErro = (str) => {
    let caminhoEncontrado = false;
    _.forEach(props.errors.value, (value, key) => {
        // Verifica se o caminho base está contido no caminho atual
        if (_.startsWith(key, str)) {
            caminhoEncontrado = true;
            return false; // Sai do loop forEach assim que encontrar um caminho válido
        }
    });
    return caminhoEncontrado;
};
</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div>
        <div class="grid nested-grid">
            <div class="col-12">
                <Toolbar>
                    <template v-slot:start>
                        <div>
                            <Button label="Adicionar Reboque" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarReboque()" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable
                    id="tableREboques"
                    ref="dtReboques"
                    selectionMode="single"
                    dataKey="idLine"
                    v-model:selection="reboqueSelecionado"
                    :value="reboquesModelValue"
                    responsiveLayout="scroll"
                    size="small"
                    stripedRows
                    showGridlines
                    @rowSelect="onRowSelect"
                    @rowUnselect="onRowUnselect"
                >
                    <template #empty> Nenhum reboque informada. </template>
                    <Column style="width: 1%; text-align: left">
                        <template #body="slotProps">
                            <i v-if="temErro(`reboques[${slotProps.index}]`)" class="pi pi-exclamation-circle text-red-500 text-bold" style="font-size: 1.3rem" />
                            <i v-if="!temErro(`reboques[${slotProps.index}]`)" class="pi pi-exclamation-circle text-green-500 text-bold" style="font-size: 1.3rem" />
                        </template>
                    </Column>
                    <Column field="placaVeiculo" header="Placa do Veículo" style="width: 20%; text-align: left" headerClass="columnHeaderItem" />
                    <Column field="siglaUf" header="Sigla Uf" style="width: 20%; text-align: left" headerClass="columnHeaderItem" />
                    <Column field="rntc" header="Registro Nacional de Transportador de Carga (ANTT) " style="width: 20%; text-align: left" headerClass="columnHeaderItem" />
                    <Column header="" style="width: 5%">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-info p-button-sm mr-2" @click="handleEdit(slotProps)" />
                            <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visibleDialog" :style="{ width: '40%' }" header="Detalhes do Reboque" :modal="true" :closable="false">
        <Divider class="m-0" />
        <div class="col-12 pb-0 mb-0">
            <div class="grid nested-grid">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput
                            id="placa"
                            label="Placa do Veículo"
                            uppercase
                            required
                            v-model="reboqueEmDigitacao.placaVeiculo"
                            classContainer="col-12 md:col-4"
                            :errors="_.get(props.errors.value, `reboques[${indexSelecionado}].placaVeiculo`, null)"
                        />
                        <UWInput id="siglaUF" label="Sigla da UF" uppercase required v-model="reboqueEmDigitacao.siglaUf" classContainer="col-12 md:col-4" :errors="_.get(props.errors.value, `reboques[${indexSelecionado}].siglaUf`, null)" />
                        <UWInput id="siglaUF" label="RNTC" uppercase required v-model="reboqueEmDigitacao.rntc" classContainer="col-12 md:col-4" :errors="_.get(props.errors.value, `reboques[${indexSelecionado}].rntc`, null)" />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 mt-0 pt-0 pb-0">
            <Divider />
            <div class="flex justify-content-end flex-wrap gap-2">
                <Button label="Voltar" icon="pi pi-replay" class="p-button-help" outlined @click="handleVoltar()" />
                <Button type="submit" label="Confirmar" style="color: var(--teal-600)" outlined icon="pi pi-check" @click="handleConfirmar()" />
            </div>
        </div>
    </Dialog>
</template>
