import AppLayout from '@/layout/AppLayout.vue';

const compraRouter = {
    path: '/compra',
    component: AppLayout,
    redirect: '/compra/dashboard',
    name: 'compra',
    meta: {
        breadcrumb: [{ label: 'Compras' }],
        pathBase: 'compra'
    },
    children: [
        {
            path: 'dashboard',
            component: () => import('../../views/compra/Dashboard.vue'),
            name: 'compra-dashboard',
            meta: {
                breadcrumb: [{ parent: 'Compras', label: 'Dashboard' }]
            }
        },
        {
            path: 'tabela',
            name: 'compra-tabela',
            meta: {
                breadcrumb: [{ parent: 'Compras', label: 'Tabela' }]
            },
            children: [
                {
                    path: 'item-simplificado',
                    component: () => import('../../views/compra/tabela/itemSimplificado/ItemSimplificado.vue'),
                    name: 'compra-tabela-item-simplificado',
                    meta: {
                        breadcrumb: [{ label: 'Compras' }, { label: 'Tabelas' }, { label: 'Item Simplificado' }],
                        tag: 'itemsimplificado',
                        operacao: 'consultar'
                    }
                },
            ]
        },   
        {
            path: 'solicitacao',
            name: 'compra-solicitacao',
            meta: {
                breadcrumb: [{ parent: 'Compras', label: 'Solicitações' }]
            },
            children: [
                {
                    path: 'solicitacao-item',
                    name: 'compra-solicitacao-solicitacao-item',
                    redirect: '/compra/solicitacao/solicitacao-item/listagem',
                    meta: {
                        breadcrumb: [{ label: 'Compras' }, { label: 'Solicitações' }, { label: 'Solicitação de Item' }]
                    },

                    children: [
                        {
                            path: '',
                            component: () => import('@/views/compra/solicitacao/solicitacaoItem/SolicitacaoItemListagem.vue'),
                            name: 'compra-solicitacao-soliticacao-item-listagem',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Solicitações' }, { label: 'Solicitação de Item' }],
                                tag: 'solicitacaoitem',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'novo',
                            component: () => import('@/views/compra/solicitacao/solicitacaoItem/ManutencaoSolicitacaoItem.vue'),
                            name: 'compra-solicitacao-solicitacao-item-nova',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Solicitações' }, { label: 'Solicitação de Item' }, { label: 'Nova' }],
                                tag: 'solicitacaoitem',
                                operacao: 'inserir'
                            }
                        },
                        {
                            path: ':id(\\d+)',
                            component: () => import('@/views/compra/solicitacao/solicitacaoItem/ManutencaoSolicitacaoItem.vue'),
                            name: 'compra-solicitacao-solicitacao-item-editar',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Solicitações' }, { label: 'Solicitação de Item' }, { label: 'Editar' }],
                                tag: 'solicitacaoitem',
                                operacao: 'alterar'
                            }
                        },
                        {
                            path: ':id(\\d+)/visualizar',
                            component: () => import('@/views/compra/solicitacao/solicitacaoItem/ManutencaoSolicitacaoItem.vue'),
                            name: 'compra-solicitacao-solicitacao-item-visualizar',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Solicitações' }, { label: 'Solicitação de Item' }, { label: 'Visualizar' }],
                                tag: 'solicitacaoitem',
                                operacao: 'consultar'
                            }
                        },
                    ]
                },
            ]
        },
        {
            path: 'cotacao',
            name: 'compra-cotacao',
            meta: {
                breadcrumb: [{ parent: 'Compras', label: 'Cotações' }]
            },
            children: [
                {
                    path: 'cotacao-item',
                    name: 'compra-cotacao-cotacao-item',
                    redirect: '/compra/cotacao/cotacao-item/listagem',
                    meta: {
                        breadcrumb: [{ label: 'Compras' }, { label: 'Cotações' }, { label: 'Cotação de Item' }]
                    },

                    children: [
                        {
                            path: '',
                            component: () => import('@/views/compra/cotacao/cotacaoItem/CotacaoItemListagem.vue'),
                            name: 'compra-cotacao-cotacao-item-listagem',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Cotações' }, { label: 'Cotação de Item' }],
                                tag: 'cotacaoitem',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'nova',
                            component: () => import('@/views/compra/cotacao/cotacaoItem/ManutencaoCotacaoItem.vue'),
                            name: 'compra-cotacao-cotacao-item-nova',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Cotações' }, { label: 'Cotação de Item' }, { label: 'Nova' }],
                                tag: 'cotacaoitem',
                                operacao: 'inserir'
                            }
                        },
                        {
                            path: ':id(\\d+)',
                            component: () => import('@/views/compra/cotacao/cotacaoItem/ManutencaoCotacaoItem.vue'),
                            name: 'compra-cotacao-cotacao-item-editar',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Cotações' }, { label: 'Cotação de Item' }, { label: 'Editar' }],
                                tag: 'cotacaoitem',
                                operacao: 'alterar'
                            }
                        },
                        // {
                        //     path: ':id(\\d+)/visualizar',
                        //     component: () => import('@/views/compra/solicitacao/solicitacaoItem/ManutencaoSolicitacaoItem.vue'),
                        //     name: 'compra-solicitacao-solicitacao-item-visualizar',
                        //     meta: {
                        //         breadcrumb: [{ label: 'Compras' }, { label: 'Solicitações' }, { label: 'Solicitação de Item' }, { label: 'Visualizar' }],
                        //         tag: 'solicitacaoitem',
                        //         operacao: 'consultar'
                        //     }
                        // },
                    ]
                },
                {
                    path: 'mapa-cotacao',
                    name: 'compra-cotacao-mapa-cotacao',
                    redirect: '/compra/cotacao/mapa-cotacao/listagem',
                    meta: {
                        breadcrumb: [{ label: 'Compras' }, { label: 'Cotações' }, { label: 'Mapa de Cotação' }]
                    },

                    children: [
                        {
                            path: '',
                            component: () => import('@/views/compra/cotacao/mapaCotacao/MapaCotacaoListagem.vue'),
                            name: 'compra-cotacao-mapa-cotacao-listagem',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Cotações' }, { label: 'Mapa de Cotação' }],
                                tag: 'mapacotacao',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'novo',
                            component: () => import('@/views/compra/cotacao/mapaCotacao/GerarMapaCotacao.vue'),
                            name: 'compra-cotacao-mapa-cotacao-novo',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Cotações' }, { label: 'Mapa de Cotação' }, { label: 'Novo' }],
                                tag: 'mapacotacao',
                                operacao: 'inserir'
                            }
                        },
                        // {
                        //     path: ':id(\\d+)/visualizar',
                        //     component: () => import('@/views/compra/solicitacao/solicitacaoItem/ManutencaoSolicitacaoItem.vue'),
                        //     name: 'compra-solicitacao-solicitacao-item-visualizar',
                        //     meta: {
                        //         breadcrumb: [{ label: 'Compras' }, { label: 'Solicitações' }, { label: 'Solicitação de Item' }, { label: 'Visualizar' }],
                        //         tag: 'solicitacaoitem',
                        //         operacao: 'consultar'
                        //     }
                        // },
                    ]
                },
                {
                    path: 'retorno-cotacao',
                    name: 'compra-cotacao-retorno-cotacao',
                    redirect: '/compra/cotacao/retorno-cotacao/listagem',
                    meta: {
                        breadcrumb: [{ label: 'Compras' }, { label: 'Cotações' }, { label: 'Retorno de Cotação' }]
                    },

                    children: [
                        {
                            path: '',
                            component: () => import('@/views/compra/cotacao/retornoCotacao/RetornoCotacaoListagem.vue'),
                            name: 'compra-cotacao-retorno-cotacao-listagem',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Cotações' }, { label: 'Retorno de Cotação' }],
                                tag: 'retornocotacao',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: ':cotacaomercadoriaid(\\d+)/:cotacaomercadoriaparceiroid(\\d+)',
                            component: () => import('@/views/compra/cotacao/retornoCotacao/ManutencaoRetornoCotacao.vue'),
                            name: 'compra-cotacao-retorno-cotacao-lancar',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Cotações' }, { label: 'Retorno de Cotação' }, { label: 'Novo' }],
                                tag: 'retornocotacao',
                                operacao: 'inserir'
                            }
                        },
                        // {
                        //     path: ':id(\\d+)/visualizar',
                        //     component: () => import('@/views/compra/solicitacao/solicitacaoItem/ManutencaoSolicitacaoItem.vue'),
                        //     name: 'compra-solicitacao-solicitacao-item-visualizar',
                        //     meta: {
                        //         breadcrumb: [{ label: 'Compras' }, { label: 'Solicitações' }, { label: 'Solicitação de Item' }, { label: 'Visualizar' }],
                        //         tag: 'solicitacaoitem',
                        //         operacao: 'consultar'
                        //     }
                        // },
                    ]
                },
            ]
        },
        {
            path: 'configuracoes',
            name: 'compra-configuracoes',
            meta: {
                breadcrumb: [{ parent: 'Compras', label: 'Configurações' }]
            },
            children: [
                {
                    path: 'autorizacao',
                    name: 'compra-configuracoes-autorizacao',
                    meta: {
                        breadcrumb: [{ label: 'Compras' }, { label: 'Configurações' }, { label: 'Autorização' }],
                    },
                    children: [
                        {
                            path: 'solicitacao',
                            component: () => import('../../views/compra/configuracoes/autorizacao/configAutorizacaoSolicitacaoMercadoria/ConfigAutorizacaoSolicitacaoMercadoria.vue'),
                            name: 'compra-configuracoes-autorizacao-solicitacao',
                            meta: {
                                breadcrumb: [{ label: 'Compras' }, { label: 'Configurações' }, { label: 'Autorização' }, { label: 'Configuração de Autorização para Solicitação' }],
                                tag: 'configautorizacaosolicitacaomercadoria',
                                operacao: 'consultar'
                            }
                        }                        
                    ]
                },
            ]
        },   
    ]
};

export default compraRouter;
