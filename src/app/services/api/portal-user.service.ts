import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MapPaginatedResponse, MapResponse, PaginatedResponse, Response } from '@helpers/response.helper';
import { User } from '@models/user.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PortalUserService {

    constructor(private http: HttpClient) { }

    All(query: string = ''): Observable<PaginatedResponse<User>> {
        return this.http.get(`${environment.apiUrl}/portal-users${query}`).pipe(
            map((response) => {
                const users: PaginatedResponse<User> = MapPaginatedResponse<User>(<any>response);
                return users;
            })
        );
    }

    Create(firstName: string, lastName: string, email: string, phoneNumber: string, role: string, gender: string, password: string): Observable<User> {
        return this.http.post(`${environment.apiUrl}/portal-users`, {
            first_name: firstName,
            last_name: lastName,
            email,
            phone_number: phoneNumber,
            role,
            gender,
            password
        }).pipe(
            map((response) => {
                const user: User = (<any>response).result;
                return user;
            })
        );
    }

    Update(id: number, firstName: string, lastName: string, email: string, phoneNumber: string, role: string, gender: string): Observable<User> {
        return this.http.put(`${environment.apiUrl}/portal-users/${id}`, {
            first_name: firstName,
            last_name: lastName,
            email,
            phone_number: phoneNumber,
            role,
            gender,
        }).pipe(
            map((response) => {
                const user: User = (<any>response).result;
                return user;
            })
        );
    }

    Delete(id: number): Observable<Response> {
        return this.http.delete(`${environment.apiUrl}/portal-users/${id}`).pipe(
            map((response) => {
                const result: Response = MapResponse(<any>response);
                return result;
            })
        );
    }
}
