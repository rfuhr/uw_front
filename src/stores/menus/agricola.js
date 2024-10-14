export const menu = [
    {
        label: 'Dashboard', 
        icon: 'fa fa-check',
        items: [
            {label: 'Dashboard', icon: '', to: '/agricola/dashboard'},
        ]
    },
    {
        label: 'Configurações', 
        icon: 'pi pi-fw pi-cog',
        items: [
            {
                label: 'Classificação', 
                icon: '',
                items: [
                    {label: 'Validação de Produto', icon: '', to: '/agricola/configuracoes/classificacao/validacao-produto'},
                ]
            },
            {
                label: 'Operação', 
                icon: '',
                items: [
                    {label: 'Validação de Operação Interna', icon: '', to: '/agricola/configuracoes/operacao/validacao-operacao-interna'},
                ]
            },
            {
                label: 'Cálculo', 
                icon: '',
                items: [
                    {label: 'Ordem de Cálculo', icon: '', to: '/agricola/configuracoes/calculo/ordem-calculo'},
                    {label: 'Compl. Ordem de Cálculo', icon: '', to: '/agricola/configuracoes/calculo/compl-ordem-calculo'},
                    {label: 'Taxa de Cálculo', icon: '', to: '/agricola/configuracoes/calculo/taxa-calculo'},
                    {label: 'Validação de Cálculo', icon: '', to: '/agricola/configuracoes/calculo/validacao-calculo'},
                ]
            },
            {
                label: 'Precificação', 
                icon: '',
                items: [
                    {label: 'Preço Agrícola', icon: '', to: '/agricola/configuracoes/precificacao/preco-agricola'},
                    {label: 'Validação de Preço Agrícola x Produto', icon: '', to: '/agricola/configuracoes/precificacao/valida-preco-agricola-produto'},
                ]
            }
        ]
    },    
    {
        label: 'Tabelas', 
        icon: 'pi pi-fw pi-table',
        items: [
            {
                label: 'Cálculo', 
                icon: '',
                items: [
                    {label: 'Tipo de Cálculo', icon: '', to: '/agricola/tabela/calculo/tipo-calculo'},
                ]
            },
            {
                label: 'Classificação', 
                icon: '',
                items: [
                    {label: 'Melhoria', icon: '', to: '/agricola/tabela/classificacao/melhoria'},
                    {label: 'Grupo de Classificação', icon: '', to: '/agricola/tabela/classificacao/grupo-classificacao'},
                    {label: 'Item de Classificação', icon: '', to: '/agricola/tabela/classificacao/item-classificacao'},
                    {label: 'Sub. Item de Classificação', icon: '', to: '/agricola/tabela/classificacao/sub-item-classificacao'},
                ]
            },
            {
                label: 'Contrato', 
                icon: '',
                items: [
                    {label: 'Tipo de Contrato', icon: '', to: '/agricola/tabela/contrato/tipo-contrato'},
                    {label: 'Finalidade de Contrato', icon: '', to: '/agricola/tabela/contrato/finalidade-contrato'},
                ]
            },
            {
                label: 'Operação', 
                icon: '',
                items: [
                    {label: 'Grupo de Operação', icon: '', to: '/agricola/tabela/operacao/grupo-operacao'},
                ]
            },
            {
                label: 'Precificação', 
                icon: '',
                items: [
                    {label: 'Tipo de Preço', icon: '', to: '/agricola/tabela/precificacao/tipo-preco'},
                    {label: 'Predefinição de Preço', icon: '', to: '/agricola/tabela/precificacao/predefinicao-preco'},
                ]
            },
            {
                label: 'Gerais', 
                icon: '',
                items: [
                    {label: 'Balança', icon: '', to: '/agricola/tabela/gerais/balanca'},
                    {label: 'Origem de Produção', icon: '', to: '/agricola/tabela/gerais/origem-producao'},                    
                    {label: 'Safra', icon: '', to: '/agricola/tabela/safra'},
                ]
            },
        ]
    },  
    {
        label: 'Movimentações',
        icon: 'pi pi-fw pi-pencil',
        items: [
            {label: 'Contrato', icon: '', to: '/agricola/movimento/contrato'},
            {label: 'Romaneio', icon: '', to: '/agricola/movimento/romaneio'},
            {label: 'Fixação', icon: '', to: '/agricola/movimento/fixacao'},
        ]
    }
];