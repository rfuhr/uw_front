export const menu = [
    {
        label: 'Dashboard', 
        icon: 'fa fa-check',
        items: [
            {label: 'Dashboard', icon: '', to: '/comercial/dashboard'},
        ]
    },
    {
        label: 'Configurações', 
        icon: 'pi pi-fw pi-cog',
        items: [
            {label: 'Configuração do Cálculo de Preços', icon: '', to: '/comercial/configuracoes/config-calculo-preco'},
            {label: 'Configuração de Mark Up do Item', icon: '', to: '/comercial/configuracoes/config-markup-item'},
            {label: 'Configuração de Mark Up do Plano de Classificação do Item', icon: '', to: '/comercial/configuracoes/config-markup-plano-item'},
        ]
    },    
    {
        label: 'Tabelas', 
        icon: 'pi pi-fw pi-table',
        items: [
            {label: 'Índice de Mark Up', icon: '', to: '/comercial/tabela/indice-markup'},
            {label: 'Tipo do Preço', icon: '', to: '/comercial/tabela/tipo-preco'},
        ]
    },    
    {
        label: 'Movimentações', 
        icon: 'pi pi-fw pi-pencil',
        items: [
        ]
    },    
];