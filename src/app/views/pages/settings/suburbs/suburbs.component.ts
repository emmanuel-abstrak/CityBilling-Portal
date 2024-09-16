import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResponse } from '@helpers/response.helper';
import { Suburb } from '@models/suburb.model';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { AddSuburbComponent } from './add-suburb/add-suburb.component';
import { EditSuburbComponent } from './edit-suburb/edit-suburb.component';
import { SuburbService } from '@services/api/suburb.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-suburbs',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, PaginationComponent, AddSuburbComponent, EditSuburbComponent],
    templateUrl: './suburbs.component.html',
    styleUrl: './suburbs.component.scss'
})
export class SuburbsComponent {
    public selectedSuburb: Suburb;
    public selectedSuburbSubject: Subject<Suburb> = new Subject<Suburb>();
    public paginatedSuburbs: PaginatedResponse<Suburb>;
    public submitted = false;
    public loading = false;

    public searchForm: FormGroup = new FormGroup({
        search: new FormControl('')
    });

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private suburbService: SuburbService,
        private toastService: ToastrService
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(data => {
            this.paginatedSuburbs = data['suburbState'];
        });

        this.searchForm = this.fb.group({
            search: [''],
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.searchForm.controls;
    }

    changeSelectedSuburb(suburb: Suburb) {
        this.selectedSuburb = suburb;
        this.selectedSuburbSubject.next(suburb);
    }

    showConfirmDelete(suburb: Suburb) {
        Swal.fire({
            title: `<span class="text-danger">Delete ${suburb.name}?</span>`,
            text: 'All the data associated with this suburb will be removed.',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            reverseButtons: true,
            showLoaderOnConfirm: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: "btn btn-danger",
                cancelButton: "btn btn-light"
            },
            preConfirm: async () => {
                this.suburbService.Delete(suburb.id).subscribe((result) => {
                    if (result.success) {
                        this.toastService.success(`${suburb.name} deleted!`);
                    }
                    return;
                })
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.getSuburbs({ query: '' });
            }
        });
    }

    doSearch() {
        if (this.searchForm.invalid) {
            return;
        }
        const query = "?search=" + this.f['search'].value;
        this.getSuburbs({ query, isSearch: true });
    }

    clearSearch() {
        this.getSuburbs({ isClear: true });
        this.f['search'].patchValue('');
    }

    getSuburbs(options: { query?: string, isSearch?: boolean, isClear?: boolean }) {
        this.loading = true;
        this.suburbService.All(options.query).subscribe((data) => {
            this.paginatedSuburbs = data;
        }).add(() => {
            if (options.isSearch) {
                this.submitted = true;
            }
            if (options.isClear) {
                this.submitted = false;
            }
            this.loading = false;
        })
    }
}
