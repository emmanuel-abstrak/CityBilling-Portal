import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MapPaginatedResponse, MapResponse, PaginatedResponse, Response } from '@helpers/response.helper';
import { Currency } from '@models/currency.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {

    constructor(private http: HttpClient) { }

    All(query: string = ''): Observable<PaginatedResponse<Currency>> {
        return this.http.get(`${environment.apiUrl}/currencies${query}`).pipe(
            map((response) => {
                const currencies: PaginatedResponse<Currency> = MapPaginatedResponse<Currency>(<any>response);
                return currencies;
            })
        );
    }

    Create(code: string, symbol: string, rate: number): Observable<Currency> {
        return this.http.post(`${environment.apiUrl}/currencies`, { code, symbol, exchange_rate: rate }).pipe(
            map((response) => {
                const currency: Currency = (<any>response).result;
                return currency;
            })
        );
    }

    Update(id: number, code: string, symbol: string, rate: number): Observable<Currency> {
        return this.http.put(`${environment.apiUrl}/currencies/${id}`, { code, symbol, exchange_rate: rate }).pipe(
            map((response) => {
                const currency: Currency = (<any>response).result;
                return currency;
            })
        );
    }

    Delete(id: number): Observable<Response> {
        return this.http.delete(`${environment.apiUrl}/currencies/${id}`).pipe(
            map((response) => {
                const result: Response = MapResponse(<any>response);
                return result;
            })
        );
    }
}
