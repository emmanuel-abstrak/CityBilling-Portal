import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MapPaginatedResponse, MapResponse, PaginatedResponse, Response } from '@helpers/response.helper';
import { PropertyType } from '@models/property-type.model';
import { Service } from '@models/service.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PropertyTypeService {

    constructor(private http: HttpClient) { }

    All(query: string = ''): Observable<PaginatedResponse<PropertyType>> {
        return this.http.get(`${environment.apiUrl}/property-types${query}`).pipe(
            map((response) => {
                const types: PaginatedResponse<PropertyType> = MapPaginatedResponse<PropertyType>(<any>response);
                return types;
            })
        );
    }

    Create(name: string, price: number, cutoff?: number, cutoffPrice?: number): Observable<PropertyType> {
        return this.http.post(`${environment.apiUrl}/property-types`, {
            name,
            price,
            cutoff,
            cutoff_price: cutoffPrice
        }).pipe(
            map((response) => {
                const type: PropertyType = (<any>response).result;
                return type;
            })
        );
    }

    Update(id: number, name: string, price: number, cutoff?: number, cutoffPrice?: number): Observable<PropertyType> {
        return this.http.put(`${environment.apiUrl}/property-types/${id}`, {
            name,
            price,
            cutoff,
            cutoff_price: cutoffPrice
        }).pipe(
            map((response) => {
                const type: PropertyType = (<any>response).result;
                return type;
            })
        );
    }

    Delete(id: number): Observable<Response> {
        return this.http.delete(`${environment.apiUrl}/property-types/${id}`).pipe(
            map((response) => {
                const result: Response = MapResponse(<any>response);
                return result;
            })
        );
    }
}
