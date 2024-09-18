import AppLayout from '@/layout/AppLayout.vue';

const agricolaRouter = {
    path: '/agricola',
    component: AppLayout,
    redirect: '/agricola/dashboard',
    name: 'agricola',
    meta: {
        breadcrumb: [{ label: 'Agrícola' }],
        pathBase: 'agricola'
    },
    children: [
        {
            path: 'dashboard',
            component: () => import('../../views/agricola/Dashboard.vue'),
            name: 'agricola-dashboard',
            meta: {
                breadcrumb: [{ parent: 'Agrícola', label: 'Dashboard' }]
            }
        },
        {
            path: 'configuracoes',
            name: 'agricola-configuracoes',
            meta: {
                breadcrumb: [{ parent: 'Agrícola', label: 'Configurações' }]
            },
            children: [
                {
                    path: 'balanca',
                    component: () => import('../../views/agricola/configuracoes/balanca/Balanca.vue'),
                    name: 'agricola-configuracoes-balanca',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Balança' }],
                        tag: 'balanca',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'config-classificacao-agricola',
                    component: () => import('../../views/agricola/configuracoes/configClassificacaoAgricola/ConfigClassificacaoAgricola.vue'),
                    name: 'agricola-configuracoes-config-classificacao-agricola',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Configuração de Classificação' }],
                        tag: 'configClassificacaoAgricola',
                        operacao: 'consultar'
                    }
                }
            ]
        },   
        {
            path: 'tabela',
            name: 'agricola-tabela',
            meta: {
                breadcrumb: [{ parent: 'Agrícola', label: 'Tabela' }]
            },
            children: [
                {
                    path: 'tipo-classificacao-agricola',
                    component: () => import('../../views/agricola/tabela/tipoClassificacaoAgricola/TipoClassificacaoAgricola.vue'),
                    name: 'agricola-tabela-tipoClassificacao',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Tipo de Classificação' }],
                        tag: 'tipoclassificacaoagricola',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'safra',
                    component: () => import('../../views/agricola/tabela/safra/Safra.vue'),
                    name: 'agricola-tabela-safra',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Safra' }],
                        tag: 'safra',
                        operacao: 'consultar'
                    }
                },
            ]
        },   
        {
            path: 'movimento',
            name: 'agricola-movimentos',
            meta: {
                breadcrumb: [{ parent: 'Agrícola', label: 'Movimentação' }]
            },
            children: [
                {
                    path: 'pesagem',
                    name: 'agricola-movimento-pesagem',
                    redirect: '/agricola/movimento/pesagem/listagem',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Pesagem' }]
                    },

                    children: [
                        {
                            path: '',
                            component: () => import('@/views/agricola/movimento/pesagem/PesagemListagem.vue'),
                            name: 'agricola-movimento-pesagem-listagem',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Pesagem' }],
                                tag: 'pesagem',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'nova',
                            component: () => import('@/views/agricola/movimento/pesagem/ManutencaoPesagem.vue'),
                            name: 'agricola-movimento-pesagem-nova',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Pesagem' }, { label: 'Novo' }],
                                tag: 'pesagem',
                                operacao: 'inserir'
                            }
                        },
                        {
                            path: ':id(\\d+)',
                            component: () => import('@/views/agricola/movimento/pesagem/ManutencaoPesagem.vue'),
                            name: 'agricola-movimento-pesagem-editar',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Pesagem' }, { label: 'Editar' }],
                                tag: 'pesagem',
                                operacao: 'alterar'
                            },
                        },
                    ]
                },
            ]
        }
    ]
};

export default agricolaRouter;
