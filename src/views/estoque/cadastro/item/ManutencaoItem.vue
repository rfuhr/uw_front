
<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import _ from 'lodash';
import { useToast } from 'primevue/usetoast';
import Swal from 'sweetalert2';
import { ItemService, UnidadeMedidaService } from '@/service';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const idItem = ref();

const createSchema = () => {
    return yup.object().shape({
        nome: yup.string().required('Nome do usuário é obrigatório.'),
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
</script>

<template>
    <UWPageBase :title="idItem === 0 ? 'Novo Item' : 'Alterar Item'">
        <UWForm :schema="createSchema()" :values="formData" ref="formItem" @doSubmit="salvarRegistro" @doCancel="cancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Identificação do Item" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWInteger id="id" label="Código" required autofocus v-model="formData.codigo" classContainer="col-12 md:col-1" :errors="errors.value?.codigo"/>
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
                            <UWSeletor classContainer="col-12 md:col-3" v-model="formData.unidadeMedidaComercialId" optionLabel="nome" optionValue="id" required label="Unidade Medida Comercial" :service="UnidadeMedidaService" placeholder="Selecione o pais" :erros="errors?.value?.unidadeMedidaComercialId" />
                        </div>
                    </TabPanel>
                </TabView>
            </template>
        </UWForm>
    </UWPageBase>
</template>
