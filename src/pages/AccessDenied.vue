<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores';

const router = useRouter();
const { logout } = useAuth();

const backgroundImage = ref('url(/erp/images/pages/accessDenied-bg.jpg)');
const backgroundStyle = ref({
    background: backgroundImage.value
});

const irParaLogin = () => {
    logout();
    router.push('/Login');
};
</script>

<template>
    <div class="h-screen flex w-full">
        <div class="flex flex-1 flex-column surface-ground justify-content-center">
            <div class="flex justify-content-center">
                <img src="/erp/images/pages/accessDenied.png" alt="" />
            </div>
            <div class="flex flex-column gap-2 align-items-center">
                <h1 class="m-0 text-orange-600 font-semibold">ACESSO NEGADO!</h1>
                <span class="text-700">O Sistema ficou sem uso e por segurança seu acesso foi encerrado.</span>
                <span class="text-700">Favor realizar o Login novamente.</span>
            </div>
            <div class="flex justify-content-center mt-6">
                <Button type="button" label="VOLTAR AO LOGIN" @click="irParaLogin" class="bg-indigo-500 text-white" text></Button>
            </div>
        </div>
        <div :style="backgroundStyle" class="hidden lg:flex flex-1 align-items-center justify-content-center bg-cover">
            <img src="/layout/images/logo/vector_logo.png" alt="" />
        </div>
    </div>
</template>
