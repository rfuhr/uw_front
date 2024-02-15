import { defineStore } from 'pinia'
import { useContexto } from './ContextoStore'

import { menu as menuAdmin } from './menus/admin'
import { menu as menuFinanceiro } from './menus/financeiro'
import { menu as menuFiscal } from './menus/fiscal'
import { menu as menuEstoque } from './menus/estoque'

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
        if (contexto.getPathModuloSelecionado === 'estoque') {
            return menuEstoque;
        }
        
    }

    return {
        getMenuByModulo
    }
})
