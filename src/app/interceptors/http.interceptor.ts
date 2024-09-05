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

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    isBusy: boolean = false;
    recall: Subject<boolean> = new Subject();

    constructor(private authState: AuthState, private authService: AuthService) { }
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
                    return this.handle401Error(adjustedReq, next);
                }
                return throwError(() => error);
            })
        );
    }

    private handle401Error(
        originalReq: HttpRequest<any>,
        next: HttpHandler
    ): Observable<any> {
        if (!this.isBusy) {
            this.isBusy = true;
            this.recall.next(false);

            return this.authService.RefreshToken().pipe(
                switchMap((result: any) => {
                    if (result) {
                        this.recall.next(true);
                        return next.handle(
                            originalReq.clone({ setHeaders: this.getHeaders() })
                        );
                    } else {
                        this.authState.Logout(true);
                        return throwError(() => "An error occured");
                    }
                }),
                catchError((error) => {
                    this.authState.Logout(true);
                    return throwError(() => error);
                }),
                finalize(() => {
                    this.isBusy = false;
                })
            );
        } else {
            return this.recall.pipe(
                filter((ready) => ready === true),
                switchMap(() => {
                    return next.handle(
                        originalReq.clone({ setHeaders: this.getHeaders() })
                    );
                })
            );
        }
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
