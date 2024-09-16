import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuburbSelect } from '@models/suburb.model';
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
    public selectedSuburb = null;
    public loading: boolean = false;
    public submitted: boolean = false;

    public addForm: FormGroup = new FormGroup({
        suburb: new FormControl(''),
        minSize: new FormControl(''),
        maxSize: new FormControl(''),
        residentialRatesCharge: new FormControl(''),
        residentialRefuseCharge: new FormControl(''),
        residentialSewerageCharge: new FormControl(''),
        commercialRatesCharge: new FormControl(''),
        commercialRefuseCharge: new FormControl(''),
        commercialSewerageCharge: new FormControl(''),
    });

    constructor(private fb: FormBuilder, private tarrifGroupService: TariffGroupService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.addForm = this.fb.group({
            suburb: ['', [Validators.required]],
            minSize: ['', [Validators.required]],
            maxSize: ['', [Validators.required]],
            residentialRatesCharge: ['', [Validators.required]],
            residentialRefuseCharge: ['', [Validators.required]],
            residentialSewerageCharge: ['', [Validators.required]],
            commercialRatesCharge: ['', [Validators.required]],
            commercialRefuseCharge: ['', [Validators.required]],
            commercialSewerageCharge: ['', [Validators.required]],
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

        this.tarrifGroupService.Create(
            this.f['suburb'].value,
            this.f['minSize'].value,
            this.f['maxSize'].value,
            this.f['residentialRatesCharge'].value,
            this.f['residentialRefuseCharge'].value,
            this.f['residentialSewerageCharge'].value,
            this.f['commercialRatesCharge'].value,
            this.f['commercialRefuseCharge'].value,
            this.f['commercialSewerageCharge'].value,
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
