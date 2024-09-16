import { Meter } from "./meter.model";

export interface VendingSummary {
    amount: number;
    rates: number;
    refuse: number;
    sewer: number;
    vat: number;
    currency: string;
    tokenAmount: number;
    token: string;
    meter: Meter;
}
