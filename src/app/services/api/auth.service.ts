import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthState } from '@states/auth.state';
import { environment } from '@environments/environment';
import { AuthToken } from '@models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private http: HttpClient, private authState: AuthState) { }

    Login(email: string, password: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/login`, { email, password }).pipe(
            map((response) => {
                const authToken: AuthToken = this._MapResponse(<any>response);
                return this.authState.SaveSession(authToken);
            })
        );
    }

    Logout(reroute: boolean = false): void {
        this.authState.Logout(reroute);
    }

    private _MapResponse(response: any) {
        return {
            accessToken: response.result.accessToken,
            user: response.result
        };
    }
}
