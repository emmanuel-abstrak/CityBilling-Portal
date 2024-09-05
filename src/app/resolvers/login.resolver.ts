import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { AuthState } from '@states/auth.state';
import { map } from 'rxjs';

export const loginResolver: ResolveFn<boolean> = () => {
    const router = inject(Router);
    const authState = inject(AuthState);
    return authState.stateItem$.pipe(
        map((user) => {
            if (user) {
                router.navigateByUrl(
                    authState.redirectUrl || '/'
                );
            }
            return true;
        })
    );
};
