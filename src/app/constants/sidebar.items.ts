export interface NavItem {
    label: string;
    icon?: string;
    isDivider?: boolean;
    isVending?: boolean;
    link?: string;
    isActive?: string;
    permissions?: string[];
    children?: string[];
}

export const sidebarItems: NavItem[] = [
    {
        label: 'General',
        isDivider: true
    },
    {
        label: 'Dashboard',
        icon: 'device-desktop',
        link: '',
        permissions: []
    },
    {
        label: 'Properties',
        icon: 'smart-home',
        link: '/properties',
        permissions: []
    },
    {
        label: 'Reports',
        isDivider: true,
    },
    {
        label: 'Activities',
        icon: 'clock',
        link: '/reports/activity-log',
        permissions: []
    },
    {
        label: 'Reports',
        icon: 'report',
        link: '/reports',
        permissions: []
    },
    {
        label: 'Settings',
        isDivider: true
    },
    {
        label: 'Suburbs',
        icon: 'map',
        link: '/settings/suburbs',
        permissions: []
    },
    {
        label: 'Property Types',
        icon: 'git-branch',
        link: '/settings/property-types',
        permissions: []
    },
    {
        label: 'Tariffs Groups',
        icon: 'report-money',
        link: '/settings/tariff-groups',
        permissions: []
    },
    {
        label: 'Tariff Services',
        icon: 'list',
        link: '/settings/services',
        permissions: []
    },
    {
        label: 'Currencies',
        icon: 'premium-rights',
        link: '/settings/currencies',
        permissions: []
    },
    {
        label: 'Portal Users',
        icon: 'users',
        link: '/settings/portal-users',
        permissions: []
    },
];
