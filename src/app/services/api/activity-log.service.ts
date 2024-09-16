import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MapPaginatedResponse, PaginatedResponse } from '@helpers/response.helper';
import { Activity } from '@models/activity.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ActivityLogService {

    constructor(private http: HttpClient) { }

    All(query: string = ''): Observable<PaginatedResponse<Activity>> {
        return this.http.get(`${environment.apiUrl}/activity-log${query}`).pipe(
            map((response) => {
                const activities: PaginatedResponse<Activity> = MapPaginatedResponse<Activity>(<any>response);
                return activities;
            })
        );
    }
}
