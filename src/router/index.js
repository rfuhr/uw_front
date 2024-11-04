import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { useAuth, useContexto } from '../stores';
import { adminRoutes, comercialRoutes, financeiroRoutes, fiscalRoutes, estoqueRoutes, agricolaRoutes, compraRoutes } from './routes';
import { UsuarioService } from '../service';

const constantRoutes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'Index',
                exact: true,
                component: () => import('@/pages/Index.vue')
            }
        ]
    },
    adminRoutes, comercialRoutes, financeiroRoutes, fiscalRoutes, estoqueRoutes, agricolaRoutes, compraRoutes,
    { path: '/login', name: 'Login', exact: true, component: () => import('../pages/Login.vue') },
    { path: '/notFound', name: 'NotFound', component: () => import('../pages/NotFound.vue') },
    { path: '/accessDenied', name: 'AccessDenied', component: () => import('../pages/AccessDenied.vue') },
    { path: '/noContext', name: 'NoContext', component: () => import('../pages/NoContext.vue') },
    { path: '/notPermission', name: 'NotPermission', component: () => import('../pages/NotPermission.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/notFound' }
];

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
    scrollBehavior() {
        return { left: 0, top: 0 };
    }
});

const publicPages = ['/login', '/noContext', '/notFound', '/accessDenied', '/notPermission'];

router.beforeEach(async (to, from, next) => {
    const auth = useAuth();
    const { contexto, getPathModuloSelecionado } = useContexto();

    const moduloPathBaseContexto = getPathModuloSelecionado;

    if (publicPages.indexOf(to.path) !== -1) {
        next();
    } else {
        if (auth.isAuthenticated) {
            if (to.meta.tag) {
                try {
                    await UsuarioService.checkPermissao(contexto.empresaId, contexto.empresaFilialId, to.meta.tag, to.meta.operacao);
                    next()
                } catch {
                    next({ name: 'NotPermission' });
                }
            } else {
                if (!moduloPathBaseContexto) {
                    if (to.path === '/') {
                        next();
                    } else {
                        next({ name: 'Index' });
                    }
                } else {
                    next();
                }
            }
        } else {
            auth.logout();
            next({ name: 'Login' });
        }
    }
});

export default router;
