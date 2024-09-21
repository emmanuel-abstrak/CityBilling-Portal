import { Routes } from '@angular/router';
import { DashboardComponent } from '@views/pages/dashboard/dashboard.component';
import { ActivityLogComponent } from './reporting/activity-log/activity-log.component';
import { adminGuard } from '@guards/admin.guard';
import { SuburbsComponent } from './settings/suburbs/suburbs.component';
import { PortalUsersComponent } from './settings/portal-users/portal-users.component';
import { CurrenciesComponent } from './settings/currencies/currencies.component';
import { PropertiesComponent } from './properties/properties.component';
import { TariffGroupsComponent } from './settings/tariff-groups/tariff-groups.component';
import { ServicesComponent } from './settings/services/services.component';
import { PropertyTypesComponent } from './settings/property-types/property-types.component';

export const PagesRoutes: Routes = [
    {
        path: '',
        data: {
            title: "Dashboard"
        },
        component: DashboardComponent,
    },
    {
        path: 'properties',
        data: {
            title: "Properties"
        },
        component: PropertiesComponent,
    },
    {
        path: 'settings',
        children: [
            {
                path: 'portal-users',
                data: {
                    title: "Portal Users"
                },
                component: PortalUsersComponent,
            },
            {
                path: 'suburbs',
                data: {
                    title: "Manage Suburbs"
                },
                component: SuburbsComponent
            },
            {
                path: 'property-types',
                data: {
                    title: "Property Types"
                },
                component: PropertyTypesComponent
            },
            {
                path: 'currencies',
                data: {
                    title: "Manage Currencies"
                },
                component: CurrenciesComponent
            },
            {
                path: 'services',
                data: {
                    title: "Manage Service"
                },
                component: ServicesComponent
            },
            {
                path: 'tariff-groups',
                data: {
                    title: "Tariff Groups"
                },
                component: TariffGroupsComponent
            },
        ]
    },
    {
        path: 'reports',
        canActivate: [adminGuard],
        children: [
            {
                path: 'activity-log',
                data: {
                    title: "Activity Log"
                },
                component: ActivityLogComponent,
            }
        ]
    }
];
