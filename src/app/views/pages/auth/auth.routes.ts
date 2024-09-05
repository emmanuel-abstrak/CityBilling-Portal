import { Routes } from '@angular/router';
import { LoginComponent } from '@views/pages/auth/login/login.component';
import { ForgotPasswordComponent } from '@views/pages/auth/forgot-password/forgot-password.component';
import { NewPasswordComponent } from '@views/pages/auth/new-password/new-password.component';

export const AuthRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
            },
            {
                path: 'new-password',
                component: NewPasswordComponent,
            },
        ],
    },
];
