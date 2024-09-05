import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AuthState } from '@states/auth.state';

export const authGuard: CanActivateFn = (route, state) => {
    const authState = inject(AuthState);
    const router = inject(Router);
    authState.redirectUrl = state.url;

    return authState.stateItem$.pipe(
        map((user) => {
            if (!user) {
                router.navigateByUrl('/login');
                return false;
            }
            return true;
        })
    );
};
