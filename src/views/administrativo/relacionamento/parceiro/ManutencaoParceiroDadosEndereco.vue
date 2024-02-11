<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import { PaisService, UfService, CidadeService } from '@/service';
import { validateCep } from 'validations-br';

const props = defineProps({
    modelValue: []
});

const confirm = useConfirm();
const toast = useToast();

const createSchema = () => {
    return yup.object().shape({
        tipoEndereco: yup.string().required('Tipo de Endereço é obrigatório.').oneOf(['COM', 'ENT', 'FIS', 'RES'], 'Tipo de Endereço deve ser uma opção válida'),
        identificacao: yup.string().required('Identificação do endereço é obrigatória.'),
        cep: yup
            .string()
            .required('CEP é obrigatório.')
            .test('is-cep', 'Cep inválido.', (value) => {
                return value === '' || validateCep(value);
            }),
        endereco: yup.string().required('Logradouro do endereço é obrigatório.'),
        numero: yup.string().required('Número do endereço é obrigatório.'),
        bairro: yup.string().required('Bairro do endereço é obrigatório.'),
        paisId: yup.number().required('País é obrigatório.'),
        ufId: yup.number().required('UF é obrigatório.'),
        cidadeId: yup.number().required('Cidade é obrigatória.')
    });
};

const emit = defineEmits(['update:modelValue']);

const enderecosModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const visibleDialog = ref(false);

const tiposEndereco = ref([
    { name: 'Comercial', value: 'COM' },
    { name: 'Entrega', value: 'ENT' },
    { name: 'Fiscal', value: 'FIS' },
    { name: 'Residencial', value: 'RES' }
]);

const formData = ref({
    tipoEndereco: undefined
});

const modeDialog = ref('')
const indexEnderecoEdicao = ref(0);

const getConstantTipoEndereco = (value) => {
    return tiposEndereco.value.find((item) => item.value === value).name;
};

const adicionarEndereco = () => {
    formData.value = {
        tipoEndereco: 'COM',
        tipoEnderecoNome: 'Comercial',
        paisId: 1,
        paisNome: 'Brasil',
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const getEnderecoCompleto = (objetoEndereco) => {
    return `${objetoEndereco.endereco}, ${objetoEndereco.numero}, ${objetoEndereco.bairro}, ${objetoEndereco.cidadeNome} - ${objetoEndereco.ufSigla}, ${objetoEndereco.paisNome}, CEP: ${objetoEndereco.cep.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3')}`;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const confirmarEndereco = async () => {
    if (modeDialog.value === 'add') {
        enderecosModelValue.value.push({ ...formData.value });
    } else {
        enderecosModelValue.value[indexEnderecoEdicao.value] = { ...formData.value };
    }
    visibleDialog.value = false;
};

const changePais = (event) => {
    formData.value.paisNome = event.nome;
}

const changeUf = (event) => {
    formData.value.ufSigla = event.sigla;
}

const changeCidade = (event) => {
    formData.value.cidadeNome = event.nome;
}

const handleEdit = (slot) => {
    indexEnderecoEdicao.value = slot.index;
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
            enderecosModelValue.value = enderecosModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Endereço removido com sucesso', life: 5000 });
        },
        reject: () => {

        }
    });
};

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Endereço" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarEndereco()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtEnderecos" :value="enderecosModelValue" responsiveLayout="scroll">
            <template #empty> Nenhum endereço informado. </template>

            <Column header="Tipo de Endereço" style="width: 10%"> 
                <template #body="slotProps">
                    <span>{{ getConstantTipoEndereco(slotProps.data.tipoEndereco) }} </span>
                </template>            
            </Column>
            <Column field="identificacao" header="Identificação" style="width: 15%"> </Column>
            <Column header="Endereço Completo" style="width: 55%">
                <template #body="slotProps">
                    <span>{{ getEnderecoCompleto(slotProps.data) }} </span>
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

    <Dialog v-model:visible="visibleDialog" :style="{ width: '50%' }" header="Detalhes do Endereço" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarEndereco" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWPickList id="tipoEndereco" label="Tipo do Endereço" v-model="formData.tipoEndereco" optionLabel="name" optionValue="value" required :options="tiposEndereco" classContainer="col-12 md:col-4" />
                        <UWInput id="identificacao" label="Identificação" uppercase required autofocus v-model="formData.identificacao" :errors="errors.value?.identificacao" classContainer="col-12 md:col-8" />
                        <UWInputMask id="cep" label="Cep" :mask="'99.999-999'" required :unmask="true" v-model="formData.cep" :errors="errors.value?.cep" classContainer="col-12 md:col-3" />
                        <UWInput id="endereco" label="Logradouro" uppercase required autofocus v-model="formData.endereco" :errors="errors.value?.endereco" classContainer="col-12 md:col-9" />
                        <UWInput id="numero" label="Número" uppercase required autofocus v-model="formData.numero" :errors="errors.value?.numero" classContainer="col-12 md:col-3" />
                        <UWInput id="complemento" label="Complemento" uppercase required autofocus v-model="formData.complemento" classContainer="col-12 md:col-3" />
                        <UWInput id="bairro" label="Bairro" uppercase required autofocus v-model="formData.bairro" :errors="errors.value?.bairro" classContainer="col-12 md:col-6" />
                        <UWSeletor classContainer="col-12 md:col-6" v-model="formData.paisId" optionLabel="nome" optionValue="id" required label="País" :service="PaisService" placeholder="Selecione o pais" :erros="errors?.value?.paisId" @changeObject="changePais" />
                        <UWSeletor classContainer="col-12 md:col-6" v-model="formData.ufId" optionLabel="nome" optionValue="id" required label="UF" :service="UfService" placeholder="Selecione a uf" :erros="errors?.value?.ufId" @changeObject="changeUf"/>
                        <UWSeletor
                            classContainer="col-12 md:col-12"
                            v-model="formData.cidadeId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            label="Cidade"
                            :service="CidadeService"
                            placeholder="Selecione a cidade"
                            :erros="errors?.value?.cidadeId"
                            :columnsFilters="[{ field: 'uf', value: formData.ufId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'uf.id' }]"
                            @changeObject="changeCidade"
                        />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
