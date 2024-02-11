<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();


const backgroundImage = ref('url(/erp/images/pages/accessDenied-bg.jpg)');
const backgroundStyle = ref({
    background: backgroundImage.value
});

const voltarSistema = () => {
    router.back();
};
</script>

<template>
    <div class="h-screen flex w-full">
        <div class="flex flex-1 flex-column surface-ground justify-content-center">
            <div class="flex justify-content-center">
                <img src="/erp/images/pages/accessDenied.png" alt="" />
            </div>
            <div class="flex flex-column gap-2 align-items-center">
                <h1 class="m-0 text-orange-600 font-semibold">SEM PERMISSÃO!</h1>
                <span class="text-700">Infelizmente não identificamos permissão para seu acesso a esta funcionalidade.</span>
                <span class="text-700">Verifique com o administrador do sistema.</span>
            </div>
            <div class="flex justify-content-center mt-6">
                <Button type="button" label="VOLTAR AO SISTEMA" @click="voltarSistema" class="bg-indigo-500 text-white" text></Button>
            </div>
        </div>
        <div :style="backgroundStyle" class="hidden lg:flex flex-1 align-items-center justify-content-center bg-cover">
            <img src="/layout/images/logo/vector_logo.png" alt="" />
        </div>
    </div>
</template>
