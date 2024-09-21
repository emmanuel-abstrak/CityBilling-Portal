import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyType } from '@models/property-type.model';
import { Service } from '@models/service.model';
import { SuburbSelect } from '@models/suburb.model';
import { PropertyTypeService } from '@services/api/property-type.service';
import { ServiceService } from '@services/api/service.service';
import { TariffGroupService } from '@services/api/tariff-group.service';
import { Select2Module } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-tariff',
    standalone: true,
    imports: [ReactiveFormsModule, Select2Module],
    templateUrl: './add-tariff.component.html',
    styleUrl: './add-tariff.component.scss'
})
export class AddTariffComponent {
    @Output() tariffGroupAdded = new EventEmitter<boolean>();
    @Input() suburbList: SuburbSelect[];
    public types: PropertyType[] = [];
    public services: Service[] = [];
    public selectedSuburb = null;
    public loading: boolean = false;
    public submitted: boolean = false;
    public tariffFields: string[] = [];

    public addForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private tarrifGroupService: TariffGroupService,
        private toastService: ToastrService,
        private typeService: PropertyTypeService,
        private serviceService: ServiceService
    ) { }

    ngOnInit(): void {
        this.addForm = this.fb.group({
            suburb: ['', [Validators.required]],
            minSize: ['', [Validators.required]],
            maxSize: ['', [Validators.required]],
        });

        this.typeService.All().subscribe((typesData) => {
            this.types = typesData.items;
            this.serviceService.All().subscribe((servicesData) => {
                this.services = servicesData.items;

                this.types.forEach((type) => {
                    this.services.forEach((service) => {
                        var name = `${type.id}_${service.id}`.toLowerCase();
                        this.tariffFields.push(name);
                        this.addForm.addControl(name, new FormControl('', [Validators.required]));
                    });
                });
            });
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.addForm.controls;
    }

    onSuburbSelect(event) {
        this.f['suburb'].patchValue(event.value);
        this.selectedSuburb = event.value;
    }

    onSubmit() {
        this.submitted = true;

        if (this.addForm.invalid) {
            return;
        }
        this.loading = true;

        var charges = this.tariffFields.map((field) => {
            return {
                field,
                value: this.f[field].value
            }
        });
        console.table(charges);

        this.tarrifGroupService.Create(
            this.f['suburb'].value,
            this.f['minSize'].value,
            this.f['maxSize'].value,
            charges

        ).subscribe({
            next: () => {
                this.toastService.success('Tariff group added');
                this.tariffGroupAdded.emit();
                this.resetForm();
            },
        }).add(() => {
            this.loading = false;
            this.submitted = false;
        });
    }

    resetForm() {
        this.f['minSize'].patchValue('');
        this.f['maxSize'].patchValue('');
        this.f['residentialRatesCharge'].patchValue('');
        this.f['residentialRefuseCharge'].patchValue('');
        this.f['residentialSewerageCharge'].patchValue('');
        this.f['commercialRatesCharge'].patchValue('');
        this.f['commercialRefuseCharge'].patchValue('');
        this.f['commercialSewerageCharge'].patchValue('');
        this.addForm.clearAsyncValidators();
    }
}
