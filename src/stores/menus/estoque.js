export const menu = [
    {
        label: 'Dashboard', 
        icon: 'fa fa-check',
        items: [
            {label: 'Dashboard', icon: '', to: '/estoque/dashboard'},
        ]
    },
    {
        label: 'Cadastros', 
        icon: 'pi pi-fw pi-table',
        items: [
            {label: 'Classificação Comercial', icon: '', to: '/estoque/cadastro/classificacao-comercial'},
            {label: 'Grupo Contábil', icon: '', to: '/estoque/cadastro/grupo-contabil'},
            {label: 'Item', icon: '', to: '/estoque/cadastro/item'},
            {label: 'Linha', icon: '', to: '/estoque/cadastro/linha'},
            {label: 'Local do Estoque', icon: '', to: '/estoque/cadastro/local-estoque'},
            {label: 'Marca', icon: '', to: '/estoque/cadastro/marca'},
            {label: 'Tipo de Local de Estoque', icon: '', to: '/estoque/cadastro/tipo-local-estoque'},
        ]
    },    
    {
        label: 'Configurações', 
        icon: 'pi pi-fw pi-cog',
        items: [
            {label: 'Validação Departamento x Grupo Contábil', icon: '', to: '/estoque/configuracoes/validacao-departamento-grupo-contabil'},
        ]
    },
    {
        label: 'Relatórios', 
        icon: 'pi pi-fw pi-print',
        items: [
            {label: 'Posição de Estoque Físico/Financeiro', icon: '', to: '/estoque/relatorio/posicao-fisico-financeira'},
            {label: 'Razão do Estoque', icon: '', to: '/estoque/relatorio/razao-estoque'},
        ]
    },    
  
];