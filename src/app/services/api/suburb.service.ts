import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MapPaginatedResponse, MapResponse, PaginatedResponse, Response } from '@helpers/response.helper';
import { Suburb } from '@models/suburb.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SuburbService {

    constructor(private http: HttpClient) { }

    All(query: string = ''): Observable<PaginatedResponse<Suburb>> {
        return this.http.get(`${environment.apiUrl}/suburbs${query}`).pipe(
            map((response) => {
                const suburbs: PaginatedResponse<Suburb> = MapPaginatedResponse<Suburb>(<any>response);
                return suburbs;
            })
        );
    }

    Create(name: string): Observable<Suburb> {
        return this.http.post(`${environment.apiUrl}/suburbs`, { name }).pipe(
            map((response) => {
                const suburb: Suburb = (<any>response).result;
                return suburb;
            })
        );
    }

    Update(id: number, name: string): Observable<Suburb> {
        return this.http.put(`${environment.apiUrl}/suburbs/${id}`, { name }).pipe(
            map((response) => {
                const suburb: Suburb = (<any>response).result;
                return suburb;
            })
        );
    }

    Delete(id: number): Observable<Response> {
        return this.http.delete(`${environment.apiUrl}/suburbs/${id}`).pipe(
            map((response) => {
                const result: Response = MapResponse(<any>response);
                return result;
            })
        );
    }
}
