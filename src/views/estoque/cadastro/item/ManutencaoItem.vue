<script setup>
import { ref, reactive, onMounted } from 'vue';
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
        nome: yup.string().required('Nome do usuário é obrigatório.')
    });
};

const formData = reactive({});

onMounted(() => {
    idItem.value = route.params.id || 0;
    if (idItem.value > 0) {
        ItemService.getById(idItem.value)
            .then((data) => {
                formData.codigo = data.codigo;
                formData.nome = data.nome;
                formData.sku = data.sku;
                formData.descritivo = data.descritivo;
                formData.unidadeMedidaComercialId = data.unidadeMedidaComercialId;
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
                                <UWInput id="descritivo" label="Descritivo" uppercase required v-model="formData.descritivo" :errors="errors.value?.descritivo" classContainer="col-12 md:col-12" />
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
                                :erros="errors?.value?.unidadeMedidaComercialId"
                                positionTooltip="right"
                            />
                            <UWSeletor classContainer="col-12 md:col-3" v-model="formData.marcaId" optionLabel="nome" optionValue="id" label="Marca" :service="MarcaService" placeholder="Selecione a marca" :erros="errors?.value?.marcaId" />
                            <UWSeletor classContainer="col-12 md:col-3" v-model="formData.linhaId" optionLabel="nome" optionValue="id" label="Linha" :service="LinhaService" placeholder="Selecione a linha" :erros="errors?.value?.linhaId" />
                            <UWSeletor
                                classContainer="col-12 md:col-3"
                                v-model="formData.classificacaoComercialId"
                                optionLabel="nome"
                                optionValue="id"
                                label="Cassificação Comercial"
                                :service="PlanoClassificacaoItemService"
                                placeholder="Selecione a classificação"
                                :erros="errors?.value?.classificacaoComercialId"
                                positionTooltip="left"
                            />
                            <UWInput id="gtin" label="GTIN/EAN" uppercase v-model="formData.gtin" :errors="errors.value?.gtin" classContainer="col-12 md:col-3" />
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
                                required
                                label="Unidade Medida Estoque"
                                :service="UnidadeMedidaService"
                                placeholder="Selecione a unidade medida"
                                :erros="errors?.value?.unidadeMedidaEstoqueId"
                            />
                            <div class="border-1 surface-border border-round mb-3 col-12 ml-3 mr-3 bg-bluegray-50">
                                <span class="text-900 font-bold block border-bottom-1 surface-border p-3">Quantidades</span>
                                <div class="p-3 flex gap-2">
                                    <UWInteger id="id" label="Mínima" required autofocus v-model="formData.codigo" classContainer="col-12 md:col-3" :errors="errors.value?.codigo" />
                                    <UWInteger id="id" label="Máxima" required autofocus v-model="formData.codigo" classContainer="col-12 md:col-3" :errors="errors.value?.codigo" />
                                    <UWInteger id="id" label="Ideal" required autofocus v-model="formData.codigo" classContainer="col-12 md:col-3" :errors="errors.value?.codigo" />
                                    <UWInteger id="id" label="Alerta" required autofocus v-model="formData.codigo" classContainer="col-12 md:col-3" :errors="errors.value?.codigo" />
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
                                :filtersSearch="[{ field: 'codigo', matchMode: 'contains', tipoField: 'text', fieldFilter: 'codigo', labelFilter: 'Código'},
                                                 { field: 'nome', matchMode: 'contains', tipoField: 'text', fieldFilter: 'nome', labelFilter: 'Nome'},
                                                ]"
                                fieldSearchDefault="nome"
                            >
                                <template #values> {{ formData.ncm?.codigo }} - {{ formData.ncm?.nome }} </template>

                                <template #options="slotProps">
                                    <div class="flex flex-column">
                                        {{ truncate(slotProps.option.nome, 100 )}} 
                                        <div class="text-700 text-sm"><span>Código:</span> {{ slotProps.option.codigo }} </div>
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
