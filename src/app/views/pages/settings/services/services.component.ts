import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResponse } from '@helpers/response.helper';
import { Service } from '@models/service.model';
import { ServiceService } from '@services/api/service.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { AddServiceComponent } from "./add-service/add-service.component";
import { EditServiceComponent } from "./edit-service/edit-service.component";
import { ReorderServicesComponent } from "./reorder-services/reorder-services.component";

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [ReactiveFormsModule, PaginationComponent, AddServiceComponent, EditServiceComponent, ReorderServicesComponent],
    templateUrl: './services.component.html',
    styleUrl: './services.component.scss'
})
export class ServicesComponent {
    public selectedService: Service;
    public selectedServiceSubject: Subject<Service> = new Subject<Service>();
    public servicesSubject: Subject<Service[]> = new Subject<Service[]>();
    public paginatedServices: PaginatedResponse<Service>;
    public submitted = false;
    public loading = false;

    public searchForm: FormGroup = new FormGroup({
        search: new FormControl('')
    });

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private serviceService: ServiceService,
        private toastService: ToastrService
    ) { }

    ngOnInit(): void {
        this.getServices({});

        this.searchForm = this.fb.group({
            search: [''],
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.searchForm.controls;
    }

    changeSelectedService(service: Service) {
        this.selectedService = service;
        this.selectedServiceSubject.next(service);
    }

    showConfirmDelete(service: Service) {
        Swal.fire({
            title: `<span class="text-danger">Delete ${service.name}?</span>`,
            text: 'All the data associated with this service will be removed.',
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
                this.serviceService.Delete(service.id).subscribe((result) => {
                    if (result.success) {
                        this.toastService.success(`${service.name} deleted!`);
                    }
                    return;
                })
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.getServices({ query: '' });
            }
        });
    }

    doSearch() {
        if (this.searchForm.invalid) {
            return;
        }
        const query = "?search=" + this.f['search'].value;
        this.getServices({ query, isSearch: true });
    }

    clearSearch() {
        this.getServices({ isClear: true });
        this.f['search'].patchValue('');
    }

    getServices(options: { query?: string, isSearch?: boolean, isClear?: boolean }) {
        this.loading = true;
        this.serviceService.All(options.query).subscribe((data) => {
            this.paginatedServices = data;
            this.servicesSubject.next(data.items);
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
