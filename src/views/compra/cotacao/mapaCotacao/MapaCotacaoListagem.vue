<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToGerarMapaCotacao = () => {
    router.push({ name: 'compra-cotacao-mapa-cotacao-novo' })
}

</script>

<template>
    <div>
        <h1>Mapa de Cotação</h1>
        <button @click="goToGerarMapaCotacao">Gerar Mapa de Cotação</button>
    </div>
</template>