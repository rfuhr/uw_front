
<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import _ from 'lodash';
import { useToast } from 'primevue/usetoast';
import Swal from 'sweetalert2';
import { UsuarioService, EmpresaService, EmpresaFilialService, PerfilService, FuncionalidadeService, GrupoAutonomiaService, AutonomiaService } from '@/service';

const idUsuario = ref();
const dtPermissoes = ref();
const dtFuncionalidades = ref();
const dtAutonomias = ref();

const route = useRoute();
const router = useRouter();

const permissaoSchema = yup.object().shape({
    empresaId: yup.string().required('Empresa para permissão é obrigatória ser informada.'),
    filiaisId: yup.array().of(yup.number().integer()).optional().nullable(),
    perfisId: yup.array().of(yup.number().integer()).required('Perfil para permissão é obrigatório ser informado.')
});

const funcionalidadeSchema = yup.object().shape({
    empresaId: yup.string().required('Empresa para permissão é obrigatória ser informada.'),
    filiaisId: yup.array().of(yup.number().integer()).optional().nullable(),
    funcionalidadeId: yup.string().required('Funcionalidade para permissão é obrigatória ser informada.')
});

const autonomiaSchema = yup.object().shape({
    empresaId: yup.string().required('Empresa para permissão é obrigatória ser informada.'),
    filiaisId: yup.array().of(yup.number().integer()).optional().nullable(),
    grupoAutonomiaId: yup.string().required('Grupo de Autonomia para permissão é obrigatória ser informada.'),
    autonomiaId: yup.string().required('Autonomia para permissão é obrigatória ser informada.')
});

const senhaIsRequired = () => {
    const id = route.params.id || 0;
    const senha = id > 0 ? false : true;

    return id === 0 || senha;
};

const createSchema = () => {
    return yup.object().shape({
        nome: yup.string().required('Nome do usuário é obrigatório.'),
        email: yup.string().required('Email é obrigatório').email('Email com formato incorreto.'),
        username: yup.string().required('Username é obrigatório.'),
        ativo: yup.boolean().required('Status é obrigatório ser informado'),
        senha: senhaIsRequired() ? yup.string().required('Senha é obrigatória') : yup.string(),
        confirmarSenha: senhaIsRequired()
            ? yup
                  .string()
                  .oneOf([yup.ref('senha'), null], 'As senhas devem ser iguais.')
                  .required('Confirmação de Senha é obrigatória')
            : yup.string(),
        permissoes: yup.array().of(permissaoSchema),
        funcionalidades: yup.array().of(funcionalidadeSchema),
        autonomias: yup.array().of(autonomiaSchema),
    });
};

const schema = createSchema(!idUsuario.value || idUsuario.value === 0 || novaSenha);

const toast = useToast();

const novaSenha = ref(false);

const formData = reactive({
    nome: undefined,
    email: undefined,
    username: undefined,
    ativo: true,
    permissoes: [],
    funcionalidades: [],
    autonomias: []
});

onMounted(() => {
    idUsuario.value = route.params.id || 0;
    novaSenha.value = route.params.id ? false : true;
    if (idUsuario.value > 0) {
        UsuarioService.getById(idUsuario.value)
            .then((data) => {
                formData.nome = data.nome;
                formData.email = data.email;
                formData.username = data.username;
                formData.ativo = data.ativo;
                if (data.permissoes && data.permissoes.length > 0)
                    formData.permissoes.push(...data.permissoes);
                if (data.funcionalidades && data.funcionalidades.length > 0)
                    formData.funcionalidades.push(...data.funcionalidades);
                if (data.autonomias && data.autonomias.length > 0)
                    formData.autonomias.push(...data.autonomias);
            })
            .catch(async () => {
                await Swal.fire('Falha', `Não foi encontrado usuário para o id ${idUsuario.value}`, 'error');
                cancelar();
            });
    }
});

const status = computed(() => {
    return formData.ativo ? 'Usuário Ativo' : 'Usuário Inativo';
});

const cancelar = () => {
    router.push({ path: '/admin/seguranca/usuarios' });
};

