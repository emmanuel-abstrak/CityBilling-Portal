import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { PaginatedResponse } from '@helpers/response.helper';
import { Activity } from '@models/activity.model';
import { ActivityLogService } from '@services/api/activity-log.service';

@Component({
    selector: 'app-activity-log',
    standalone: true,
    imports: [PaginationComponent, ReactiveFormsModule],
    templateUrl: './activity-log.component.html',
    styleUrl: './activity-log.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class ActivityLogComponent implements OnInit {
    public paginatedActivities: PaginatedResponse<Activity>;
    public searchForm: FormGroup = new FormGroup({
        search: new FormControl('')
    });
    public submitted = false;
    public loading = false;
    public activeLog: Activity = null;

    constructor(
        private fb: FormBuilder,
        private activityLogService: ActivityLogService
    ) { }

    ngOnInit(): void {
        this.getActivities();

        this.searchForm = this.fb.group({
            search: ['', [Validators.required]]
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.searchForm.controls;
    }

    doSearch() {
        if (this.searchForm.invalid) {
            return;
        }
        const query = "?search=" + this.f['search'].value;
        this.getActivities(query, true);
    }

    clearSearch() {
        this.getActivities();
        this.f['search'].patchValue('');
        this.submitted = false;
    }

    doPagination(event) {
        this.getActivities(event);
    }

    getActivities(query: string = '', isSearch: boolean = false) {
        this.loading = true;
        return this.activityLogService.All(query).subscribe((data) => {
            this.paginatedActivities = data;
        }).add(() => {
            if (isSearch) {
                this.submitted = true;
            }
            this.loading = false;
        });
    }

    getObjectEntries(code: string) {
        if (code == null) return null;
        const detail: Object = JSON.parse(code);
        return Object.entries(detail);
    }
}
