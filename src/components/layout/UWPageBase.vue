<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    title: {
        type:String,
        required: true
    },
    subtitle: {
        type: String,
        required: false
    }
})

</script>

<template>
    <div class="grid">
        <AppBreadCrumb></AppBreadCrumb>
        <div class="col-12">
            <div class="card">
                <h5>{{ title }}</h5>
                <p v-if="subtitle">{{ subtitle }}</p>
                <slot />
            </div>
        </div>
    </div>
    <Toast></Toast>
</template>