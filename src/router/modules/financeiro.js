import AppLayout from '@/layout/AppLayout.vue';

const financeiroRouter = {
    path: '/financeiro',
    component: AppLayout,
    redirect: '/financeiro/dashboard',
    name: 'financeiro',
    meta: {
        breadcrumb: [{ label: 'Financeiro' }],
        pathBase: 'financeiro'
    },
    children: [
        {
            path: 'dashboard',
            component: () => import('../../views/financeiro/Dashboard.vue'),
            name: 'financeiro-dashboard',
            meta: {
                breadcrumb: [{ parent: 'Financeiro', label: 'Dashboard' }]
            }
        },
        {
            path: 'tabela',
            name: 'financeiro-tabela',
            meta: {
                breadcrumb: [{ parent: 'Financeiro', label: 'Tabela' }]
            },
            children: [
                {
                    path: 'tipo-titulo',
                    component: () => import('../../views/financeiro/tabela/tipoTitulo/TipoTitulo.vue'),
                    name: 'financeiro-tabela-tipoTitulo',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Tipo de Título' }],
                        tag: 'tipotitulo',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'caracteristica-movimento-financeiro',
                    component: () => import('../../views/financeiro/tabela/caracteristicaMovimentoFinanceiro/CaracteristicaMovimentoFinanceiro.vue'),
                    name: 'financeiro-tabela-caracteristicaMovimentoFinanceiro',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Característica de Movimento' }],
                        tag: 'caracteristicamovimentofinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'carteira-financeira',
                    component: () => import('../../views/financeiro/tabela/carteiraFinanceira/CarteiraFinanceira.vue'),
                    name: 'financeiro-tabela-carteiraFinanceira',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Carteira Financeira' }],
                        tag: 'carteirafinanceira',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'grupo-financeiro',
                    component: () => import('../../views/financeiro/tabela/grupoFinanceiro/GrupoFinanceiro.vue'),
                    name: 'financeiro-tabela-grupoFinanceiro',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Grupo Financeiro' }],
                        tag: 'grupofinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'fato-gerador',
                    component: () => import('../../views/financeiro/tabela/fatoGerador/FatoGerador.vue'),
                    name: 'financeiro-tabela-fatoGerador',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Fato Gerador' }],
                        tag: 'fatogerador',
                        operacao: 'consultar'
                    }
                }
            ]
        },
        {
            path: 'movimento',
            name: 'financeiro-movimentos',
            meta: {
                breadcrumb: [{ parent: 'Financeiro', label: 'Movimentação' }]
            },
            children: [
                {
                    path: 'lancamento',
                    component: () => import('../../views/financeiro/movimento/lancamento/LancamentoFinanceiro.vue'),
                    name: 'financeiro-movimento-lancamento',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Lançamento' }],
                        tag: 'lancamento',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'baixa',
                    component: () => import('../../views/financeiro/movimento/baixa/BaixaFinanceiro.vue'),
                    name: 'financeiro-movimento-selecao-baixa',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Lançamento' }],
                        tag: 'lancamento',
                        operacao: 'consultar'
                    }
                }
            ]
        }
    ]
};

export default financeiroRouter;
