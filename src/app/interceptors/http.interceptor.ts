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
    throwError,
    Subject,
    EMPTY,
} from 'rxjs';
import { AuthState } from '@states/auth.state';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    isBusy: boolean = false;
    recall: Subject<boolean> = new Subject();

    constructor(private authState: AuthState, private router: Router, private toastService: ToastrService, private location: Location) { }
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
                } else {
                    if (typeof (error.error.result) != 'undefined') {
                        this.toastService.error(error.error.result);
                    } else {
                        this.toastService.error('An error occurred, please try again');
                    }

                    // if (error.status != 400) {
                    //     this.router.navigateByUrl('/');
                    // }
                }
                return EMPTY;
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
