export interface PropertyType {
    id: number;
    name: string;
    cutoff: number;
    cutoffPrice: number;
    price: number;
    properties: number;
    createdAt: string;
}

export interface PropertyTypeSelect {
    value: number;
    label: string;
}
