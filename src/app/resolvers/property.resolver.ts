import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { QueryHelper } from '@helpers/query.helper';
import { PaginatedResponse } from '@helpers/response.helper';
import { Property } from '@models/property.model';
import { PropertyService } from '@services/api/property.service';

export const propertyResolver: ResolveFn<PaginatedResponse<Property>> = () => {
    const query = inject(QueryHelper).getQueryString();
    return inject(PropertyService).All(query);
};
