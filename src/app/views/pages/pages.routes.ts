import { Routes } from '@angular/router';
import { DashboardComponent } from '@views/pages/dashboard/dashboard.component';
import { ActivityLogComponent } from './reporting/activity-log/activity-log.component';
import { activityLogResolver } from '@resolvers/activity-log.resolver';
import { adminGuard } from '@guards/admin.guard';
import { SuburbsComponent } from './settings/suburbs/suburbs.component';
import { suburbResolver } from '@resolvers/suburb.resolver';
import { portalUsersResolver } from '@resolvers/portal-users.resolver';
import { PortalUsersComponent } from './settings/portal-users/portal-users.component';
import { CurrenciesComponent } from './settings/currencies/currencies.component';
import { currencyResolver } from '@resolvers/currency.resolver';
import { PropertiesComponent } from './properties/properties.component';
import { propertyResolver } from '@resolvers/property.resolver';
import { tariffGroupResolver } from '@resolvers/tariff-group.resolver';
import { TariffGroupsComponent } from './settings/tariff-groups/tariff-groups.component';
import { ServicesComponent } from './settings/services/services.component';
import { PricingComponent } from './settings/pricing/pricing.component';
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
                resolve: { usersState: portalUsersResolver },
                component: PortalUsersComponent,
            },
            {
                path: 'suburbs',
                data: {
                    title: "Manage Suburbs"
                },
                resolve: { suburbState: suburbResolver },
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
                resolve: { currenciesState: currencyResolver },
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
                path: 'water-pricing',
                data: {
                    title: "Water Pricing"
                },
                component: PricingComponent
            },
            {
                path: 'tariff-groups',
                data: {
                    title: "Tariff Groups"
                },
                resolve: { tariffsState: tariffGroupResolver, suburbState: suburbResolver },
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
                resolve: { activityLogs: activityLogResolver },
                component: ActivityLogComponent,
            }
        ]
    }
];
