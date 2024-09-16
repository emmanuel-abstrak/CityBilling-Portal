import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ProfileService } from '@services/api/profile.service';
import { User } from '@models/user.model';

export const userResolver: ResolveFn<User> = () => {
    return inject(ProfileService).Me();
};
