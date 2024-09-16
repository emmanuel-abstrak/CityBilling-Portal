import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { QueryHelper } from '@helpers/query.helper';
import { PaginatedResponse } from '@helpers/response.helper';
import { Currency } from '@models/currency.model';
import { CurrencyService } from '@services/api/currency.service';

export const currencyResolver: ResolveFn<PaginatedResponse<Currency>> = () => {
    const query = inject(QueryHelper).getQueryString();
    return inject(CurrencyService).All(query);
};
