import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '@states/auth.state';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = () => {
    const user: any = inject(AuthState).GetUser();
    if (user && user.role.toLocaleLowerCase() === 'admin') {
        return true;
    } else {
        inject(ToastrService).error('Permission denied!', 'Error');
        inject(Router).navigateByUrl('/');
        return false;
    }
};
