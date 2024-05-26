import AppLayout from '@/layout/AppLayout.vue';

const comercialRouter = {
    path: '/comercial',
    component: AppLayout,
    redirect: '/comercial/dashboard',
    name: 'comercial',
    meta: {
        breadcrumb: [{ label: 'Comercial' }],
        pathBase: 'comercial'
    },
    children: [
        {
            path: 'dashboard',
            component: () => import('../../views/comercial/Dashboard.vue'),
            name: 'comercial-dashboard',
            meta: {
                breadcrumb: [{ parent: 'Comercial', label: 'Dashboard' }]
            }
        },
        {
            path: 'configuracoes',
            name: 'comercial-configuracoes',
            meta: {
                breadcrumb: [{ parent: 'Comercial', label: 'Configurações' }]
            },
            children: [
                {
                    path: 'config-calculo-preco',
                    component: () => import('../../views/comercial/configuracoes/configCalculoPreco/ConfigCalculoPreco.vue'),
                    name: 'comercial-configuracoes-configCalculoPreco',
                    meta: {
                        breadcrumb: [{ label: 'Comercial' }, { label: 'Configurações' }, { label: 'Configuração do Cálculo de Preços' }],
                        tag: 'configCalculoPreco',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'config-markup-item',
                    component: () => import('../../views/comercial/configuracoes/configMarkupItem/ConfigMarkupItem.vue'),
                    name: 'comercial-configuracoes-configMarkupItem',
                    meta: {
                        breadcrumb: [{ label: 'Comercial' }, { label: 'Configurações' }, { label: 'Configuração de Mark Up do Item' }],
                        tag: 'configMarkupItem',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'config-markup-plano-item',
                    component: () => import('../../views/comercial/configuracoes/configMarkupPlanoItem/ConfigMarkupPlanoItem.vue'),
                    name: 'comercial-configuracoes-configMarkupPlanoItem',
                    meta: {
                        breadcrumb: [{ label: 'Comercial' }, { label: 'Configurações' }, { label: 'Configuração de Mark Up do Plano de Classificação do Item' }],
                        tag: 'configMarkupPlanoItem',
                        operacao: 'consultar'
                    }
                },
            ]
        },        
        {
            path: 'tabela',
            name: 'comercial-tabela',
            meta: {
                breadcrumb: [{ parent: 'Comercial', label: 'Tabela' }]
            },
            children: [
                {
                    path: 'indice-markup',
                    component: () => import('../../views/comercial/tabela/indiceMarkup/IndiceMarkup.vue'),
                    name: 'comercial-tabela-indiceMarkup',
                    meta: {
                        breadcrumb: [{ label: 'Comercial' }, { label: 'Tabelas' }, { label: 'Índice Mark Up' }],
                        tag: 'indicemarkup',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'tipo-preco',
                    component: () => import('../../views/comercial/tabela/tipoPreco/TipoPreco.vue'),
                    name: 'comercial-tabela-tipoPreco',
                    meta: {
                        breadcrumb: [{ label: 'Comercial' }, { label: 'Tabelas' }, { label: 'Tipo do Preço' }],
                        tag: 'tipopreco',
                        operacao: 'consultar'
                    }
                },
            ]
        },
        {
            path: 'movimento',
            name: 'comercial-movimentos',
            meta: {
                breadcrumb: [{ parent: 'Comercial', label: 'Movimentação' }]
            },
            children: []
        }
    ]
};

export default comercialRouter;
