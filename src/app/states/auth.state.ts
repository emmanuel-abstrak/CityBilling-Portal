import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthToken } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthState {
    private stateItem: BehaviorSubject<AuthToken | null> = new BehaviorSubject(
        null
    );
    stateItem$: Observable<AuthToken | null> = this.stateItem.asObservable();

    get redirectUrl(): string {
        return localStorage.getItem('redirectUrl');
    }
    set redirectUrl(value: string) {
        localStorage.setItem('redirectUrl', value);
    }

    constructor(
        private router: Router
    ) {
        const _localToken: AuthToken = this._GetLocalToken();

        if (this.CheckAuth(_localToken)) {
            this.SetState(_localToken);
        } else {
            this.Logout(false);
        }
    }

    SetState(item: AuthToken) {
        this.stateItem.next(item);
        return this.stateItem$;
    }
    UpdateState(item: Partial<AuthToken>) {
        const newItem = { ...this.stateItem.getValue(), ...item };
        this.stateItem.next(newItem);
        return this.stateItem$;
    }
    RemoveState() {
        this.stateItem.next(null);
    }

    private _SaveToken(token: AuthToken) {
        localStorage.setItem(environment.tokenStorageKey, JSON.stringify(token));
    }
    private _RemoveToken() {
        localStorage.removeItem(environment.tokenStorageKey);
    }

    private _GetLocalToken(): AuthToken | null {
        const _token: AuthToken = JSON.parse(localStorage.getItem(environment.tokenStorageKey));
        if (_token && _token.accessToken) {
            return <AuthToken>_token;
        }
        return null;
    }

    SaveSession(token: AuthToken): AuthToken | null {
        if (token.accessToken) {
            this._SaveToken(token);
            this.SetState(token);
            return token;
        } else {
            this._RemoveToken();
            this.RemoveState();
            return null;
        }
    }

    UpdateSession(token: AuthToken) {
        const _localToken: AuthToken = this._GetLocalToken();
        if (_localToken) {
            _localToken.accessToken = token.accessToken;
            _localToken.refreshToken = token.refreshToken;

            this._SaveToken(_localToken);
            this.UpdateState(token);
        } else {
            this._RemoveToken();
            this.RemoveState();
        }
    }

    CheckAuth(token: AuthToken) {
        if (!token || !token.accessToken) {
            return false;
        }
        if (Date.now() > token.expiresAt) {
            return false;
        }

        return true;
    }

    Logout(reroute: boolean = false) {
        this.RemoveState();
        this._RemoveToken();

        if (reroute) {
            this.router.navigateByUrl('/login');
        }
    }

    GetToken() {
        const _auth = this.stateItem.getValue();
        return this.CheckAuth(_auth) ? _auth.accessToken : null;
    }
    GetRefreshToken() {
        const _auth = this.stateItem.getValue();
        return this.CheckAuth(_auth) ? _auth.refreshToken : null;
    }
}
