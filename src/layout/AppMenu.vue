<script setup>
import AppMenuItem from './AppMenuItem.vue';
import { useMenu} from '../stores';

const menu = useMenu()

</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in menu.getMenuByModulo()" :key="item">
            <AppMenuItem :item="item" root :index="i" />

            <li class="menu-separator"></li>
        </template>
    </ul>
</template>
