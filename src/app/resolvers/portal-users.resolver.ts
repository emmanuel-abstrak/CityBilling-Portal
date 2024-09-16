import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { QueryHelper } from '@helpers/query.helper';
import { PaginatedResponse } from '@helpers/response.helper';
import { User } from '@models/user.model';
import { PortalUserService } from '@services/api/portal-user.service';

export const portalUsersResolver: ResolveFn<PaginatedResponse<User>> = () => {
    const query = inject(QueryHelper).getQueryString();
    return inject(PortalUserService).All(query);
};
