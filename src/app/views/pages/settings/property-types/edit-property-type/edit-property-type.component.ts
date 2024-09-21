import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyType } from '@models/property-type.model';
import { PropertyTypeService } from '@services/api/property-type.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-property-type',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-property-type.component.html',
  styleUrl: './edit-property-type.component.scss'
})
export class EditPropertyTypeComponent {
    private eventsSubscription: Subscription;
    @Output() typeUpdated = new EventEmitter<boolean>();
    @Input() public typeSubject: Observable<PropertyType>;
    public type: PropertyType;
    public loading: boolean = false;
    public submitted: boolean = false;

    public editForm: FormGroup = new FormGroup({
        name: new FormControl(''),
        price: new FormControl(''),
        cutoff: new FormControl(''),
        cutoffPrice: new FormControl(''),
        pricingStructure: new FormControl(''),
    });

    constructor(private fb: FormBuilder, private typeService: PropertyTypeService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.eventsSubscription = this.typeSubject.subscribe((type) => {
            this.type = type;

            this.editForm = this.fb.group({
                name: [type.name, [Validators.required]],
                price: [type.price, [Validators.required]],
                cutoff: [type.cutoff, [Validators.nullValidator]],
                cutoffPrice: [type.cutoffPrice, [Validators.nullValidator]],
                pricingStructure: [type.cutoff ? 'stepped' : 'fixed', [Validators.required]],
            });
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.editForm.controls;
    }

    structureChanged = (args: any) => {
        if (args.target.value == 'stepped') {
            this.editForm.controls['cutoff'].setValidators([Validators.required]);
            this.editForm.controls['cutoffPrice'].setValidators([Validators.required]);
        } else {
            this.editForm.controls['cutoff'].clearValidators();
            this.editForm.controls['cutoffPrice'].clearValidators();
        }
        this.editForm.controls['cutoff'].updateValueAndValidity();
        this.editForm.controls['cutoffPrice'].updateValueAndValidity();
    }

    onSubmit() {
        this.submitted = true;

        if (this.editForm.invalid) {
            return;
        }
        this.loading = true;
        this.typeService.Update(
            this.type.id,
            this.f['name'].value,
            this.f['price'].value,
            this.f['cutoff'].value,
            this.f['cutoffPrice'].value
        ).subscribe({
            next: (value: PropertyType) => {
                this.toastService.success('Type updated');
                this.typeUpdated.emit();
                this.type = value;
            },
        }).add(() => {
            this.loading = false;
            this.submitted = false;
        });
    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }
}
