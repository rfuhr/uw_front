<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import * as yup from 'yup';
import _ from 'lodash';
import { ConfigEmpresaService as Service, EmpresaService, EmpresaFilialService, TiposService, NFeService, RegimeTributarioService } from '@/service';

const configuracoesNFeSchema = yup.object().shape({
    empresaFilialId: yup.string().required('Filial é obrigatória ser informada.'),
    tipoCertificado: yup.string().required('Tipo de certificado é obrigatório ser informado.'),
    tipoAmbiente: yup.string().required('Tipo de ambiente é obrigatório ser informado.'),
    tipoEmissao: yup.string().required('Tipo de emissão é obrigatório ser informado.'),
    serie: yup.number().required('Série é obrigatória ser informada.')
});

const createSchema = () => {
    return yup.object().shape({
        empresaId: yup.string().required('Empresa é obrigatório.'),
        regimeTributarioId: yup.number().required('Regime tributário é obrigatório.'),
        configuracoesNFe: yup.array().of(configuracoesNFeSchema)
    });
};

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
const confirm = useConfirm();

const formData = reactive({
    configuracoesNFe: []
});
const tiposCertificados = ref([]);
const tiposAmbientes = ref([]);
const tiposEmissao = ref([]);

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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração de empresa criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a configuração de empresa.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração de empresa alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a configuração de empresa.', life: 5000 });
        });
};

const salvarRegistro = async () => {
    if (props.mode === 'create') {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const showModal = async () => {
    if (props.mode === 'create') {
        formData.nome = undefined;
        formData.contribuinteIpi = false;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

const adicionarRegraNFe = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;

    formData.configuracoesNFe.push({
        id: idLine,
        filialId: undefined,
        tipoCertificado: undefined,
        tipoAmbiente: undefined,
        tipoEmissao: undefined,
        serie: undefined
    });
};

onMounted(async () => {
    TiposService.getTipoCertificado().then((data) => {
        tiposCertificados.value = data;
    });
    TiposService.getTipoAmbiente().then((data) => {
        tiposAmbientes.value = data;
    });
    TiposService.getTipoEmissao().then((data) => {
        tiposEmissao.value = data;
    });
});

const removerRegraNFe = (idRemover) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir este registro?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            _.remove(formData.configuracoesNFe, (n) => {
                return n.id === idRemover;
            });

            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração de NFe removida com sucesso', life: 5000 });
        },
        reject: () => {}
    });
};

const handleGerarNFe = async (data) => {
    await NFeService.gerarNfeTeste(data.empresaFilialId).then((response) => {
        const disposition = response.headers['content-disposition'];
        const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = fileNameRegex.exec(disposition);
        const filename = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : 'nfe.pdf';

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
    });
};
</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '90%' }" :header="mode === 'create' ? 'Nova Configuração de Empresa' : 'Alterar Configuração de Empresa'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="createSchema()" :values="formData" ref="formConfigEmpresa" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Configurações Gerais" class="col-12">
                            <div class="formgrid grid">
                            <UWSeletor classContainer="col-12 md:col-6" v-model="formData.empresaId" optionLabel="nome" optionValue="id" label="Empresa" :service="EmpresaService" placeholder="Selecione a empresa" :erros="errors.value?.empresaId" />
                            <UWSeletor classContainer="col-12 md:col-6" v-model="formData.regimeTributarioId" optionLabel="nome" optionValue="id" label="Regime Tributário" :service="RegimeTributarioService" placeholder="Selecione o regime tributário" :erros="errors.value?.regimeTributarioId" />
                            <div class="field md:col-4 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.contribuinteIpi"
                                        onLabel="Contribuinte IPI"
                                        offLabel="NÃO Contribuinte IPI"
                                        onIcon="pi pi-lock"
                                        offIcon="pi pi-lock-open"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.contribuinteIpi, 'bg-red-100 border-white': !formData.contribuinteIpi }]
                                            }
                                        }"
                                    />
                                </span>
                        </div>
                        </div>
                        </UWFieldSet>
                    </div>
                    <TabView class="col-12">
                        <TabPanel header="Nota Fiscal Eletrônica" class="col-12">
                            <Toolbar class="mb-2">
                                <template v-slot:end>
                                    <div>
                                        <Button label="Adicionar Regra" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarRegraNFe()" />
                                    </div>
                                </template>
                            </Toolbar>
                            <DataTable ref="dtConfiguracoesNFe" :value="formData.configuracoesNFe" responsiveLayout="scroll">
                                <Column field="filialId" header="Filial" style="width: 30%">
                                    <template #body="slotProps">
                                        <UWSeletor
                                            classContainer="w-full"
                                            v-model="slotProps.data.empresaFilialId"
                                            optionLabel="nome"
                                            optionValue="id"
                                            :service="EmpresaFilialService"
                                            placeholder="Selecione a filial"
                                            :columnsFilters="[{ field: 'empresa', value: formData.empresaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresa.id' }]"
                                            :erros="_.get(errors.value, `configuracoesNFe[${slotProps.index}].empresaFilialId`, null)"
                                        />
                                    </template>
                                </Column>
                                <Column field="tipoCertificado" header="Tipo de Certificado" style="width: 20%">
                                    <template #body="slotProps">
                                        <UWPickList
                                            id="tipoCertificado"
                                            v-model="slotProps.data.tipoCertificado"
                                            optionLabel="name"
                                            optionValue="value"
                                            :options="tiposCertificados"
                                            classContainer="w-full"
                                            :errors="_.get(errors.value, `configuracoesNFe[${slotProps.index}].tipoCertificado`, null)"
                                        />
                                    </template>
                                </Column>
                                <Column field="tipoAmbiente" header="Ambiente" style="width: 20%">
                                    <template #body="slotProps">
                                        <UWPickList
                                            id="tipoAmbiente"
                                            v-model="slotProps.data.tipoAmbiente"
                                            optionLabel="name"
                                            optionValue="value"
                                            :options="tiposAmbientes"
                                            classContainer="w-full"
                                            :errors="_.get(errors.value, `configuracoesNFe[${slotProps.index}].tipoAmbiente`, null)"
                                        />
                                    </template>
                                </Column>
                                <Column field="tipoEmissao" header="Tipo de Emissão" style="width: 20%">
                                    <template #body="slotProps">
                                        <UWPickList
                                            id="tipoEmissao"
                                            v-model="slotProps.data.tipoEmissao"
                                            optionLabel="name"
                                            optionValue="value"
                                            :options="tiposEmissao"
                                            classContainer="w-full"
                                            :errors="_.get(errors.value, `configuracoesNFe[${slotProps.index}].tipoEmissao`, null)"
                                        />
                                    </template>
                                </Column>
                                <Column field="serie" header="Série NFe" style="width: 20%">
                                    <template #body="slotProps">
                                        <UWInteger classContainer="w-full" v-model="slotProps.data.serie" :erros="_.get(errors.value, `configuracoesNFe[${slotProps.index}].serie`, null)" />
                                    </template>
                                </Column>
                                <Column header="" style="width: 10%">
                                    <template #body="slotProps">
                                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="removerRegraNFe(slotProps.data.id)" />
                                        <Button icon="pi pi-file-pdf" class="p-button-text p-button-help p-button-sm" @click="handleGerarNFe(slotProps.data)" />
                                    </template>
                                </Column>
                            </DataTable>
                        </TabPanel>
                    </TabView>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
