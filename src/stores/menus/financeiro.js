export const menu = [
    {
        label: 'Dashboard', 
        icon: 'fa fa-check',
        items: [
            {label: 'Dashboard', icon: '', to: '/financeiro/dashboard'},
        ]
    },
    {
        label: 'Tabelas', 
        icon: 'pi pi-fw pi-table',
        items: [
            {label: 'Tipo de Título', icon: '', to: '/financeiro/tabela/tipo-titulo'},
            {label: 'Característica de Movimento', icon: '', to: '/financeiro/tabela/caracteristica-movimento-financeiro'},
            {label: 'Carteira Financeira', icon: '', to: '/financeiro/tabela/carteira-financeira'},
            {label: 'Fato Gerador', icon: '', to: '/financeiro/tabela/fato-gerador'},
            {label: 'Grupo Financeiro', icon: '', to: '/financeiro/tabela/grupo-financeiro'},
    //         {label: 'Tipo de Operação Financeiro', icon: '', to: '/financeiro/tabela/tipo-operacao-financeira'},
        ]
    },    
    {
        label: 'Movimentações', 
        icon: 'pi pi-fw pi-pencil',
        items: [
            {label: 'Lançamento', icon: '', to: '/financeiro/movimento/lancamento'},
            {label: 'Baixa', icon: '', to: '/financeiro/movimento/baixa'}
        ]
    },    
];