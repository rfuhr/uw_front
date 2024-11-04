import { defineStore } from 'pinia'
import { useContexto } from './ContextoStore'

import { menu as menuAdmin } from './menus/admin'
import { menu as menuComercial } from './menus/comercial'
import { menu as menuFinanceiro } from './menus/financeiro'
import { menu as menuFiscal } from './menus/fiscal'
import { menu as menuEstoque } from './menus/estoque'
import { menu as menuAgricola } from './menus/agricola'
import { menu as menuCompra } from './menus/compra'

export const useMenu = defineStore('menu', () => {

    const contexto = useContexto();
    
    const getMenuByModulo = () => {
        if (contexto.getPathModuloSelecionado === 'admin') {
            return menuAdmin;
        }
        if (contexto.getPathModuloSelecionado === 'comercial') {
            return menuComercial;
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
        if (contexto.getPathModuloSelecionado === 'agricola') {
            return menuAgricola;
        }
        if (contexto.getPathModuloSelecionado === 'compra') {
            return menuCompra;
        }
        
    }

    return {
        getMenuByModulo
    }
})
