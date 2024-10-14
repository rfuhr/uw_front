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
                    path: 'classificacao',
                    name: 'agricola-configuracoes-classificacao',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Classificação' }],
                    },
                    children: [
                        {
                            path: 'validacao-produto',
                            component: () => import('../../views/agricola/configuracoes/classificacao/validaItemClassificacaoAgricola/ValidaItemClassificacaoAgricola.vue'),
                            name: 'agricola-configuracoes-classificacao-validacao-produto',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Classificação' }, { label: 'Validação de Produto' }],
                                tag: 'validaitemclassificacaoagricola',
                                operacao: 'consultar'
                            }
                        }                        
                    ]
                },
                {
                    path: 'operacao',
                    name: 'agricola-configuracoes-operacao',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Operação' }],
                    },
                    children: [
                        {
                            path: 'validacao-operacao-interna',
                            component: () => import('../../views/agricola/configuracoes/operacao/validaOperacaoInternaAgricola/ValidaOperacaoInternaAgricola.vue'),
                            name: 'agricola-configuracoes-operacao-validacao-operacao-interna',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Operação' }, { label: 'Validação de Operação Interna' }],
                                tag: 'validaitemclassificacaoagricola',
                                operacao: 'consultar'
                            }
                        }                        
                    ]
                },
                {
                    path: 'calculo',
                    name: 'agricola-configuracoes-calculo',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Cálculo' }],
                    },
                    children: [
                        {
                            path: 'ordem-calculo',
                            component: () => import('../../views/agricola/configuracoes/calculo/ordemCalculoAgricola/OrdemCalculoAgricola.vue'),
                            name: 'agricola-configuracoes-calculo-ordem-calculo',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Cálculo' }, { label: 'Ordem de Cálculo' }],
                                tag: 'ordemcalculoagricola',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'compl-ordem-calculo',
                            component: () => import('../../views/agricola/configuracoes/calculo/complOrdemCalculoAgricola/ComplOrdemCalculoAgricola.vue'),
                            name: 'agricola-configuracoes-calculo-compl-ordem-calculo',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Cálculo' }, { label: 'Compl. da Ordem de Cálculo' }],
                                tag: 'complordemcalculoagricola',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'taxa-calculo',
                            component: () => import('../../views/agricola/configuracoes/calculo/taxaCalculoAgricola/TaxaCalculoAgricola.vue'),
                            name: 'agricola-configuracoes-calculo-taxa-calculo',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Cálculo' }, { label: 'Taxa de Cálculo' }],
                                tag: 'ordemcalculoagricola',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'validacao-calculo',
                            component: () => import('../../views/agricola/configuracoes/calculo/validaCalculoAgricola/ValidaCalculoAgricola.vue'),
                            name: 'agricola-configuracoes-classificacao-validacao-operacao-interna',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Cálculo' }, { label: 'Validação de Cálculo Agrícola' }],
                                tag: 'validacalculoagricola',
                                operacao: 'consultar'
                            }
                        }                               
                    ]
                },
                {
                    path: 'precificacao',
                    name: 'agricola-configuracoes-precificacao',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Precificação' }],
                    },
                    children: [
                        {
                            path: 'preco-agricola',
                            component: () => import('../../views/agricola/configuracoes/precificacao/precoAgricola/PrecoAgricola.vue'),
                            name: 'agricola-configuracoes-precificacao-preco-agricola',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Precificação' }, { label: 'Preço Agrícola' }],
                                tag: 'precoagricola',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'valida-preco-agricola-produto',
                            component: () => import('../../views/agricola/configuracoes/precificacao/validaPrecoAgricolaProduto/ValidaPrecoAgricolaProduto.vue'),
                            name: 'agricola-configuracoes-precificacao-valida-preco-agricola-produto',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Configurações' }, { label: 'Precificação' }, { label: 'Valida Preço Agrícola x Produto' }],
                                tag: 'validaPrecoAgricolaProduto',
                                operacao: 'consultar'
                            }
                        }
                    ]
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
                    path: 'safra',
                    component: () => import('../../views/agricola/tabela/safra/Safra.vue'),
                    name: 'agricola-tabela-safra',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Safra' }],
                        tag: 'safra',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'calculo',
                    name: 'agricola-tabela-calculo',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Cálculo' }],
                    },
                    children: [
                        {
                            path: 'tipo-calculo',
                            component: () => import('../../views/agricola/tabela/calculo/tipoCalculo/TipoCalculoAgricola.vue'),
                            name: 'agricola-tabela-tipo-calculo',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Cálculo' }, { label: 'Tipo de Cálculo' }],
                                tag: 'tipocalculo',
                                operacao: 'consultar'
                            }
                        },
                    ]
                },
                {
                    path: 'classificacao',
                    name: 'agricola-tabela-classificacao',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Classificação' }],
                    },
                    children: [
                        {
                            path: 'melhoria',
                            component: () => import('../../views/agricola/tabela/classificacao/melhoriaAgricola/MelhoriaAgricola.vue'),
                            name: 'agricola-tabela-melhoria',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Classificação' }, { label: 'Melhoria' }],
                                tag: 'melhoriaagricola',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'item-classificacao',
                            component: () => import('../../views/agricola/tabela/classificacao/itemClassificacaoAgricola/ItemClassificacaoAgricola.vue'),
                            name: 'agricola-tabela-item-classificacao',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Classificação' }, { label: 'Item de Classificação' }],
                                tag: 'itemclassificacaoagricola',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'grupo-classificacao',
                            component: () => import('../../views/agricola/tabela/classificacao/grupoClassificacaoAgricola/GrupoClassificacaoAgricola.vue'),
                            name: 'agricola-tabela-grupo-classificacao',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Classificação' }, { label: 'Grupo de Classificação' }],
                                tag: 'grupoclassificacaoagricola',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'sub-item-classificacao',
                            component: () => import('../../views/agricola/tabela/classificacao/subItemClassificacaoAgricola/SubItemClassificacaoAgricola.vue'),
                            name: 'agricola-tabela-sub-item-classificacao',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Classificação' }, { label: 'Sub. Item de Classificação' }],
                                tag: 'subitemclassificacaoagricola',
                                operacao: 'consultar'
                            }
                        },                        
                    ]
                },
                {
                    path: 'contrato',
                    name: 'agricola-tabela-contrato',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Contrato' }],
                    },
                    children: [
                        {
                            path: 'tipo-contrato',
                            component: () => import('../../views/agricola/tabela/contrato/tipoContratoAgricola/TipoContratoAgricola.vue'),
                            name: 'agricola-tabela-tipo-contrato',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Contrato' }, { label: 'Tipo de Contrato' }],
                                tag: 'tipocontratoagricola',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'finalidade-contrato',
                            component: () => import('../../views/agricola/tabela/contrato/finalidadeContratoAgricola/FinalidadeContratoAgricola.vue'),
                            name: 'agricola-tabela-finalidade-contrato',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Contrato' }, { label: 'Finalidade de Contrato' }],
                                tag: 'finalidadecontratoagricola',
                                operacao: 'consultar'
                            }
                        },
                    ]
                },
                {
                    path: 'operacao',
                    name: 'agricola-tabela-operacao',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Operação' }],
                    },
                    children: [
                        {
                            path: 'grupo-operacao',
                            component: () => import('../../views/agricola/tabela/operacao/grupoOperacao/GrupoOperacaoAgricola.vue'),
                            name: 'agricola-tabela-operacao-grupo-operacao',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Operação' }, { label: 'Grupo de Operação' }],
                                tag: 'grupooperacaoagricola',
                                operacao: 'consultar'
                            }
                        },
                    ]
                },
                {
                    path: 'precificacao',
                    name: 'agricola-tabela-precificacao',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Precificação' }],
                    },
                    children: [
                        {
                            path: 'tipo-preco',
                            component: () => import('../../views/agricola/tabela/precificacao/tipoPrecoAgricola/TipoPrecoAgricola.vue'),
                            name: 'agricola-tabela-precificacao-tipo-preco',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Precificação' }, { label: 'Tipo de Preço' }],
                                tag: 'tipoprecoagricola',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'predefinicao-preco',
                            component: () => import('../../views/agricola/tabela/precificacao/predefinicaoPrecoAgricola/PredefinicaoPrecoAgricola.vue'),
                            name: 'agricola-tabela-precificacao-predefinicao-preco',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Precificação' }, { label: 'Predefinição de Preço' }],
                                tag: 'predefinicaoprecoagricola',
                                operacao: 'consultar'
                            }
                        }
                    ]
                },
                {
                    path: 'gerais',
                    name: 'agricola-tabela-gerais',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Gerais' }],
                    },
                    children: [
                        {
                            path: 'origem-producao',
                            component: () => import('../../views/agricola/tabela/gerais/origemProducaoAgricola/OrigemProducaoAgricola.vue'),
                            name: 'agricola-tabela-operacao-origem-producao',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Gerais' }, { label: 'Origem de Produção' }],
                                tag: 'origemproducaoagricola',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'balanca',
                            component: () => import('../../views/agricola/tabela/gerais/balanca/Balanca.vue'),
                            name: 'agricola-tabela-operacao-balanca',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Tabelas' }, { label: 'Gerais' }, { label: 'Balança' }],
                                tag: 'balanca',
                                operacao: 'consultar'
                            }
                        },                        
                    ]
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
                    path: 'romaneio',
                    name: 'agricola-movimento-romaneio',
                    redirect: '/agricola/movimento/romaneio/listagem',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Romaneio' }]
                    },

                    children: [
                        {
                            path: '',
                            component: () => import('@/views/agricola/movimento/romaneio/RomaneioListagem.vue'),
                            name: 'agricola-movimento-romaneio-listagem',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Romaneio' }],
                                tag: 'romaneio',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'novo',
                            component: () => import('@/views/agricola/movimento/romaneio/ManutencaoRomaneio.vue'),
                            name: 'agricola-movimento-romaneio-novo',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Romaneio' }, { label: 'Novo' }],
                                tag: 'romaneio',
                                operacao: 'inserir'
                            }
                        },
                        {
                            path: ':id(\\d+)',
                            component: () => import('@/views/agricola/movimento/romaneio/ManutencaoRomaneio.vue'),
                            name: 'agricola-movimento-romaneio-editar',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Romaneio' }, { label: 'Editar' }],
                                tag: 'romaneio',
                                operacao: 'alterar'
                            }
                        },
                    ]
                },
                {
                    path: 'fixacao',
                    name: 'agricola-movimento-fixacao',
                    redirect: '/agricola/movimento/fixacao/listagem',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Fixação' }]
                    },

                    children: [
                        {
                            path: '',
                            component: () => import('@/views/agricola/movimento/fixacao/FixacaoListagem.vue'),
                            name: 'agricola-movimento-fixacao-listagem',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Fixação' }],
                                tag: 'fixacao',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'nova',
                            component: () => import('@/views/agricola/movimento/fixacao/ManutencaoFixacao.vue'),
                            name: 'agricola-movimento-fixacao-nova',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Fixação' }, { label: 'Nova' }],
                                tag: 'fixacao',
                                operacao: 'inserir'
                            }
                        },
                        // {
                        //     path: ':id(\\d+)',
                        //     component: () => import('@/views/agricola/movimento/romaneio/ManutencaoRomaneio.vue'),
                        //     name: 'agricola-movimento-romaneio-editar',
                        //     meta: {
                        //         breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Romaneio' }, { label: 'Editar' }],
                        //         tag: 'romaneio',
                        //         operacao: 'alterar'
                        //     }
                        // },
                    ]
                },
                {
                    path: 'contrato',
                    name: 'agricola-movimento-contrato',
                    redirect: '/agricola/movimento/contrato/listagem',
                    meta: {
                        breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Contrato' }]
                    },

                    children: [
                        {
                            path: '',
                            component: () => import('@/views/agricola/movimento/contrato/ContratoListagem.vue'),
                            name: 'agricola-movimento-contrato-listagem',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Contrato' }],
                                tag: 'contrato',
                                operacao: 'consultar'
                            }
                        },
                        {
                            path: 'nova',
                            component: () => import('@/views/agricola/movimento/contrato/ManutencaoContrato.vue'),
                            name: 'agricola-movimento-contrato-novo',
                            meta: {
                                breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Contrato' }, { label: 'Novo' }],
                                tag: 'contrato',
                                operacao: 'inserir'
                            }
                        },
                        // {
                        //     path: ':id(\\d+)',
                        //     component: () => import('@/views/agricola/movimento/romaneio/ManutencaoRomaneio.vue'),
                        //     name: 'agricola-movimento-romaneio-editar',
                        //     meta: {
                        //         breadcrumb: [{ label: 'Agrícola' }, { label: 'Movimentação' }, { label: 'Romaneio' }, { label: 'Editar' }],
                        //         tag: 'romaneio',
                        //         operacao: 'alterar'
                        //     }
                        // },
                    ]
                },
            ]
        }
    ]
};

export default agricolaRouter;
