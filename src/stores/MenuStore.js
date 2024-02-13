import { defineStore } from 'pinia'
import { useContexto } from './ContextoStore'

import { menu as menuAdmin } from './menus/admin'
import { menu as menuFinanceiro } from './menus/financeiro'
import { menu as menuFiscal } from './menus/fiscal'

export const useMenu = defineStore('menu', () => {

    const contexto = useContexto();
    
    const getMenuByModulo = () => {
        if (contexto.getPathModuloSelecionado === 'admin') {
            return menuAdmin;
        }
        if (contexto.getPathModuloSelecionado === 'financeiro') {
            return menuFinanceiro;
        }
        if (contexto.getPathModuloSelecionado === 'fiscal') {
            return menuFiscal;
        }
        
    }

    return {
        getMenuByModulo
    }
})