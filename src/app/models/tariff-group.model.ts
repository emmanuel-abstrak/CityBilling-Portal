import { Suburb } from "./suburb.model";

export interface TariffGroup {
    id: number;
    suburb: Suburb;
    minSize: number;
    maxSize: number;
    tariffs: {
        id: number;
        propertyType: string;
        service: string;
        price: string;
    }[];
}
