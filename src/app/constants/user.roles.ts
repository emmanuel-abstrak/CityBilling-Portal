export interface Role {
    label: string;
    value: string;
}
export const userRoles: Role[] = [
    {
        value: 'sudo',
        label: 'Sudo'
    },
    {
        value: 'admin',
        label: 'Admin'
    },
    {
        value: 'clerk',
        label: 'Clerk'
    },
];
