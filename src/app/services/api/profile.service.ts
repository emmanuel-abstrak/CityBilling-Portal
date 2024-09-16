import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '@models/user.model';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(private http: HttpClient) { }

    Me(): Observable<User> {
        return this.http.get(`${environment.apiUrl}/user`).pipe(
            map((response) => {
                const currentUser: User = (<any>response).result;
                return currentUser;
            })
        );
    }
}
