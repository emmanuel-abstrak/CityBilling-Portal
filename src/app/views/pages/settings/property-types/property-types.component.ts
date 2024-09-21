import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginatedResponse } from '@helpers/response.helper';
import { PropertyType } from '@models/property-type.model';
import { PropertyTypeService } from '@services/api/property-type.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { AddPropertyTypeComponent } from "./add-property-type/add-property-type.component";
import { EditPropertyTypeComponent } from "./edit-property-type/edit-property-type.component";

@Component({
    selector: 'app-property-types',
    standalone: true,
    imports: [ReactiveFormsModule, PaginationComponent, AddPropertyTypeComponent, EditPropertyTypeComponent],
    templateUrl: './property-types.component.html',
    styleUrl: './property-types.component.scss'
})
export class PropertyTypesComponent {
    public selectedType: PropertyType;
    public selectedTypeSubject: Subject<PropertyType> = new Subject<PropertyType>();
    public paginatedTypes: PaginatedResponse<PropertyType>;
    public submitted = false;
    public loading = false;

    public searchForm: FormGroup = new FormGroup({
        search: new FormControl('')
    });

    constructor(
        private fb: FormBuilder,
        private typeService: PropertyTypeService,
        private toastService: ToastrService
    ) { }

    ngOnInit(): void {
        this.getPropertyTypes({});

        this.searchForm = this.fb.group({
            search: [''],
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.searchForm.controls;
    }

    changeSelectedType(type: PropertyType) {
        this.selectedType = type;
        this.selectedTypeSubject.next(type);
    }

    showConfirmDelete(type: PropertyType) {
        Swal.fire({
            title: `<span class="text-danger">Delete ${type.name}?</span>`,
            text: 'All the data associated with this type will be removed.',
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
                this.typeService.Delete(type.id).subscribe((result) => {
                    if (result.success) {
                        this.toastService.success(`${type.name} deleted!`);
                    }
                    return;
                })
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.paginatedTypes.items = this.paginatedTypes.items.filter((t: PropertyType) => t.id != type.id);
            }
        });
    }

    doSearch() {
        if (this.searchForm.invalid) {
            return;
        }
        const query = "?search=" + this.f['search'].value;
        this.getPropertyTypes({ query, isSearch: true });
    }

    clearSearch() {
        this.getPropertyTypes({ isClear: true });
        this.f['search'].patchValue('');
    }

    getPropertyTypes(options: { query?: string, isSearch?: boolean, isClear?: boolean }) {
        this.loading = true;
        this.typeService.All(options.query).subscribe((data) => {
            this.paginatedTypes = data;
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
