<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import _ from 'lodash';
import { useToast } from 'primevue/usetoast';
import Swal from 'sweetalert2';
import { PerfilService, FuncionalidadeService, ModuloService } from '@/service';
import { FilterMatchMode } from 'primevue/api';

const idPerfil = ref();

const route = useRoute();
const router = useRouter();

const createSchema = () => {
    return yup.object().shape({
        nome: yup.string().required('Nome do usuário é obrigatório.'),
        descricao: yup.string().required('Descrição é obrigatório')
    });
};

const schema = createSchema();

const toast = useToast();

const formData = reactive({
    nome: undefined,
    descricao: undefined,
    perfisFuncionalidades: []
});
const funcionalidades = ref([]);
const funcionalidadesSelecionadas = ref([]);
const loading = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.EQUALS },
    permissao: { value: null, matchMode: FilterMatchMode.EQUALS },
    moduloNome: { value: null, matchMode: FilterMatchMode.EQUALS },
    nome: { value: null, matchMode: FilterMatchMode.CONTAINS },
    consultar: { value: null, matchMode: FilterMatchMode.EQUALS },
    inserir: { value: null, matchMode: FilterMatchMode.EQUALS },
    alterar: { value: null, matchMode: FilterMatchMode.EQUALS },
    excluir: { value: null, matchMode: FilterMatchMode.EQUALS }
});
const registrosFiltrados = ref([]);
const modulos = ref([]);
const checkedTodasFuncionalidades = ref(false);
const checkedTodosConsultar = ref(false);
const checkedTodosInserir = ref(false);
const checkedTodosAlterar = ref(false);
const checkedTodosExcluir = ref(false);

onMounted(async () => {
    idPerfil.value = route.params.id || 0;
    if (idPerfil.value > 0) {
        try {
            const data = await PerfilService.getById(idPerfil.value);

            formData.nome = data.nome;
            formData.descricao = data.descricao;
            if (data.perfisFuncionalidades && data.perfisFuncionalidades.length > 0)
                formData.perfisFuncionalidades.push(...data.perfisFuncionalidades);
        } catch {
            await Swal.fire('Falha', `Não foi encontrado perfil para o id ${idPerfil.value}`, 'error');
            cancelar();
        }
    }
    await getFuncionalidades();
    getModulos();
});

const getFuncionalidades = async () => {
    loading.value = true;
    await FuncionalidadeService.getAll().then(async (data) => {
        funcionalidades.value = _.sortBy(data, ['nome']);
        funcionalidades.value = await funcionalidades.value.map((f) => {
            let perfilFuncionalidade = undefined;

            if (formData.perfisFuncionalidades) perfilFuncionalidade = formData.perfisFuncionalidades.find((p) => p.funcionalidadeId === f.id);
            else perfilFuncionalidade = null;

            const retorno = {
                perfilFuncionalidadeId: perfilFuncionalidade ? perfilFuncionalidade.id : null,
                funcionalidadeId: f.id,
                permissao: perfilFuncionalidade ? true : false,
                moduloNome: f.moduloNome,
                nome: f.nome,
                crud: f.crud,
                consultar: perfilFuncionalidade && perfilFuncionalidade.consultar,
                inserir: perfilFuncionalidade && perfilFuncionalidade.inserir,
                alterar: perfilFuncionalidade && perfilFuncionalidade.alterar,
                excluir: perfilFuncionalidade && perfilFuncionalidade.excluir,
                group: f.moduloNome
            };
            return retorno;
        });
        loading.value = false;
    });
};

const getModulos = async () => {
    await ModuloService.getAll().then((data) => {
        modulos.value = data;
    });
};

const cancelar = () => {
    router.push({ path: '/admin/seguranca/perfis' });
};

