import { defineStore } from 'pinia'
import _ from 'lodash'

export const useContexto = defineStore('contextoStore', {

    state: () => ({
            organograma: [], 
            contexto: {
                empresaId: 0,
                empresaFilialId: 0,
                moduloId: 0,
                moduloPathBase: ''
            },           
    }),    
    getters: {
        getPathModuloSelecionado: (state) => {
              return state.contexto.moduloPathBase
        },
        getListaEmpresasOrganograma: (state) => {
            const distinctList = _.uniqWith(state.organograma, (a, b) => a.empresaId === b.empresaId && a.empresaNome === b.empresaNome);
        
            // Mapeia a lista para manter apenas as propriedades empresaId e empresaNome
            return distinctList.map(item => {
                return {
                    empresaId: item.empresaId,
                    empresaNome: item.empresaNome
                };
            }).sort((a, b) => a.empresaNome.localeCompare(b.empresaNome));
        },
        getListaEmpresasFiliaisOrganograma: (state) => {
            return (paramEmpresaId) => {
            const empresa = state.organograma.find(el => el.empresaId === paramEmpresaId);
            return empresa && empresa.filiais.sort((a, b) => a.empresaFilialNome.localeCompare(b.empresaFilialNome)) || []
            }
        },        
        getNomeEmpresaContexto: (state) => {
            const empresa = state.organograma.find(e => e.empresaId === state.contexto.empresaId);
            return empresa && empresa.empresaNome || "";
        },
        getNomeEmpresaFilialContexto: (state) => {
            const empresa = state.organograma.find(e => e.empresaId === state.contexto.empresaId);
            if (empresa) {
                const empresaFilial = empresa.filiais.find(e => e.empresaFilialId === state.contexto.empresaFilialId)
                    return empresaFilial && empresaFilial.empresaFilialNome || "";
            } else {
                return "";
            }
        }                   
    },
    actions: {
        setContexto(contexto) {
            this.contexto = contexto
        },
        setOrganograma(organograma) {
            this.organograma = organograma
        }
    },
    persist: {
        enabled: true
    }    
});