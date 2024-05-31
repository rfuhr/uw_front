<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { TabelaPrecoService as Service, TipoPrecoService, EmpresaFilialService, GrupoContabilService } from '@/service';
import { parseISO } from 'date-fns';
import  ManutencaoTabelaPrecoItem from './ManutencaoTabelaPrecoItem.vue';
import  ManutencaoTabelaPrecoEmpresaFilial from './ManutencaoTabelaPrecoEmpresaFilial.vue';

const schema = yup.object().shape({
    dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
    dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
    tipoPrecoId: yup.number().required('Tipo de Preço é obrigatório.'),
    codigo: yup.number().required('Código é obrigatório.'),
    nome: yup.string().required('Nome é obrigatório.'),
    empresaFilialId: yup.number().required('Filial da Empresa é obrigatória.'),
});

const props = defineProps({
    showDialog: {
        type: Boolean,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['closeDialog']);

const toast = useToast();

const formData = reactive({
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined,
    tipoPrecoId: undefined,
    empresaFilialId: undefined,
    grupoContabilId: undefined,
    codigo: undefined,
    nome: undefined,
    id: undefined,
    promocional: false,
    tabelaPrecoItens: [],
    tabelaPrecoEmpresaFiliais: []
});

const showDialogComputed = computed({
    get: () => props.showDialog,
    set: (value) => {
        emit('update:showDialog', value);
    }
});

const hideDialog = () => {
    emit('closeDialog');
};

const criarRegistro = () => {
    Service.create(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Tabela de Preços criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a Tabela de Preços.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Tabela de Preços alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a Tabela de Preços.', life: 5000 });
        });
};

const salvarRegistro = async () => {
    if (formData.tabelaPrecoItens.length === 0) {
        toast.add({ severity: 'error', summary: 'Falha', detail: 'Não é possível incluir/alterar a Tabela de Preços, pois não foi informado nenhum Item.', life: 5000 });
    } else if (props.mode === 'create') {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const showModal = async () => {
    if (props.mode === 'create') {
        formData.tipoPrecoId = undefined;
        formData.empresaFilialId = undefined;
        formData.grupoContabilId = undefined;
        formData.dataInicioVigencia = undefined;
        formData.dataFinalVigencia = undefined;
        formData.codigo = undefined;
        formData.nome = undefined;
        formData.id = undefined;
        formData.promocional = false;
        formData.tabelaPrecoItens = [];
        formData.tabelaPrecoEmpresaFiliais = [];
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
            formData.dataInicioVigencia = parseISO(data.dataInicioVigencia)
            formData.dataFinalVigencia = parseISO(data.dataFinalVigencia)
        });
    }
};

const changeTipoPreco = async (event) => {
    if (!event) {
        formData.promocional = false
    } else {
        formData.promocional = event.promocional
    }
}

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '90%' }" :header="mode === 'create' ? 'Nova Tabela de Preços' : 'Alterar Tabela de Preços'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formTabelaPreco" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="codigo" label="Código" required autofocus v-model="formData.codigo" :errors="errors.value?.codigo" classContainer="col-12 md:col-2" />
                        <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-5" />  
                        <UWSeletor 
                                id="seletorEmpresaFilial" 
                                label="Filial" 
                                v-model="formData.empresaFilialId" 
                                required
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione a Filial da Empresa" 
                                :service="EmpresaFilialService" 
                                classContainer="col-12 md:col-5"
                                :erros="errors?.value?.empresaFilialId"
                            >
                        </UWSeletor>   
                        <UWSeletor 
                                id="seletorTipoPreco" 
                                label="Tipo de Preço" 
                                v-model="formData.tipoPrecoId" 
                                required
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione o Tipo de Preço" 
                                :service="TipoPrecoService" 
                                classContainer="col-12 md:col-6"
                                :erros="errors?.value?.tipoPrecoId"
                                @changeObject="changeTipoPreco"
                            >
                        </UWSeletor>   
                        <UWSeletor 
                                id="seletorGrupoContabil" 
                                label="Grupo Contábil" 
                                v-model="formData.grupoContabilId" 
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione o Grupo Contábil" 
                                :service="GrupoContabilService" 
                                classContainer="col-12 md:col-6"
                            >
                        </UWSeletor>   
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-4" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-4" />
                        <div class="field md:col-4 pt-0">
                            <span class="p-float-label">
                                <ToggleButton
                                    disabled
                                    v-model="formData.promocional"
                                    onLabel="Promocional"
                                    offLabel="NÃO é Promocional"
                                    onIcon="pi pi-lock"
                                    offIcon="pi pi-lock-open"
                                    class="w-full"
                                    aria-label="Do you confirm"
                                    :pt="{
                                        root: {
                                            class: [{ 'h-full': true, 'bg-green-100 border-white': formData.promocional, 'bg-red-100 border-white': !formData.promocional }]
                                        }
                                    }"
                                />
                            </span>
                        </div>   
                    </div>
                    <TabView class="col-12">
                        <TabPanel header="Preços dos Itens" class="col-12">
                            <ManutencaoTabelaPrecoItem v-model="formData.tabelaPrecoItens" />
                        </TabPanel>
                        <TabPanel header="Filiais" class="col-12">
                            <ManutencaoTabelaPrecoEmpresaFilial v-model="formData.tabelaPrecoEmpresaFiliais" />
                        </TabPanel>
                    </TabView>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
