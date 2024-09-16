import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginatedResponse } from '@helpers/response.helper';
import { Property } from '@models/property.model';
import { PropertyService } from '@services/api/property.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { AddPropertyComponent } from "./add-property/add-property.component";
import { Suburb, SuburbSelect } from '@models/suburb.model';
import { Select2Module } from 'ng-select2-component';
import { EditPropertyComponent } from "./edit-property/edit-property.component";
import { VendingModalComponent } from "../../components/vending-modal/vending-modal.component";
import { SuburbService } from '@services/api/suburb.service';

@Component({
    selector: 'app-properties',
    standalone: true,
    imports: [ReactiveFormsModule, PaginationComponent, AddPropertyComponent, Select2Module, EditPropertyComponent, VendingModalComponent],
    templateUrl: './properties.component.html',
    styleUrl: './properties.component.scss'
})
export class PropertiesComponent {
    public selectedProperty: Property;
    public selectedPropertySubject: Subject<Property> = new Subject<Property>();
    public paginatedProperties: PaginatedResponse<Property>;
    public suburbs: SuburbSelect[];
    public selectedSuburb = '';
    public submitted = false;
    public loading = false;

    public searchForm: FormGroup = new FormGroup({
        search: new FormControl('')
    });

    constructor(
        private fb: FormBuilder,
        private propertyService: PropertyService,
        private suburbService: SuburbService,
        private toastService: ToastrService
    ) { }

    ngOnInit(): void {
        this.getProperties({ isClear: true });

        this.suburbService.All().subscribe(data => {
            this.suburbs = data.items.map((suburb: Suburb) => {
                return { value: suburb.id, label: suburb.name };
            });
        });

        this.searchForm = this.fb.group({
            search: [''],
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.searchForm.controls;
    }

    changeSelectedProperty(property: Property) {
        this.selectedProperty = property;
        this.selectedPropertySubject.next(property);
    }

    onSuburbSelect(event) {
        this.selectedSuburb = event.value;
    }

    doPagination(event) {
        this.getProperties({ query: event });
    }

    showConfirmDelete(property: Property) {
        Swal.fire({
            title: `<span class="text-danger">Delete ${property.id}?</span>`,
            text: 'All the data associated with this property will be removed.',
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
                this.propertyService.Delete(property.id).subscribe((result) => {
                    if (result.success) {
                        this.toastService.success(`${property.id} deleted!`);
                    }
                    return;
                })
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.getProperties({ query: '' });
            }
        });
    }

    doSearch() {
        if (this.searchForm.invalid) {
            return;
        }
        const query = "?search=" + this.f['search'].value + '&suburb=' + this.selectedSuburb;
        this.getProperties({ query, isSearch: true });
    }

    clearSearch() {
        this.getProperties({ isClear: true });
        this.f['search'].patchValue('');
    }

    getProperties(options: { query?: string, isSearch?: boolean, isClear?: boolean }) {
        this.loading = true;
        this.propertyService.All(options.query).subscribe((data) => {
            this.paginatedProperties = data;
        }).add(() => {
            if (options.isSearch) {
                this.submitted = true;
            }
            if (options.isClear) {
                this.submitted = false;
                this.selectedSuburb = '';
            }
            this.loading = false;
        })
    }
}
