import AppLayout from '@/layout/AppLayout.vue';

const fiscalRouter = {
    path: '/fiscal',
    component: AppLayout,
    redirect: '/fiscal/dashboard',
    name: 'fis',
    meta: {
        breadcrumb: [{ label: 'Fiscal' }],
        pathBase: 'fis'
    },
    children: [
        {
            path: 'dashboard',
            component: () => import('../../views/fiscal/Dashboard.vue'),
            name: 'fin-dashboard',
            meta: {
                breadcrumb: [{ parent: 'Fiscal', label: 'Dashboard' }]
            }
        },
        {
            path: 'tabela',
            name: 'fis-tabela',
            meta: {
                breadcrumb: [{ parent: 'Fiscal', label: 'Tabela' }]
            },
            children: [
                {
                    path: 'grupo-tributacao',
                    component: () => import('../../views/fiscal/tabela/grupoTributacao/GrupoTributacao.vue'),
                    name: 'fis-tabela-grupotributacao',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Grupo Tributação' }],
                        tag: 'grupotributacao',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'ncm',
                    component: () => import('../../views/fiscal/tabela/ncm/Ncm.vue'),
                    name: 'fis-tabela-ncm',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'NCM' }],
                        tag: 'ncm',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'regime-tributario',
                    component: () => import('../../views/fiscal/tabela/regimeTributario/RegimeTributario.vue'),
                    name: 'fis-tabela-regimetributario',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Regime Tributário' }],
                        tag: 'regimetributario',
                        operacao: 'consultar'
                    }
                }
            ]
        }
    ]
};

export default fiscalRouter;
