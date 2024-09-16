import { Suburb } from "./suburb.model";
import { User } from "./user.model";

export interface Property {
    id: number;
    type: string;
    size: number;
    meter: number;
    address: string;
    ratesCharge: number;
    refuseCharge: number;
    sewerCharge: number;
    balances: {
        rates: number,
        sewer: number,
        refuse: number,
    };
    owner: User;
    suburb: Suburb;
    createdAt: string;
    updatedAt: string;
}
