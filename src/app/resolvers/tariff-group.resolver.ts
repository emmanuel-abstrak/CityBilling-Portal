import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { QueryHelper } from '@helpers/query.helper';
import { PaginatedResponse } from '@helpers/response.helper';
import { TariffGroup } from '@models/tariff-group.model';
import { TariffGroupService } from '@services/api/tariff-group.service';

export const tariffGroupResolver: ResolveFn<PaginatedResponse<TariffGroup>> = () => {
    const query = inject(QueryHelper).getQueryString();
    return inject(TariffGroupService).All(query);
};
