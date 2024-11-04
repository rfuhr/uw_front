export const menu = [
    {
        label: 'Dashboard',
        icon: 'fa fa-check',
        items: [{ label: 'Dashboard', icon: '', to: '/compra/dashboard' }]
    },
    {
        label: 'Solicitação',
        icon: 'pi pi-fw pi-table',
        items: [
            { label: 'Solicitação de Item', icon: '', to: '/compra/solicitacao/solicitacao-item' }
        ]
    },
    {
        label: 'Cotação',
        icon: 'pi pi-fw pi-table',
        items: [
            { label: 'Cotação', icon: '', to: '/compra/cotacao/cotacao-item' },
            { label: 'Mapa de Cotação', icon: '', to: '/compra/cotacao/mapa-cotacao' }
        ]
    },
    {
        label: 'Configurações',
        icon: 'pi pi-fw pi-cog',
        items: [
            {
                label: 'Autorizações', 
                icon: '',
                items: [
                    {label: 'Solicitação', icon: '', to: '/compra/configuracoes/autorizacao/solicitacao'},
                ]
            },
        ]
    },
    {
        label: 'Tabelas',
        icon: 'pi pi-fw pi-table',
        items: [
            { label: 'Item Simplificado', icon: '', to: '/compra/tabela/item-simplificado' }
        ]
    },
];
