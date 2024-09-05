import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthState } from '../states/auth.state';

const getHeaders = (): any => {
    const authState = inject(AuthState);
    let headers: any = {};
    const _auth = authState.GetToken();
    if (_auth && _auth !== '') {
        headers['authorization'] = `Bearer ${_auth}`;
    }

    return headers;
};

export const AppInterceptorFn: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
) => {
    const adjustedReq = req.clone({
        setHeaders: getHeaders(),
    });

    return next(adjustedReq);
};
