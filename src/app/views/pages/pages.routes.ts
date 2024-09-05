import { Routes } from '@angular/router';
import { DashboardComponent } from '@views/pages/dashboard/dashboard.component';

export const PagesRoutes: Routes = [
    {
        path: '',
        data: {
            title: "Dashboard"
        },
        component: DashboardComponent,
    }
];
