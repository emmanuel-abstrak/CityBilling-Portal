import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthState } from '@states/auth.state';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private http: HttpClient, private authState: AuthState) { }

    Login(email: string, password: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/login`, { email, password }).pipe(
            map((response) => {
                const token: string = (<any>response).result.access_token;
                return this.authState.SaveSession(token);
            })
        );
    }

    Logout(reroute: boolean = false): void {
        this.authState.Logout(reroute);
    }
}
