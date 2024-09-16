import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MapPaginatedResponse, MapResponse, PaginatedResponse, Response } from '@helpers/response.helper';
import { Service } from '@models/service.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {

    constructor(private http: HttpClient) { }

    All(query: string = ''): Observable<PaginatedResponse<Service>> {
        return this.http.get(`${environment.apiUrl}/services${query}`).pipe(
            map((response) => {
                const services: PaginatedResponse<Service> = MapPaginatedResponse<Service>(<any>response);
                return services;
            })
        );
    }

    Create(name: string): Observable<Service> {
        return this.http.post(`${environment.apiUrl}/services`, { name }).pipe(
            map((response) => {
                const service: Service = (<any>response).result;
                return service;
            })
        );
    }

    Update(id: number, name: string): Observable<Service> {
        return this.http.put(`${environment.apiUrl}/services/${id}`, { name }).pipe(
            map((response) => {
                const service: Service = (<any>response).result;
                return service;
            })
        );
    }

    Reorder(order: number[]): Observable<Service> {
        console.table(order);
        return this.http.post(`${environment.apiUrl}/services/reorder`, { order }).pipe(
            map((response) => {
                const service: Service = (<any>response).result;
                return service;
            })
        );
    }

    Delete(id: number): Observable<Response> {
        return this.http.delete(`${environment.apiUrl}/services/${id}`).pipe(
            map((response) => {
                const result: Response = MapResponse(<any>response);
                return result;
            })
        );
    }
}
