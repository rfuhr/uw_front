export const menu = [
    {
        label: 'Dashboard',
        icon: 'fa fa-check',
        items: [{ label: 'Dashboard', icon: '', to: '/financeiro/dashboard' }]
    },

    {
        label: 'Movimentações',
        icon: 'pi pi-fw pi-pencil',
        items: [
            {
                label: 'Contas Pagar e Receber',
                icon: '',
                items: [
                    { label: 'Lançamento', icon: '', to: '/financeiro/movimento/lancamento' },
                    { label: 'Baixa', icon: '', to: '/financeiro/movimento/baixa' },
                    { label: 'Estorno', icon: '', to: '/financeiro/movimento/estorno' },
                    { label: 'Consulta', icon: '', to: '/financeiro/movimento/consulta' },
                    { label: 'Substituição de Carteira', icon: '', to: '/financeiro/movimento/substituicao-carteira' },
                    { label: 'Negociação', icon: '', to: '/financeiro/movimento/negociacao' }
                ]
            },
            {
                label: 'Caixas e Bancos',
                icon: '',
                items: [
                    { label: 'Lançamento', icon: '', to: '/financeiro/movimento/lancamento-caixa-banco' },
                    { label: 'Saldos', icon: '', to: '/financeiro/movimento/saldo-caixa-banco' }
                ]
            }
        ]
    },

    {
        label: 'Cheques',
        icon: 'pi pi-fw pi-wallet',
        items: []
    },
    {
        label: 'Cartões',
        icon: 'pi pi-fw pi-credit-card',
        items: []
    },
    {
        label: 'Boletos',
        icon: 'pi pi-fw pi-inbox',
        items: []
    },
    {
        label: 'Pagamento de Fornecedores',
        icon: 'pi pi-fw pi-money-bill',
        items: []
    },
    {
        label: 'Tabelas',
        icon: 'pi pi-fw pi-table',
        items: [
            {
                label: 'Contas Pagar e Receber',
                icon: '',
                items: [
                    { label: 'Tipo de Título', icon: '', to: '/financeiro/tabela/tipo-titulo' },
                    { label: 'Característica de Movimento', icon: '', to: '/financeiro/tabela/caracteristica-movimento-financeiro' },
                    { label: 'Carteira Financeira', icon: '', to: '/financeiro/tabela/carteira-financeira' },
                    { label: 'Fato Gerador', icon: '', to: '/financeiro/tabela/fato-gerador' },
                    { label: 'Grupo Financeiro', icon: '', to: '/financeiro/tabela/grupo-financeiro' },
                    { label: 'Tipo de Operação Financeiro', icon: '', to: '/financeiro/tabela/tipo-operacao-financeira' },
                    { label: 'Motivo de Estorno', icon: '', to: '/financeiro/tabela/motivo-estorno-financeiro' }
                ]
            },
            {
                label: 'Caixas e Bancos',
                icon: '',
                items: [
                    { label: 'Banco', icon: '', to: '/financeiro/tabela/banco' },
                    { label: 'Agência', icon: '', to: '/financeiro/tabela/agencia' },
                    { label: 'Conta', icon: '', to: '/financeiro/tabela/conta' },
                    { label: 'Tipo de Conta', icon: '', to: '/financeiro/tabela/tipo-conta-cxbco' },
                    { label: 'Operação', icon: '', to: '/financeiro/tabela/operacao-caixa-banco' }
                ]
            }
        ]
    },
    {
        label: 'Relatórios',
        icon: 'pi pi-fw pi-print',
        items: [
            {
                label: 'Contas Pagar e Receber',
                icon: '',
                items: [
                    { label: 'Apuração Financeira', icon: '', to: '/financeiro/relatorios/apuracao-financeira' },
                    { label: 'Diário', icon: '', to: '/financeiro/relatorios/diario' },
                    { label: 'Documento de Baixa', icon: '', to: '/financeiro/relatorios/documento-baixa' },
                    { label: 'Ficha Financeira', icon: '', to: '/financeiro/relatorios/ficha-financeira' },
                    {
                        label: 'Posição de Título',
                        icon: '',
                        items: [
                            { label: 'Adiantamentos / Devoluções', icon: '', to: '/financeiro/relatorio/adiantamento-devolucao-aberto' },
                            { label: 'Em Aberto', icon: '', to: '/financeiro/relatorio/posicao-titulo-aberto' },
                            { label: 'Baixados', icon: '', to: '/financeiro/relatorio/posicao-titulo-baixados' },
                            { label: 'Por Vencimento', icon: '', to: '/financeiro/relatorio/posicao-titulo-aberto-vencimento' },
                            { label: 'Sintético', icon: '', to: '/financeiro/relatorio/sintetico-geral' },
                            { label: 'Sintético em Aberto', icon: '', to: '/financeiro/relatorios/sintetico-aberto' },
                            { label: 'Sintético Vencidos', icon: '', to: '/financeiro/relatorios/adiantamento-devolucao' }
                        ]
                    },
                    {
                        label: 'Outros',
                        icon: '',
                        items: [
                            { label: 'Substituição de Carteira', icon: '', to: '/financeiro/relatorios/adiantamento-devolucao' },
                            { label: 'Estornados', icon: '', to: '/financeiro/relatorios/adiantamento-devolucao' }
                        ]
                    }
                ]
            },
            {
                label: 'Caixas e Bancos',
                icon: '',
                items: [
                    { label: 'Diário', icon: '', to: '/financeiro/relatorios/diario' },
                    { label: 'Extrato Bancário', icon: '', to: '/financeiro/relatorios/documento-baixa' },
                    { label: 'Lançamentos', icon: '', to: '/financeiro/relatorios/ficha-financeira' },
                    { label: 'Movimento de Caixa', icon: '', to: '/financeiro/relatorios/ficha-financeira' },
                    { label: 'Saldos', icon: '', to: '/financeiro/relatorios/ficha-financeira' }
                ]
            }
        ]
    },
    {
        label: 'Suporte',
        icon: 'pi pi-fw pi-phone',
        items: [
            {
                label: 'Contas Pagar e Receber',
                icon: '',
                items: [
                    { label: 'Reparcelar', icon: '', to: '/financeiro/movimento/lancamento' },
                    { label: 'Alterar Vencimento', icon: '', to: '/financeiro/movimento/baixa' }
                ]
            }
        ]
    },
    {
        label: 'Configurações',
        icon: 'pi pi-fw pi-cog',
        items: [
            { label: 'Classificação Financeira', to: '/financeiro/configuracao/classificacao-financeira' },
            { label: 'Parâmetros Financeiro', to: '/financeiro/configuracao/parametro-financeiro' },
        ]
    }
];
