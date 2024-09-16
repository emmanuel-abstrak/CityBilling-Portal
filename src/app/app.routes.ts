import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';
import { loginResolver } from '@resolvers/login.resolver';
import { NotFoundComponent } from '@views/errors/not-found/not-found.component';
import { MainComponent } from '@views/layouts/main/main.component';
import { PlainComponent } from '@views/layouts/plain/plain.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [authGuard],
        loadChildren: () =>
            import('./views/pages/pages.routes').then((m) => m.PagesRoutes),
    },
    {
        path: '',
        component: PlainComponent,
        resolve: {
            ready: loginResolver,
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./views/pages/auth/auth.routes').then(
                        (m) => m.AuthRoutes
                    ),
            },
        ],
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];
