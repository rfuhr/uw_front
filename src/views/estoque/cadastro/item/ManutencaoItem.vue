<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import Swal from 'sweetalert2';
import { ItemService, UnidadeMedidaService, MarcaService, LinhaService, PlanoClassificacaoItemService, OrigemService, NcmService } from '@/service';
import { useFormatString } from '@/composables/useFormatString';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const { truncate } = useFormatString();

const idItem = ref();

const createSchema = () => {
    return yup.object().shape({
        codigo: yup.number().required('Código é obrigatório.').min(1, 'Código deve ser maior que 0'),
        nome: yup.string().required('Nome do usuário é obrigatório.'),
        descritivo: yup.string().required('Descritivo é obrigatório.'),
        unidadeMedidaComercialId: yup.number().required('Unidade Medida Comercial é obrigatória.'),
        produtoProprio: yup.boolean().required('Tipo Pessoa é obrigatório.'),
        unidadeMedidaEstoqueId: formData.controlaEstoque ? yup.number().required('Unidade Medida Estoque é obrigatória.') : yup.number().notRequired(),
        quantidadeMinimaEstoque: formData.controlaEstoque ? yup.number().required('Quantidade Mínima é obrigatória.').min(0, 'Quantidade mínima deve ser maior ou igual a 0') : yup.number().notRequired(),
        quantidadeMaximaEstoque: formData.controlaEstoque ? yup.number().required('Quantidade Máxima é obrigatória.').min(formData.quantidadeMinimaEstoque, 'Quantidade máxima deve ser maior ou igual quantidade mínima') : yup.number().notRequired(),
        quantidadeIdealEstoque: formData.controlaEstoque
            ? yup.number().required('Quantidade Ideal é obrigatória.').min(formData.quantidadeMinimaEstoque, 'Quantidade deve ser maior que a quantidade mínima').max(formData.quantidadeMaximaEstoque, 'Quantidade deve ser menor que a quantidade máxima')
            : yup.number().notRequired(),
        quantidadeAlertaEstoque: formData.controlaEstoque
            ? yup.number().required('Quantidade Alerta é obrigatória.').min(formData.quantidadeMinimaEstoque, 'Quantidade deve ser maior que a quantidade mínima').max(formData.quantidadeMaximaEstoque, 'Quantidade deve ser menor que a quantidade máxima')
            : yup.number().notRequired(),
        origemId: yup.number().required('Origem é obrigatória.'),
        ncmId: yup.number().required('NCM é obrigatório.'),
        unidadeMedidaTributavelId: yup.number().required('Unidade Medida Tributável é obrigatória.')
    });
};

const formData = reactive({});
const tiposProduto = ref([
    { name: 'Próprio', value: true },
    { name: 'Terceiro', value: false }
]);

onMounted(async () => {
    idItem.value = route.params.id || 0;
    if (idItem.value > 0) {
        await ItemService.getById(idItem.value)
            .then(async (data) => {
                formData.codigo = data.codigo;
                formData.nome = data.nome;    
                formData.descritivo = data.descritivo;
                formData.sku = data.sku;
                formData.unidadeMedidaComercialId = data.unidadeMedidaComercialId;
                formData.marcaId = data.marcaId;
                formData.linhaId = data.linhaId;
                formData.planoCassificacaoItemId = data.planoCassificacaoItemId;
                formData.gtinEan = data.gtinEan;
                formData.produtoProprio = data.produtoProprio;
                formData.fracionado = data.fracionado;
                formData.controlaEstoque = data.controlaEstoque;
                formData.unidadeMedidaEstoqueId = data.unidadeMedidaEstoqueId;
                formData.quantidadeMinimaEstoque = data.quantidadeMinimaEstoque;
                formData.quantidadeMaximaEstoque = data.quantidadeMaximaEstoque;
                formData.quantidadeIdealEstoque = data.quantidadeIdealEstoque;
                formData.quantidadeAlertaEstoque = data.quantidadeAlertaEstoque;
                formData.origemId = data.origemId;
                formData.ncmId = data.ncmId;
                formData.unidadeMedidaTributavelId = data.unidadeMedidaTributavelId;

                await NcmService.getById(formData.ncmId).then((data) => {
                    formData.ncm = data;
                });
            })
            .catch(async () => {
                await Swal.fire('Falha', `Não foi encontrado item para o id ${idItem.value}`, 'error');
                cancelar();
            });
    }
});

