import {
    HttpRequest,
    HttpInterceptor,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    catchError,
    Observable,
    switchMap,
    throwError,
    finalize,
    Subject,
    filter,
} from 'rxjs';
import { AuthService } from '@services/auth.service';
import { AuthState } from '@states/auth.state';
import { Router } from '@angular/router';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    isBusy: boolean = false;
    recall: Subject<boolean> = new Subject();

    constructor(private authState: AuthState, private router: Router) { }
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const adjustedReq = req.clone({
            setHeaders: this.getHeaders(),
        });

        return next.handle(adjustedReq).pipe(
            catchError((error) => {
                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 401 &&
                    req.url.indexOf('login') < 0
                ) {
                    return this.handle401Error();
                }
                return throwError(() => error);
            })
        );
    }

    private handle401Error(): Observable<any> {
        this.authState.Logout(true);
        this.router.navigateByUrl('/login');
        return throwError(() => 'Unauthenticated');
    }

    private getHeaders(): any {
        let headers: any = {};
        const _auth = this.authState.GetToken();
        if (_auth && _auth !== '') {
            headers['authorization'] = `Bearer ${_auth}`;
        }

        return headers;
    }
}
