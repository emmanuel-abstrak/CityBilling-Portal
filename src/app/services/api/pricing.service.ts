export interface Pricing {
    id: number;
    name: string;
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MapPaginatedResponse, MapResponse, PaginatedResponse, Response } from '@helpers/response.helper';
import { Service } from '@models/service.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PricingService {

    constructor(private http: HttpClient) { }

    All(query: string = ''): Observable<PaginatedResponse<Pricing>> {
        return this.http.get(`${environment.apiUrl}/prices${query}`).pipe(
            map((response) => {
                const prices: PaginatedResponse<Pricing> = MapPaginatedResponse<Pricing>(<any>response);
                return prices;
            })
        );
    }

    Create(name: string): Observable<Pricing> {
        return this.http.post(`${environment.apiUrl}/prices`, { name }).pipe(
            map((response) => {
                const price: Pricing = (<any>response).result;
                return price;
            })
        );
    }

    Update(id: number, name: string): Observable<Pricing> {
        return this.http.put(`${environment.apiUrl}/prices/${id}`, { name }).pipe(
            map((response) => {
                const price: Pricing = (<any>response).result;
                return price;
            })
        );
    }

    Delete(id: number): Observable<Response> {
        return this.http.delete(`${environment.apiUrl}/prices/${id}`).pipe(
            map((response) => {
                const result: Response = MapResponse(<any>response);
                return result;
            })
        );
    }
}
