<template>
    <div class="h-screen flex w-full surface-ground">
        <div class="flex flex-1 flex-column surface-ground align-items-center justify-content-center">
            <div class="w-11 sm:w-30rem">
                <div class="flex flex-column">
                    <div style="height: 56px; width: 56px" class="bg-primary-50 border-circle flex align-items-center justify-content-center">
                        <i class="pi pi-sign-in text-primary text-4xl"></i>
                    </div>
                    <div class="mt-4">
                        <h1 class="m-0 text-primary font-semibold text-4xl">Seja Bem-vindo!</h1>
                        <span class="block text-700 mt-2">Preencha as credências para acessar o ERP</span>
                    </div>
                </div>
                <UWForm :schema="schema" @submit="realizarLogin" :values="formData" v-slot="{ errors }" :visible-save="false" :visible-cancel="false">
                    <div class="flex flex-column gap-3 mt-6">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon"><i class="pi pi-tag"></i></span>
                            <inputText name="tenant" v-model="formData.tenant" placeholder="Identificador" :class="{ 'p-invalid': errors?.tenant }" />
                        </div>
                        <small class="p-invalid" v-if="errors?.tenant">{{ errors?.tenant }}</small>
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon"><i class="pi pi-user"></i></span>
                            <inputText name="username" v-model="formData.username" placeholder="Usuário" :class="{ 'p-invalid': errors?.username }" />
                        </div>
                        <small class="p-invalid" v-if="errors?.username">{{ errors?.username }}</small>
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon"><i class="pi pi-key"></i></span>
                            <inputText name="password" type="password" v-model="formData.password" placeholder="Senha" :class="{ 'p-invalid': errors?.password }" />
                        </div>
                        <small class="p-invalid" v-if="errors?.password">{{ errors?.password }}</small>
                        <Message v-if="errorServer" severity="error">{{ errorServer }}</Message>
                        <div>
                            <Button type="submit" class="w-full" label="ENTRAR"></Button>
                        </div>
                        <div>
                            <Button class="w-full text-primary-500" text label="ESQUECEU A SENHA?"> </Button>
                        </div>
                    </div>
                </UWForm>
            </div>
        </div>
        <div :style="{ backgroundImage: 'url(/erp/images/pages/login-bgs.jpg)' }" class="hidden lg:flex flex-1 align-items-center justify-content-center bg-cover">
            <img src="/layout/images/logo/logo-login.png" alt="" />
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount  } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
// import useServices from '@/composables/useServices';
import { useAuth, useContexto } from '../stores';
import UWForm from '../components/layout/UWForm.vue';
import AuthService from '@/service/AuthService';
import UsuarioService from '@/service/UsuarioService';
import ContextoService from '@/service/ContextoService';    

const schema = yup.object().shape({
    tenant: yup.string().required(),
    username: yup.string().required('Usuário é obrigatório.'),
    password: yup.string().required('Senha é obrigatória.')
});

// const services = ref({});
// let   AuthService, UsuarioService, ContextoService;

const auth = useAuth();
const contexto = useContexto();

const errorServer = ref('');

const userId = ref(0);

const formData = reactive({ tenant: '', username: '', password: '' });

const router = useRouter();

const realizarLogin = async () => {
    auth.setTenant(formData.tenant);
    const fezLogin = await autenticar(formData.username, formData.password);
    if (fezLogin) {
        const pegouInfoUser = await buscarInfoUser();
        if (pegouInfoUser) {
            const pegouContexto = await getContexto(userId.value);
            const pegouOrganograma = await getOrganogramaContexto(userId.value);
            if (pegouContexto && pegouOrganograma) {
                router.push({ path: '/' });
            } else {
                auth.logout();
                router.push({ path: '/noContext' });
            }
        } else {
            auth.logout();
            errorServer.value = 'Não foi possível recuperar informações do usuário';
        }
    } else {
        errorServer.value = 'Credenciais inválidas';
    }
};

const autenticar = async (username, password) => {
    try {
        const retorno = await AuthService.login(username, password);
        auth.setToken(retorno.token);
        auth.setRefreshToken(retorno.refreshToken);
        auth.setUserId(retorno.userId);
        userId.value = retorno.userId;
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
};

const buscarInfoUser = async () => {
    try {
        const retornoUsuario = await UsuarioService.infoUser();
        auth.setInfoUser(retornoUsuario);
        return true;
    } catch {
        return false;
    }
};

const getContexto = async (userId) => {
    try {
        const data = await ContextoService.getContexto(userId);
        contexto.setContexto(data);
        return true;
    } catch {
        return false;
    }
};

const getOrganogramaContexto = async (userId) => {
    try {
        const data = await ContextoService.getOrganogramaContexto(userId);
        const organograma = data.map((item) => {
            return {
                empresaId: item.empresaId,
                empresaNome: item.empresaNome,
                filiais: data
                    .filter((itemF) => itemF.empresaId === item.empresaId)
                    .map((itemM) => {
                        return {
                            empresaFilialId: itemM.empresaFilialId,
                            empresaFilialNome: itemM.empresaFilialNome
                        };
                    })
            };
        });
        contexto.setOrganograma(organograma);
        return true;
    } catch {
        return false;
    }
};

// onBeforeMount(async () => {
//     await useServices(['AuthService', 'UsuarioService', 'ContextoService'], services);

//     const { AuthService: _AuthService, UsuarioService: _UsuarioService, ContextoService: _ContextoService } = services.value;
//     AuthService = _AuthService;
//     UsuarioService = _UsuarioService;
//     ContextoService = _ContextoService;
// });

</script>

<!-- :class="{ 'p-invalid': errors && errorBag.value.tenant }" -->
