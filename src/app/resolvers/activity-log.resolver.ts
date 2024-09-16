import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { QueryHelper } from '@helpers/query.helper';
import { PaginatedResponse } from '@helpers/response.helper';
import { Activity } from '@models/activity.model';
import { ActivityLogService } from '@services/api/activity-log.service';

export const activityLogResolver: ResolveFn<PaginatedResponse<Activity>> = () => {
    const query = inject(QueryHelper).getQueryString();
    return inject(ActivityLogService).All(query);
};
