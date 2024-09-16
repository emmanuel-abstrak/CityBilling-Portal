import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { VendingSummary } from '@models/vending-summary.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VendingService {

    constructor(private http: HttpClient) { }

    Lookup(meter: string, amount: number, currency: string): Observable<VendingSummary> {
        return this.http.post(`${environment.apiUrl}/vending/meter-lookup`, { meter, amount, currency }).pipe(
            map((response) => {
                const meter: VendingSummary = (<any>response).result;
                return meter;
            })
        );
    }

    Vend(meter: string, amount: number, currency: string): Observable<VendingSummary> {
        return this.http.post(`${environment.apiUrl}/vending/buy`, { meter, amount, currency }).pipe(
            map((response) => {
                const meter: VendingSummary = (<any>response).result;
                return meter;
            })
        );
    }
}
