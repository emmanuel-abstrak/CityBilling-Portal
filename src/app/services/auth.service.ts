import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
    AuthToken,
    MapAuthToken,
} from '@models/auth.model';
import { AuthState } from '@states/auth.state';
import { environment } from '@environments/environment';
import { MapResponse, Response } from '@helpers/response.helper';

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private http: HttpClient, private authState: AuthState) { }

    Login(email: string, password: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/login`, { email, password }).pipe(
            map((response) => {
                const token: AuthToken = MapAuthToken((<any>response).result);
                return this.authState.SaveSession(token);
            })
        );
    }

    RequestAccess(name: string, email: string, phone: string, schoolName: string): Observable<boolean> {
        return this.http.post(`${environment.apiUrl}/request-access`, { name, email, phone, school_name: schoolName }).pipe(
            map((response) => {
                const result: Response = MapResponse((<any>response));
                localStorage.setItem('prospect', JSON.stringify(result.result));
                return result.success;
            })
        );
    }

    RefreshToken(): Observable<AuthToken> {
        return this.http
            .post(`${environment.apiUrl}/refresh`, { token: this.authState.GetRefreshToken() })
            .pipe(
                map((response) => {
                    if (!response) {
                        throw new Error('Oh oh');
                    }

                    const retUser: AuthToken = MapAuthToken((<any>response).result);
                    this.authState.UpdateSession(retUser);

                    return retUser;
                })
            );
    }

    Logout(): void {
        this.authState.Logout();
    }
}
