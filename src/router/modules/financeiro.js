import AppLayout from '@/layout/AppLayout.vue';

const adminRouter = {
    path: '/financeiro',
    component: AppLayout,
    redirect: '/financeiro/dashboard',
    name: 'fin',
    meta: {
        breadcrumb: [{ label: 'Financeiro' }],
        pathBase: 'fin'
    },
    children: [
        {
            path: 'dashboard',
            component: () => import('../../views/financeiro/Dashboard.vue'),
            name: 'fin-dashboard',
            meta: {
                breadcrumb: [{ parent: 'Financeiro', label: 'Dashboard' }]
            }
        },
        {
            path: 'movimento',
            name: 'fin-movimento',
            meta: {
                breadcrumb: [{ parent: 'Financeiro', label: 'Movimentações' }]
            },
            children: [
                {
                    path: 'lancamento',
                    component: () => import('../../views/financeiro/movimento/lancamento/Lancamento.vue'),
                    name: 'fin-movimento-lancamento',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentações' }, { label: 'Lançamento' }],
                        tag: 'lancamentofinanceiro',
                        operacao: 'consultar'
                    }
                },
            ]
        },
        {
            path: 'tabela',
            name: 'fin-tabela',
            meta: {
                breadcrumb: [{ parent: 'Financeiro', label: 'Tabela' }]
            },
            children: [
                {
                    path: 'caracteristica-movimento-financeiro',
                    component: () => import('../../views/financeiro/tabela/caracteristicaMovimentoFinanceiro/CaracteristicaMovimentoFinanceiro.vue'),
                    name: 'fin-tabela-caracteristicaMovimentoFinanceiro',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Característica de Movimento Financeiro' }],
                        tag: 'caracteristicamovimentofinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'carteira-financeira',
                    component: () => import('../../views/financeiro/tabela/carteiraFinanceira/CarteiraFinanceira.vue'),
                    name: 'fin-tabela-carteiraFinanceira',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Carteira Financeira' }],
                        tag: 'carteirafinanceira',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'tipo-titulo',
                    component: () => import('../../views/financeiro/tabela/tipoTitulo/TipoTitulo.vue'),
                    name: 'fin-tabela-tipoTitulo',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Tipo de Título' }],
                        tag: 'tipotitulo',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'fato-gerador',
                    component: () => import('../../views/financeiro/tabela/fatoGerador/FatoGerador.vue'),
                    name: 'fin-tabela-fatoGerador',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Fato Gerador' }],
                        tag: 'fatogerador',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'grupo-financeiro',
                    component: () => import('../../views/financeiro/tabela/grupoFinanceiro/GrupoFinanceiro.vue'),
                    name: 'fin-tabela-grupoFinanceiro',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Grupo Financeiro' }],
                        tag: 'grupofinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'tipo-operacao-financeira',
                    component: () => import('../../views/financeiro/tabela/tipoOperacaoFinanceira/TipoOperacaoFinanceira.vue'),
                    name: 'fin-tabela-tipooperacaofinanceira',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Tipo de Operação Financeira' }],
                        tag: 'tipooperacaofinanceira',
                        operacao: 'consultar'
                    }
                },
            ]
        }
    ]
};

export default adminRouter;
