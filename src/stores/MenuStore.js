import { defineStore } from 'pinia'
import { useContexto } from './ContextoStore'

import { menu as menuAdmin } from './menus/admin'
import { menu as menuFinanceiro } from './menus/financeiro'

export const useMenu = defineStore('menu', () => {

    const contexto = useContexto();
    
    const getMenuByModulo = () => {
        if (contexto.getPathModuloSelecionado === 'admin') {
            return menuAdmin;
        }
        if (contexto.getPathModuloSelecionado === 'financeiro') {
            return menuFinanceiro;
        }
        
    }

    return {
        getMenuByModulo
    }
})