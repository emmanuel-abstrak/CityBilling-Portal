import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '@states/auth.state';
import { ToastrService } from 'ngx-toastr';

export const sudoGuard: CanActivateFn = () => {
    const role = inject(AuthState).GetRole();
    if (role && role.toLocaleLowerCase() === 'sudo') {
        return true;
    } else {
        inject(ToastrService).error('Permission denied!', 'Error');
        inject(Router).navigateByUrl('/');
        return false;
    }
};
