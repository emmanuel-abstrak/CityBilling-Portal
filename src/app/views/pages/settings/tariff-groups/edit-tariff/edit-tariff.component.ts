import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TariffGroup } from '@models/tariff-group.model';
import { TariffGroupService } from '@services/api/tariff-group.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-edit-tariff',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './edit-tariff.component.html',
    styleUrl: './edit-tariff.component.scss'
})
export class EditTariffComponent {
    private eventsSubscription: Subscription;
    @Output() tariffGroupUpdated = new EventEmitter<boolean>();
    @Input() public tariffGroupSubject: Observable<TariffGroup>;
    public tariff: TariffGroup;
    public loading: boolean = false;
    public submitted: boolean = false;

    public editForm: FormGroup = new FormGroup({
        minSize: new FormControl(''),
        maxSize: new FormControl(''),
        residentialRatesCharge: new FormControl(''),
        residentialRefuseCharge: new FormControl(''),
        residentialSewerageCharge: new FormControl(''),
        commercialRatesCharge: new FormControl(''),
        commercialRefuseCharge: new FormControl(''),
        commercialSewerageCharge: new FormControl(''),
    });

    constructor(
        private fb: FormBuilder,
        private tariffGroupService: TariffGroupService,
        private toastService: ToastrService
    ) { }

    ngOnInit(): void {
        this.eventsSubscription = this.tariffGroupSubject.subscribe((tariff) => {
            this.tariff = tariff;

            this.editForm = this.fb.group({
                suburb: [tariff.suburb.id, [Validators.required]],
                minSize: [tariff.minSize, [Validators.required]],
                maxSize: [tariff.maxSize, [Validators.required]],
                residentialRatesCharge: [tariff.residentialRatesCharge, [Validators.required]],
                residentialRefuseCharge: [tariff.residentialRefuseCharge, [Validators.required]],
                residentialSewerageCharge: [tariff.residentialSewerageCharge, [Validators.required]],
                commercialRatesCharge: [tariff.commercialRatesCharge, [Validators.required]],
                commercialRefuseCharge: [tariff.commercialRefuseCharge, [Validators.required]],
                commercialSewerageCharge: [tariff.commercialSewerageCharge, [Validators.required]],
            });
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.editForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        if (this.editForm.invalid) {
            return;
        }
        this.loading = true;
        this.tariffGroupService.Update(
            this.tariff.id,
            this.f['minSize'].value,
            this.f['maxSize'].value,
            this.f['residentialRatesCharge'].value,
            this.f['residentialRefuseCharge'].value,
            this.f['residentialSewerageCharge'].value,
            this.f['commercialRatesCharge'].value,
            this.f['commercialRefuseCharge'].value,
            this.f['commercialSewerageCharge'].value,
        ).subscribe({
            next: (value: TariffGroup) => {
                this.toastService.success('Tariff group updated');
                this.tariffGroupUpdated.emit();
                this.tariff = value;
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
