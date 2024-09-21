import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthToken } from '@models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthState {
    private stateItem: BehaviorSubject<string | null> = new BehaviorSubject(
        null
    );
    stateItem$: Observable<string | null> = this.stateItem.asObservable();

    get redirectUrl(): string {
        return localStorage.getItem('redirectUrl');
    }
    set redirectUrl(value: string) {
        localStorage.setItem('redirectUrl', value);
    }

    constructor(
        private router: Router
    ) {
        const _localToken: string = this._GetLocalToken();

        if (this.CheckAuth(_localToken)) {
            this.SetState(_localToken);
        } else {
            this.Logout(false);
        }
    }

    SetState(item: string) {
        this.stateItem.next(item);
        return this.stateItem$;
    }
    UpdateState(token: string) {
        this.stateItem.next(token);
        return this.stateItem$;
    }
    RemoveState() {
        this.stateItem.next(null);
    }

    private _SaveToken(authToken: AuthToken) {
        localStorage.setItem(environment.tokenStorageKey, authToken.accessToken);
        localStorage.setItem(environment.userStorageKey, JSON.stringify(authToken.user));
    }
    private _DestroySession() {
        localStorage.removeItem(environment.tokenStorageKey);
        localStorage.removeItem(environment.userStorageKey);
    }

    private _GetLocalToken(): string | null {
        const _token: string = localStorage.getItem(environment.tokenStorageKey);
        if (_token) {
            return _token;
        }
        return null;
    }

    SaveSession(authToken: AuthToken): AuthToken | null {
        if (authToken) {
            this._SaveToken(authToken);
            this.SetState(authToken.accessToken);
            return authToken;
        } else {
            this._DestroySession();
            this.RemoveState();
            return null;
        }
    }

    CheckAuth(token: string) {
        if (!token) {
            return false;
        }

        return true;
    }

    Logout(reroute: boolean = false) {
        this.RemoveState();
        this._DestroySession();

        if (reroute) {
            this.router.navigateByUrl('/login');
        }
    }

    GetToken() {
        const token = this.stateItem.getValue();
        return this.CheckAuth(token) ? token : null;
    }

    GetUser(): string | null {
        const _user: string = JSON.parse(localStorage.getItem(environment.userStorageKey));
        if (_user) {
            return _user;
        }
        return null;
    }
}