const salvarRegistro = async () => {
    funcionalidadesSelecionadas.value = await funcionalidades.value.filter((e) => e.permissao === true);
    formData.perfisFuncionalidades = await funcionalidadesSelecionadas.value.map((e) => {
        return {
            id: e.perfilFuncionalidadeId,
            perfilId: formData.id,
            funcionalidadeId: e.funcionalidadeId,
            permissao: e.permissao,
            consultar: e.consultar,
            inserir: e.inserir,
            alterar: e.alterar,
            excluir: e.excluir
        };
    });

    if (idPerfil.value === 0) {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const criarRegistro = () => {
    PerfilService.create(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil criado com sucesso', life: 5000 });
            router.push({ path: '/admin/seguranca/perfis' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o perfil.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = idPerfil.value;

    PerfilService.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil alterado com sucesso', life: 5000 });
            router.push({ path: '/admin/seguranca/perfis' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o perfil.', life: 5000 });
        });
};

const onFilter = (event) => {
    registrosFiltrados.value = event.filteredValue;
};

const onChangeMarcarTodasFuncionalidades = async () => {
    await registrosFiltrados.value.forEach((e) => {
        e.permissao = checkedTodasFuncionalidades.value;
        e.consultar = checkedTodasFuncionalidades.value;
        e.inserir = checkedTodasFuncionalidades.value;
        e.alterar = checkedTodasFuncionalidades.value;
        e.excluir = checkedTodasFuncionalidades.value;
    });
    ajustaIconeTodos();
};

const ajustaIcone = (tipo, checked) => {
    let lista = funcionalidades.value;
    if (tipo !== 'permissao') {
        lista = funcionalidades.value.filter((e) => e.crud);
    }
    const permissaoChecked = lista.findIndex((e) => e[tipo]);
    const permissaoUnChecked = lista.findIndex((e) => !e[tipo]);
    if (permissaoChecked >= 0 && permissaoUnChecked >= 0) this[checked] = false;
    else if (permissaoChecked >= 0 && permissaoUnChecked === -1) this[checked] = true;
    else this[checked] = false;
};

const ajustaIconeTodos = () => {
    ajustaIcone('consultar', 'checkedTodosConsultar');
    ajustaIcone('inserir', 'checkedTodosInserir');
    ajustaIcone('alterar', 'checkedTodosAlterar');
    ajustaIcone('excluir', 'checkedTodosExcluir');
    ajustaIcone('permissao', 'checkedTodasFuncionalidades');
};

const onChangeMarcarPermissao = (element, check) => {
    element.permissao = check;
    element.consultar = check;
    element.inserir = check;
    element.alterar = check;
    element.excluir = check;
    ajustaIconeTodos();
};

const onChangeMarcarTodosCrud = async (campo, checked) => {
    const field = campo;
    await registrosFiltrados.value.forEach((e) => {
        onChangeMarcarCrud(e, field, checked, false);
    });
    ajustaIconeTodos();
};

const onChangeMarcarCrud = (element, field, checked, ajustar) => {
    element[field] = checked;
    if (!element.consultar && !element.inserir && !element.alterar && !element.excluir && element.crud) element.permissao = false;
    else element.permissao = true;
    if (ajustar) ajustaIconeTodos();
};

const marcadas = computed(() => {
    return _.size(funcionalidades.value.filter((e) => e.permissao));
});
</script>

<template>
    <UWPageBase :title="idUsuario === 0 ? 'Novo Perfil' : 'Alterar Perfil'">
        <UWForm :schema="schema" :values="formData" ref="formPerfil" @doSubmit="salvarRegistro" @doCancel="cancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Identificação do Perfil" class="h-full">
                            <div class="formgrid grid">
                                <UWInput id="nome" label="Nome" uppercase required autofocus v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-12" />
                                <UWInput id="descricao" label="Descricao" uppercase required v-model="formData.descricao" :errors="errors.value?.descricao" classContainer="col-12 md:col-12" />
                            </div>
                        </UWFieldSet>
                    </div>
                </div>

                <TabView class="col-12">
                    <TabPanel header="Funcionalidades" class="col-12">
                        <DataTable
                            :value="funcionalidades"
                            dataKey="id"
                            v-model:filters="filters"
                            filterDisplay="row"
                            rowGroupMode="subheader"
                            groupRowsBy="group"
                            :loading="loading"
                            responsiveLayout="scroll"
                            class="p-datatable-sm"
                            scrollable
                            scrollHeight="flex"
                            :globalFilterFields="['moduloNome']"
                            @filter="onFilter"
                        >
                            <template #empty> Nenhum funcionalidade encontrada. </template>
                            <template #loading> Carregando registros de funcionalidades. Por favor, espere. </template>
                            <template #header>
                                <div class="flex justify-content-start col-6">
                                    <Dropdown
                                        v-model="filters['global'].value"
                                        :options="modulos"
                                        optionLabel="nome"
                                        optionValue="nome"
                                        placeholder="Visualizar todos os módulos"
                                        class="p-column-filter w-full"
                                        :showClear="true"
                                        @change="onChangeFilter"
                                    >
                                        <span>{{ slotProps.data.nome }}</span>
                                    </Dropdown>
                                </div>
                            </template>
                            <Column field="permissao" header="" dataType="boolean" style="max-width: 3%">
                                <template #header="">
                                    <Checkbox v-model="checkedTodasFuncionalidades" :binary="true" @change="onChangeMarcarTodasFuncionalidades" />
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()" />
                                </template>
                                <template #body="slotProps">
                                    <Checkbox v-model="slotProps.data.permissao" :binary="true" @change="onChangeMarcarPermissao(slotProps.data, slotProps.data.permissao)" />
                                </template>
                            </Column>
                            <Column field="nome" header="Funcionalidade" style="max-width: 60%">
                                <template #filter="{ filterModel, filterCallback }">
                                    <InputText
                                        type="text"
                                        v-model="filterModel.value"
                                        @keydown.enter="filterCallback()"
                                        class="p-column-filter"
                                        :placeholder="`Procurar por funcionalidade - ${filterModel.matchMode}`"
                                        v-tooltip.top.focus="'Pressione a tecla ENTER para filtar'"
                                    />
                                </template>
                            </Column>
                            <Column field="consultar" header="Consultar" style="max-width: 10%" dataType="boolean">
                                <template #header="">
                                    <Checkbox v-model="checkedTodosConsultar" :binary="true" class="mr-2" @change="onChangeMarcarTodosCrud('consultar', checkedTodosConsultar)" />
                                </template>
                                <template #body="slotProps">
                                    <Checkbox v-if="slotProps.data.crud" v-model="slotProps.data.consultar" :binary="true" @change="onChangeMarcarCrud(slotProps.data, 'consultar', slotProps.data.consultar, true)" />
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()" />
                                </template>
                            </Column>
                            <Column field="inserir" header="Inserir" style="max-width: 10%" dataType="boolean">
                                <template #header="">
                                    <Checkbox v-model="checkedTodosInserir" :binary="true" class="mr-2" @change="onChangeMarcarTodosCrud('inserir', checkedTodosInserir)" />
                                </template>
                                <template #body="slotProps">
                                    <Checkbox v-if="slotProps.data.crud" v-model="slotProps.data.inserir" :binary="true" @change="onChangeMarcarCrud(slotProps.data, 'inserir', slotProps.data.inserir, true)" />
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()" />
                                </template>
                            </Column>
                            <Column field="alterar" header="Alterar" style="max-width: 10%" dataType="boolean">
                                <template #header="">
                                    <Checkbox v-model="checkedTodosAlterar" :binary="true" class="mr-2" @change="onChangeMarcarTodosCrud('alterar', checkedTodosAlterar)" />
                                </template>
                                <template #body="slotProps">
                                    <Checkbox v-if="slotProps.data.crud" v-model="slotProps.data.alterar" :binary="true" @change="onChangeMarcarCrud(slotProps.data, 'alterar', slotProps.data.alterar, true)" />
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()" />
                                </template>
                            </Column>
                            <Column field="excluir" header="Excluir" style="max-width: 10%" dataType="boolean">
                                <template #header="">
                                    <Checkbox v-model="checkedTodosExcluir" :binary="true" class="mr-2" @change="onChangeMarcarTodosCrud('excluir', checkedTodosExcluir)" />
                                </template>
                                <template #body="slotProps">
                                    <Checkbox v-if="slotProps.data.crud" v-model="slotProps.data.excluir" :binary="true" @change="onChangeMarcarCrud(slotProps.data, 'excluir', slotProps.data.excluir, true)" />
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()" />
                                </template>
                            </Column>
                            <template #groupheader="slotProps">
                                <span class="image-text">{{ slotProps.data.group }}</span>
                            </template>
                            <template #footer> Perfil com {{ marcadas }} funcionalidades selecionadas. </template>
                        </DataTable>
                    </TabPanel>
                </TabView>
            </template>
        </UWForm>
    </UWPageBase>
</template>
