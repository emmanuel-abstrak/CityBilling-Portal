import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MapPaginatedResponse, MapResponse, PaginatedResponse, Response } from '@helpers/response.helper';
import { Property } from '@models/property.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PropertyService {

    constructor(private http: HttpClient) { }

    All(query: string = ''): Observable<PaginatedResponse<Property>> {
        return this.http.get(`${environment.apiUrl}/properties${query}`).pipe(
            map((response) => {
                const properties: PaginatedResponse<Property> = MapPaginatedResponse<Property>(<any>response);
                return properties;
            })
        );
    }

    Create(
        first_name: string,
        last_name: string,
        email: string,
        phone_number: string,
        id_number: string,
        address: string,
        suburb_id: number,
        type: string,
        size: number,
        meter: number,
        sendNotification: boolean
    ): Observable<Property> {
        return this.http.post(`${environment.apiUrl}/properties`, {
            first_name,
            last_name,
            email,
            phone_number,
            id_number,
            address,
            suburb_id,
            type_id: type,
            size,
            meter,
            send_notification: sendNotification
        }).pipe(
            map((response) => {
                const property: Property = (<any>response).result;
                return property;
            })
        );
    }

    Update(
        id: number,
        first_name: string,
        last_name: string,
        email: string,
        phone_number: string,
        id_number: string,
        address: string,
        suburb_id: number,
        type: string,
        size: number,
        meter: number,
    ): Observable<Property> {
        return this.http.put(`${environment.apiUrl}/properties/${id}`, {
            first_name,
            last_name,
            email,
            phone_number,
            id_number,
            address,
            suburb_id,
            type_id: type,
            size,
            meter,
        }).pipe(
            map((response) => {
                const property: Property = (<any>response).result;
                return property;
            })
        );
    }

    Delete(id: number): Observable<Response> {
        return this.http.delete(`${environment.apiUrl}/properties/${id}`).pipe(
            map((response) => {
                const result: Response = MapResponse(<any>response);
                return result;
            })
        );
    }
}
