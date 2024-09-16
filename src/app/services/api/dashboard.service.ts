import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MapPaginatedResponse, MapResponse, PaginatedResponse, Response } from '@helpers/response.helper';
import { Activity } from '@models/activity.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private http: HttpClient) { }

    Properties(): Observable<Response> {
        return this.http.get(`${environment.apiUrl}/dashboard/properties`).pipe(
            map((response) => {
                const result: Response = MapResponse(<any>response);
                return result;
            })
        );
    }

    Balances(): Observable<Response> {
        return this.http.get(`${environment.apiUrl}/dashboard/balances`).pipe(
            map((response) => {
                const result: Response = MapResponse(<any>response);
                return result;
            })
        );
    }

    Activities(): Observable<PaginatedResponse<Activity>> {
        return this.http.get(`${environment.apiUrl}/dashboard/activities`).pipe(
            map((response) => {
                const activities: PaginatedResponse<Activity> = MapPaginatedResponse<Activity>(<any>response);
                return activities;
            })
        );
    }
}