const salvarRegistro = () => {
    if (idUsuario.value === 0) {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const criarRegistro = () => {
    UsuarioService.create(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário criado com sucesso', life: 5000 });
            router.push({ path: '/admin/seguranca/usuarios' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o usuário.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = idUsuario.value;

    UsuarioService.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário alterado com sucesso', life: 5000 });
            router.push({ path: '/admin/seguranca/usuarios' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o usuário.', life: 5000 });
        });
};

const adicionarRegraPermissao = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;
    formData.permissoes.push({
        id: idLine,
        empresaId: undefined,
        filiaisId: undefined,
        perfisId: undefined
    });
};

const adicionarRegraFuncionalidade = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;
    formData.funcionalidades.push({
        id: idLine,
        empresaId: undefined,
        filiaisId: undefined,
        funcionalidadeId: undefined,
        consultar: undefined,
        inserir: undefined,
        alterar: undefined,
        excluir: undefined,
        liberado: true
    });
};

const adicionarRegraAutonomia = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;
    formData.autonomias.push({
        id: idLine,
        empresaId: undefined,
        filiaisId: undefined,
        grupoAutonomiaId: undefined,
        autonomiaId: undefined,
    });
};

const removerRegraPermissao = (idRemover) => {
    _.remove(formData.permissoes, (n) => {
        return n.id === idRemover;
    });
};

const removerRegraFuncionalidade = (idRemover) => {
    _.remove(formData.funcionalidades, (n) => {
        return n.id === idRemover;
    });
};

const removerRegraAutonomia = (idRemover) => {
    _.remove(formData.autonomias, (n) => {
        return n.id === idRemover;
    });
};

const handleFuncionalidade = (newObject, values) => {
    if (newObject.crud !== values.crud) {
        values.crud = newObject.crud;
        values.liberado = undefined;
        values.consultar = undefined;
        values.alterar   = undefined;
        values.excluir = undefined;
        values.inserir = undefined
    }
}


const handleGrupoAutonomia = (newObject, values) => {
    values.autonomiaId = undefined;
}


</script>

<template>
    <UWPageBase :title="idUsuario === 0 ? 'Novo Usuário' : 'Alterar Usuário'">
        <UWForm :schema="schema" :values="formData" ref="formUsuario" @doSubmit="salvarRegistro" @doCancel="cancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-8">
                        <UWFieldSet title="Identificação do Usuário" class="h-full">
                            <div class="formgrid grid">
                                <UWInput id="nome" label="Nome" uppercase required autofocus v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-12" />
                                <UWInput id="email" label="Email" lowercase type="email" required v-model="formData.email" :errors="errors.value?.email" classContainer="col-12 md:col-8" />
                                <UWInput id="status" label="Status" type="text" v-model="status" disabled classContainer="col-12 md:col-4" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-4">
                        <UWFieldSet title="Dados de Acesso" class="h-full flex flex-column justify-content-start">
                            <div class="formgrid grid">
                                <UWInput id="username" label="Username" :required="true" v-model="formData.username" :errors="errors.value?.username" classContainer="col-12 md:col-12" />
                                <UWInput v-if="novaSenha" type="password" id="senha" label="Nova Senha" :required="true" v-model="formData.senha" :errors="errors.value?.senha" classContainer="col-12 md:col-6" />
                                <UWInput v-if="novaSenha" type="password" id="confirmarSenha" label="Confirmar Senha" :required="true" v-model="formData.confirmarSenha" :errors="errors.value?.confirmarSenha" classContainer="col-12 md:col-6" />
                            </div>
                            <div class="formgrid grid">
                                <div class="col-12 md:col-12 flex justify-content-end gap-2">
                                    <Button v-if="formData.ativo" severity="danger" @click="formData.ativo = false">Inativar Acesso</Button>
                                    <Button v-if="!formData.ativo" severity="success" @click="formData.ativo = true">Ativar Acesso</Button>
                                    <Button v-if="idUsuario > 0" severity="help" @click="novaSenha = true">Resetar Senha</Button>
                                </div>
                            </div>
                        </UWFieldSet>
                    </div>
                </div>

                <TabView class="col-12">
                    <TabPanel header="Permissões de Acesso" class="col-12">
                        <Toolbar class="mb-2">
                            <template v-slot:end>
                                <div>
                                    <Button label="Adicionar Regra" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarRegraPermissao()" />
                                </div>
                            </template>
                        </Toolbar>
                        <DataTable ref="dtPermissoes" :value="formData.permissoes" responsiveLayout="scroll">
                            <Column field="empresaId" header="Empresa" style="width: 35%">
                                <template #body="slotProps">
                                    <UWSeletor
                                        classContainer="w-full"
                                        v-model="slotProps.data.empresaId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        :service="EmpresaService"
                                        placeholder="Selecione a empresa"
                                        @change="slotProps.data.filiaisId = []"
                                        :erros="_.get(errors.value, `permissoes[${slotProps.index}].empresaId`, null)"
                                    />
                                </template>
                            </Column>
                            <Column field="filiaisId" header="Filial" style="width: 35%">
                                <template #body="slotProps">
                                    <UWMultiSeletor
                                        classContainer="w-full"
                                        v-model="slotProps.data.filiaisId"
                                        :disabled="true"
                                        optionLabel="nome"
                                        optionValue="id"
                                        :service="EmpresaFilialService"
                                        placeholder="Selecione a filial"
                                        :erros="_.get(errors.value, `permissoes[${slotProps.index}].filiaisId`, null)"
                                        :columnsFilters="[{ field: 'empresa', value: slotProps.data.empresaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresa.id' }]"
                                    />
                                </template>
                            </Column>
                            <Column field="perfisId" header="Perfil" style="width: 35%">
                                <template #body="slotProps">
                                    <UWMultiSeletor
                                        classContainer="w-full"
                                        v-model="slotProps.data.perfisId"
                                        :disabled="true"
                                        optionLabel="nome"
                                        optionValue="id"
                                        :service="PerfilService"
                                        placeholder="Selecione a filial"
                                        :erros="_.get(errors.value, `permissoes[${slotProps.index}].perfisId`, null)"
                                    />
                                </template>
                            </Column>
                            <Column header="" style="width: 5%">
                                <template #body="slotProps">
                                    <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="removerRegraPermissao(slotProps.data.id)" />
                                </template>
                            </Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="Permissões Específicas" class="col-12">
                        <Toolbar class="mb-2">
                            <template v-slot:end>
                                <div>
                                    <Button label="Adicionar Regra" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarRegraFuncionalidade()" />
                                </div>
                            </template>
                        </Toolbar>
                        <DataTable ref="dtFuncionalidades" :value="formData.funcionalidades" responsiveLayout="scroll">
                            <Column field="empresaId" header="Empresa" style="width: 35%">
                                <template #body="slotProps">
                                    <UWSeletor
                                        classContainer="w-full"
                                        v-model="slotProps.data.empresaId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        :service="EmpresaService"
                                        placeholder="Selecione a empresa"
                                        @change="slotProps.data.filiaisId = []"
                                        :erros="_.get(errors.value, `funcionalidades[${slotProps.index}].empresaId`, null)"
                                    />
                                </template>
                            </Column>
                            <Column field="filiaisId" header="Filial" style="width: 35%">
                                <template #body="slotProps">
                                    <UWMultiSeletor
                                        classContainer="w-full"
                                        v-model="slotProps.data.filiaisId"
                                        :disabled="true"
                                        optionLabel="nome"
                                        optionValue="id"
                                        :service="EmpresaFilialService"
                                        placeholder="Selecione a filial"
                                        :erros="_.get(errors.value, `funcionalidades[${slotProps.index}].filiaisId`, null)"
                                        :columnsFilters="[{ field: 'empresa', value: slotProps.data.empresaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresa.id' }]"
                                    />
                                </template>
                            </Column>
                            <Column field="funcionalidadeId" header="Funcionalidade" style="width: 35%">
                                <template #body="slotProps">
                                    <UWSeletor
                                        classContainer="w-full"
                                        v-model="slotProps.data.funcionalidadeId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        :service="FuncionalidadeService"
                                        placeholder="Selecione a funcionalidade"
                                        @changeObject="handleFuncionalidade($event, slotProps.data)"
                                        :erros="_.get(errors.value, `funcionalidades[${slotProps.index}].funcionalidadeId`, null)"
                                    />
                                </template>
                            </Column>
                            <Column field="liberado" header="Liberado" style="width: 35%">
                                <template #body="slotProps">
                                    <InputSwitch
                                        :disabled="slotProps.data.crud"
                                        v-model="slotProps.data.liberado"
                                        :pt="{
                                            slider: ({ props }) => ({
                                                class: props.modelValue ? 'bg-teal-400' : 'bg-red-400'
                                            })
                                        }"
                                    />
                                </template>
                            </Column>
                            <Column field="consultar" header="Consultar" style="width: 35%">
                                <template #body="slotProps">
                                    <InputSwitch
                                        :disabled="!slotProps.data.crud"
                                        v-model="slotProps.data.consultar"
                                        :pt="{
                                            slider: ({ props }) => ({
                                                class: props.modelValue ? 'bg-teal-400' : 'bg-red-400'
                                            })
                                        }"
                                    />
                                </template>
                            </Column>
                            <Column field="inserir" header="Inserir" style="width: 35%">
                                <template #body="slotProps">
                                    <InputSwitch
                                        :disabled="!slotProps.data.crud"
                                        v-model="slotProps.data.inserir"
                                        :pt="{
                                            slider: ({ props }) => ({
                                                class: props.modelValue ? 'bg-teal-400' : 'bg-red-400'
                                            })
                                        }"
                                    />
                                </template>
                            </Column>
                            <Column field="alterar" header="Alterar" style="width: 35%">
                                <template #body="slotProps">
                                    <InputSwitch
                                        :disabled="!slotProps.data.crud"
                                        v-model="slotProps.data.alterar"
                                        :pt="{
                                            slider: ({ props }) => ({
                                                class: props.modelValue ? 'bg-teal-400' : 'bg-red-400'
                                            })
                                        }"
                                    />
                                </template>
                            </Column>
                            <Column field="excluir" header="Excluir" style="width: 35%">
                                <template #body="slotProps">
                                    <InputSwitch
                                        :disabled="!slotProps.data.crud"
                                        v-model="slotProps.data.excluir"
                                        :pt="{
                                            slider: ({ props }) => ({
                                                class: props.modelValue ? 'bg-teal-400' : 'bg-red-400'
                                            })
                                        }"
                                    />
                                </template>
                            </Column>
                            <Column header="" style="width: 5%">
                                <template #body="slotProps">
                                    <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="removerRegraFuncionalidade(slotProps.data.id)" />
                                </template>
                            </Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="Autonomias" class="col-12">
                        <Toolbar class="mb-2">
                            <template v-slot:end>
                                <div>
                                    <Button label="Adicionar Regra" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarRegraAutonomia()" />
                                </div>
                            </template>
                        </Toolbar>
                        <DataTable ref="dtAutonomias" :value="formData.autonomias" responsiveLayout="scroll">
                            <Column field="empresaId" header="Empresa" style="width: 25%">
                                <template #body="slotProps">
                                    <UWSeletor
                                        classContainer="w-full"
                                        v-model="slotProps.data.empresaId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        :service="EmpresaService"
                                        placeholder="Selecione a empresa"
                                        @change="slotProps.data.filiaisId = []"
                                        :erros="_.get(errors.value, `autonomias[${slotProps.index}].empresaId`, null)"
                                    />
                                </template>
                            </Column>
                            <Column field="filiaisId" header="Filial" style="width: 35%">
                                <template #body="slotProps">
                                    <UWMultiSeletor
                                        classContainer="w-full"
                                        v-model="slotProps.data.filiaisId"
                                        :disabled="true"
                                        optionLabel="nome"
                                        optionValue="id"
                                        :service="EmpresaFilialService"
                                        placeholder="Selecione a filial"
                                        :erros="_.get(errors.value, `autonomias[${slotProps.index}].filiaisId`, null)"
                                        :columnsFilters="[{ field: 'empresa', value: slotProps.data.empresaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresa.id' }]"
                                    />
                                </template>
                            </Column>
                            <Column field="grupoAutonomiaId" header="Grupo de Autonomia" style="width: 20%">
                                <template #body="slotProps">
                                    <UWSeletor
                                        classContainer="w-full"
                                        v-model="slotProps.data.grupoAutonomiaId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        :service="GrupoAutonomiaService"
                                        placeholder="Selecione o grupo de autonomia"
                                        @changeObject="handleGrupoAutonomia($event, slotProps.data)"
                                        :erros="_.get(errors.value, `autonomias[${slotProps.index}].grupoAutonomiaId`, null)"
                                    />
                                </template>
                            </Column>                            
                            <Column field="autonomiaId" header="Autonomia" style="width: 20%">
                                <template #body="slotProps">
                                    <UWSeletor
                                        classContainer="w-full"
                                        v-model="slotProps.data.autonomiaId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        :service="AutonomiaService"
                                        placeholder="Selecione a autonomia"
                                        :erros="_.get(errors.value, `autonomias[${slotProps.index}].autonomiaId`, null)"
                                        :columnsFilters="[{ field: 'grupoAutonomia', value: slotProps.data.grupoAutonomiaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'grupoAutonomia.id' }]"
                                    />
                                </template>
                            </Column>
                            <Column header="" style="width: 5%">
                                <template #body="slotProps">
                                    <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="removerRegraAutonomia(slotProps.data.id)" />
                                </template>
                            </Column>
                        </DataTable>
                    </TabPanel>
                </TabView>
            </template>
        </UWForm>
    </UWPageBase>
</template>
