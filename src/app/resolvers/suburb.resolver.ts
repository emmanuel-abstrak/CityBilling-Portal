import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { QueryHelper } from '@helpers/query.helper';
import { PaginatedResponse } from '@helpers/response.helper';
import { Suburb } from '@models/suburb.model';
import { SuburbService } from '@services/api/suburb.service';

export const suburbResolver: ResolveFn<PaginatedResponse<Suburb>> = () => {
    const query = inject(QueryHelper).getQueryString();
    return inject(SuburbService).All(query);
};
