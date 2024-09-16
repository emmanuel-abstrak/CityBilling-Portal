import { Suburb } from "./suburb.model";

export interface TariffGroup {
    id: number;
    suburb: Suburb;
    minSize: number;
    maxSize: number;
    residentialRatesCharge: number;
    residentialRefuseCharge: number;
    residentialSewerageCharge: number;
    commercialRatesCharge: number;
    commercialRefuseCharge: number;
    commercialSewerageCharge: number;
}
