export interface Service {
    id: number;
    name: string;
    order: number;
    createdAt: string;
}

export interface ServiceSelect {
    value: number;
    label: string;
}