const cancelar = () => {
    router.push({ path: '/estoque/cadastro/item' });
};

const salvarRegistro = () => {
    if (idItem.value === 0) {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const criarRegistro = () => {
    ItemService.create(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Item criado com sucesso', life: 5000 });
            router.push({ path: '/estoque/cadastro/item' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o item.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = idItem.value;

    ItemService.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Item alterado com sucesso', life: 5000 });
            router.push({ path: '/estoque/cadastro/item' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o item.', life: 5000 });
        });
};

const getProximoCodigo = () => {
    ItemService.getProximoCodigo()
        .then((data) => {
            formData.codigo = data;
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível obter o próximo código.', life: 5000 });
        });
};

const changeNcm = (event) => {
    formData.ncm = event;
};

const changeFracionado = () => {
    if (!formData.fracionado) {
        formData.quantidadeMinimaEstoque = Math.trunc(formData.quantidadeMinimaEstoque) || 0;
        formData.quantidadeMaximaEstoque = Math.trunc(formData.quantidadeMaximaEstoque) || 0;
        formData.quantidadeIdealEstoque = Math.trunc(formData.quantidadeIdealEstoque) || 0;
        formData.quantidadeAviso = Math.trunc(formData.quantidadeAviso) || 0;
    }
};

const changeControlaEstoque = () => {
    if (!formData.controlaEstoque) {
        formData.unidadeMedidaEstoqueId = null;
        formData.quantidadeMinimaEstoque = null;
        formData.quantidadeMaximaEstoque = null;
        formData.quantidadeIdealEstoque = null;
        formData.quantidadeAviso = null;
    }
};

const labelNcmSelector = computed(() => {
    if (formData.ncm) {
        return `${formData.ncm.codigo} - ${formData.ncm.nome}`;
    }
    return '';
});

</script>

<template>
    <UWPageBase :title="idItem === 0 ? 'Novo Item' : 'Alterar Item'">
        <UWForm :schema="createSchema()" :values="formData" ref="formItem" @doSubmit="salvarRegistro" @doCancel="cancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Identificação do Item" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWInteger id="id" label="Código" required autofocus v-model="formData.codigo" :showButton="true" @clickButton="getProximoCodigo" classContainer="col-12 md:col-1" :errors="errors.value?.codigo" />
                                <UWInput id="nome" label="Nome" uppercase required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-8" />
                                <UWInput id="sku" label="SKU" uppercase v-model="formData.sku" :errors="errors.value?.sku" classContainer="col-12 md:col-3" />
                                <UWTextArea id="descritivo" rows="3" label="Descritivo" required v-model="formData.descritivo" :errors="errors.value?.descritivo" classContainer="col-12 md:col-12" />
                            </div>
                        </UWFieldSet>
                    </div>
                </div>

                <TabView class="col-12">
                    <TabPanel header="Classificação" class="col-12">
                        <div class="p-fluid formgrid grid">
                            <UWSeletor
                                classContainer="col-12 md:col-3"
                                v-model="formData.unidadeMedidaComercialId"
                                optionLabel="nome"
                                optionValue="id"
                                required
                                label="Unidade Medida Comercial"
                                :service="UnidadeMedidaService"
                                placeholder="Selecione a unidade medida"
                                :erros="errors.value?.unidadeMedidaComercialId"
                                positionTooltip="right"
                            />
                            <UWSeletor classContainer="col-12 md:col-3" v-model="formData.marcaId" optionLabel="nome" optionValue="id" label="Marca" :service="MarcaService" placeholder="Selecione a marca" :erros="errors.value?.marcaId" />
                            <UWSeletor classContainer="col-12 md:col-3" v-model="formData.linhaId" optionLabel="nome" optionValue="id" label="Linha" :service="LinhaService" placeholder="Selecione a linha" :erros="errors.value?.linhaId" />
                            <UWSeletor
                                classContainer="col-12 md:col-3"
                                v-model="formData.planoCassificacaoItemId"
                                optionLabel="nome"
                                optionValue="id"
                                label="Cassificação Comercial"
                                :service="PlanoClassificacaoItemService"
                                placeholder="Selecione a classificação"
                                :erros="errors?.value?.planoCassificacaoItemId"
                                positionTooltip="left"
                            />
                            <UWInput id="gtin" label="GTIN/EAN" uppercase v-model="formData.gtinEan" :errors="errors.value?.gtinEan" classContainer="col-12 md:col-3" />
                            <UWPickList
                                id="tipoProduto"
                                label="Tipo de Produto"
                                v-model="formData.produtoProprio"
                                optionLabel="name"
                                optionValue="value"
                                required
                                :options="tiposProduto"
                                classContainer="col-12 md:col-3"
                                :errors="errors.value?.produtoProprio"
                            />
                            <div class="field col-12 md:col-3 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.fracionado"
                                        onLabel="Produto Fracionado"
                                        offLabel="Produto Não Fracionado"
                                        onIcon="pi pi-thumbs-up"
                                        offIcon="pi pi-thumbs-down"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        @change="changeFracionado"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.fracionado, 'bg-red-100 border-white': !formData.fracionado }]
                                            }
                                        }"
                                    />
                                </span>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Estoque" class="col-12">
                        <div class="p-fluid formgrid grid">
                            <div class="field md:col-3 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.controlaEstoque"
                                        onLabel="Controla Estoque"
                                        offLabel="Não Controla Estoque"
                                        onIcon="pi pi-lock"
                                        offIcon="pi pi-lock-open"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        @change="changeControlaEstoque"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.controlaEstoque, 'bg-red-100 border-white': !formData.controlaEstoque }]
                                            }
                                        }"
                                    />
                                </span>
                            </div>

                            <UWSeletor
                                classContainer="col-12 md:col-3"
                                v-model="formData.unidadeMedidaEstoqueId"
                                optionLabel="nome"
                                optionValue="id"
                                :required="formData.controlaEstoque"
                                :disabled="!formData.controlaEstoque"
                                label="Unidade Medida Estoque"
                                :service="UnidadeMedidaService"
                                placeholder="Selecione a unidade medida"
                                :erros="errors?.value?.unidadeMedidaEstoqueId"
                            />
                            <div class="border-1 surface-border border-round mb-3 col-12 ml-3 mr-3 bg-bluegray-50">
                                <span class="text-900 font-bold block border-bottom-1 surface-border p-3">Quantidades</span>
                                <div v-if="!formData.fracionado">
                                    <div class="p-3 flex gap-2">
                                        <UWInteger
                                            id="quantidadeMinimaEstoque"
                                            label="Mínima"
                                            :required="formData.controlaEstoque"
                                            autofocus
                                            v-model="formData.quantidadeMinimaEstoque"
                                            :disabled="!formData.controlaEstoque"
                                            classContainer="col-12 md:col-3"
                                            :errors="errors.value?.quantidadeMinimaEstoque"
                                        />
                                        <UWInteger
                                            id="quantidadeMaximaEstoque"
                                            label="Máxima"
                                            :required="formData.controlaEstoque"
                                            v-model="formData.quantidadeMaximaEstoque"
                                            :disabled="!formData.controlaEstoque"
                                            classContainer="col-12 md:col-3"
                                            :errors="errors.value?.quantidadeMaximaEstoque"
                                        />
                                        <UWInteger
                                            id="quantidadeIdealEstoque"
                                            label="Ideal"
                                            :required="formData.controlaEstoque"
                                            v-model="formData.quantidadeIdealEstoque"
                                            :disabled="!formData.controlaEstoque"
                                            classContainer="col-12 md:col-3"
                                            :errors="errors.value?.quantidadeIdealEstoque"
                                        />
                                        <UWInteger
                                            id="quantidadeAviso"
                                            label="Alerta"
                                            :required="formData.controlaEstoque"
                                            v-model="formData.quantidadeAlertaEstoque"
                                            :disabled="!formData.controlaEstoque"
                                            classContainer="col-12 md:col-3"
                                            :errors="errors.value?.quantidadeAlertaEstoque"
                                        />
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="p-3 flex gap-2">
                                        <UWDecimal
                                            id="quantidadeMinimaEstoque"
                                            label="Mínima"
                                            :required="formData.controlaEstoque"
                                            maximoDigitos="5"
                                            autofocus
                                            v-model="formData.quantidadeMinimaEstoque"
                                            :disabled="!formData.controlaEstoque"
                                            classContainer="col-12 md:col-3"
                                            :errors="errors.value?.quantidadeMinimaEstoque"
                                        />
                                        <UWDecimal
                                            id="quantidadeMaximaEstoque"
                                            label="Máxima"
                                            :required="formData.controlaEstoque"
                                            maximoDigitos="5"
                                            v-model="formData.quantidadeMaximaEstoque"
                                            :disabled="!formData.controlaEstoque"
                                            classContainer="col-12 md:col-3"
                                            :errors="errors.value?.quantidadeMaximaEstoque"
                                        />
                                        <UWDecimal
                                            id="quantidadeIdealEstoque"
                                            label="Ideal"
                                            :required="formData.controlaEstoque"
                                            maximoDigitos="5"
                                            v-model="formData.quantidadeIdealEstoque"
                                            :disabled="!formData.controlaEstoque"
                                            classContainer="col-12 md:col-3"
                                            :errors="errors.value?.quantidadeIdealEstoque"
                                        />
                                        <UWDecimal
                                            id="quantidadeAviso"
                                            label="Alerta"
                                            :required="formData.controlaEstoque"
                                            maximoDigitos="5"
                                            v-model="formData.quantidadeAlertaEstoque"
                                            :disabled="!formData.controlaEstoque"
                                            classContainer="col-12 md:col-3"
                                            :errors="errors.value?.quantidadeAlertaEstoque"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Fiscal" class="col-12">
                        <div class="p-fluid formgrid grid">
                            <UWSeletor
                                classContainer="col-12 md:col-12"
                                v-model="formData.origemId"
                                optionLabel="nome"
                                optionValue="id"
                                required
                                label="Origem"
                                :service="OrigemService"
                                placeholder="Selecione a origem"
                                :erros="errors?.value?.origemId"
                            />
                            <UWSeletor
                                classContainer="col-12 md:col-6"
                                v-model="formData.ncmId"
                                optionLabel="nome"
                                optionValue="id"
                                required
                                label="NCM"
                                :service="NcmService"
                                placeholder="Selecione o NCM"
                                :erros="errors?.value?.ncmId"
                                @changeObject="changeNcm"
                                :filtersSearch="[
                                    { field: 'codigo', matchMode: 'contains', tipoField: 'text', fieldFilter: 'codigo', labelFilter: 'Código' },
                                    { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome' }
                                ]"
                                fieldSearchDefault="nome"
                            >
                                <template #values> {{ labelNcmSelector }} </template>

                                <template #options="slotProps">
                                    <div class="flex flex-column">
                                        {{ truncate(slotProps.option.nome, 100) }}
                                        <div class="text-700 text-sm"><span>Código:</span> {{ slotProps.option.codigo }}</div>
                                    </div>
                                </template>
                            </UWSeletor>
                            <UWSeletor
                                classContainer="col-12 md:col-3"
                                v-model="formData.unidadeMedidaTributavelId"
                                optionLabel="nome"
                                optionValue="id"
                                required
                                label="Unidade Medida Tributável"
                                :service="UnidadeMedidaService"
                                placeholder="Selecione a unidade medida"
                                :erros="errors?.value?.unidadeMedidaTributavelId"
                            />
                        </div>
                    </TabPanel>
                </TabView>
            </template>
        </UWForm>
    </UWPageBase>
</template>
