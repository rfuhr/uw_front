<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const novaNFe = () => {
    router.push({name: 'fis-nfe-nova'})
}   

</script>

<template>
    <div> 
        <h1>Gerenciador NFe</h1>
        <Button label="Nova NFe" icon="pi pi-plus" @click="novaNFe()" />
    </div>
</template>

