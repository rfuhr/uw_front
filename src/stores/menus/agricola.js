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
            {label: 'Balança', icon: '', to: '/agricola/configuracoes/balanca'},
            {label: 'Configuração de Classificação', icon: '', to: '/agricola/configuracoes/config-classificacao-agricola'},
        ]
    },    
    {
        label: 'Tabelas', 
        icon: 'pi pi-fw pi-table',
        items: [
            {label: 'Tipo de Classificação', icon: '', to: '/agricola/tabela/tipo-classificacao-agricola'},
            {label: 'Safra', icon: '', to: '/agricola/tabela/safra'},
        ]
    },  
    {
        label: 'Movimentações',
        icon: 'pi pi-fw pi-pencil',
        items: [
            {label: 'Pesagem', icon: '', to: '/agricola/movimento/pesagem'},
        ]
    }
];