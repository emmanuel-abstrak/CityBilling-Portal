import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

    private _SaveToken(token: string) {
        localStorage.setItem(environment.tokenStorageKey, token);
    }
    private _RemoveToken() {
        localStorage.removeItem(environment.tokenStorageKey);
    }

    private _GetLocalToken(): string | null {
        const _token: string = localStorage.getItem(environment.tokenStorageKey);
        if (_token) {
            return _token;
        }
        return null;
    }

    SaveSession(token: string): string | null {
        if (token) {
            this._SaveToken(token);
            this.SetState(token);
            return token;
        } else {
            this._RemoveToken();
            this.RemoveState();
            return null;
        }
    }

    UpdateSession(token: string) {
        const _localToken: string = this._GetLocalToken();
        if (_localToken) {
            this._SaveToken(_localToken);
            this.UpdateState(token);
        } else {
            this._RemoveToken();
            this.RemoveState();
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
        this._RemoveToken();

        if (reroute) {
            this.router.navigateByUrl('/login');
        }
    }

    GetToken() {
        const token = this.stateItem.getValue();
        return this.CheckAuth(token) ? token : null;
    }
}
