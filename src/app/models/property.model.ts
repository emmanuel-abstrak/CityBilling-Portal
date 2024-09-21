import { Suburb } from "./suburb.model";
import { User } from "./user.model";

export interface Property {
    id: number;
    size: number;
    meter: number;
    address: string;
    balances: {
        name: string;
        amount: number;
    }[];
    type: {
        id: number;
        name: string;
    };
    tariffs: {
        name: string;
        price: string;
    }[];
    owner: User;
    suburb: Suburb;
    createdAt: string;
    updatedAt: string;
}
