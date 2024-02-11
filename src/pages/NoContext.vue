<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores';

const router = useRouter();
const { logout } = useAuth();

const backgroundImage = ref('url(/erp/images/pages/error-bg.jpg)');
const backgroundStyle = ref({
    background: backgroundImage.value
});

const sair = () => {
    logout()
    router.push('/');
};
</script>

<template>
    <div class="h-screen surface-ground flex w-full">
        <div class="flex flex-1 flex-column surface-ground justify-content-center">
            <div class="flex justify-content-center mb-4">
                <img src="/erp/images/pages/error2.png" alt="" />
            </div>
            <div class="flex flex-column gap-2 align-items-center">
                <h1 class="m-0 text-pink-500 font-semibold">ACESSO NEGADO</h1>
                <span class="text-700">Usuário não tem contexto definido para acesso ao sistema.</span>
                <span class="text-700">Entre em contato com administrador.</span>
            </div>
            <div class="flex justify-content-center mt-6">
                <Button label="SAIR" @click="sair" class="bg-indigo-500 text-white" text></Button>
            </div>
        </div>
        <div :style="backgroundStyle" class="hidden lg:flex flex-1 align-items-center justify-content-center bg-cover">
            <img src="/layout/images/logo/vector_logo.png" alt="" />
        </div>
    </div>
</template>
