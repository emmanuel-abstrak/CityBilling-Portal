import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyTypeService } from '@services/api/property-type.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-property-type',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './add-property-type.component.html',
    styleUrl: './add-property-type.component.scss'
})
export class AddPropertyTypeComponent {
    @Output() typeAdded = new EventEmitter<boolean>();
    public loading: boolean = false;
    public submitted: boolean = false;

    public addForm: FormGroup = new FormGroup({
        name: new FormControl(''),
        price: new FormControl(''),
        cutoff: new FormControl(''),
        cutoffPrice: new FormControl(''),
        pricingStructure: new FormControl(''),
    });

    constructor(private fb: FormBuilder, private typeService: PropertyTypeService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.addForm = this.fb.group({
            name: ['', [Validators.required]],
            price: ['', [Validators.required]],
            cutoff: ['', [Validators.nullValidator]],
            cutoffPrice: ['', [Validators.nullValidator]],
            pricingStructure: ['fixed', [Validators.required]],
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.addForm.controls;
    }

    structureChanged = (args: any) => {
        if (args.target.value == 'stepped') {
            this.addForm.controls['cutoff'].setValidators([Validators.required]);
            this.addForm.controls['cutoffPrice'].setValidators([Validators.required]);
        } else {
            this.addForm.controls['cutoff'].clearValidators();
            this.addForm.controls['cutoffPrice'].clearValidators();
        }
        this.addForm.controls['cutoff'].updateValueAndValidity();
        this.addForm.controls['cutoffPrice'].updateValueAndValidity();
    }

    onSubmit() {
        this.submitted = true;

        if (this.addForm.invalid) {
            return;
        }
        this.loading = true;
        this.typeService.Create(
            this.f['name'].value,
            this.f['price'].value,
            this.f['cutoff'].value,
            this.f['cutoffPrice'].value
        )
            .subscribe({
                next: () => {
                    this.toastService.success('Type added');
                    this.typeAdded.emit();
                    this.resetForm();
                },
            }).add(() => {
                this.loading = false;
                this.submitted = false;
            });
    }

    resetForm() {
        this.addForm.reset();
        this.f['pricingStructure'].patchValue('fixed');
        this.addForm.clearAsyncValidators();
        this.addForm.controls['cutoff'].clearValidators();
        this.addForm.controls['cutoffPrice'].clearValidators();
        this.addForm.controls['cutoff'].updateValueAndValidity();
        this.addForm.controls['cutoffPrice'].updateValueAndValidity();
    }
}
