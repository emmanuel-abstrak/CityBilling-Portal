import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Property } from '@models/property.model';
import { SuburbSelect } from '@models/suburb.model';
import { PropertyService } from '@services/api/property.service';
import { Select2Module } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-edit-property',
    standalone: true,
    imports: [ReactiveFormsModule, Select2Module],
    templateUrl: './edit-property.component.html',
    styleUrl: './edit-property.component.scss'
})
export class EditPropertyComponent {
    private eventsSubscription: Subscription;
    @Output() propertyUpdated = new EventEmitter<boolean>();
    @Input() suburbList: SuburbSelect[];
    @Input() public propertySubject: Observable<Property>;
    public property: Property;
    public selectedSuburb;
    public selectedType;
    public loading: boolean = false;
    public submitted: boolean = false;

    public editForm: FormGroup = new FormGroup({
        ownerFirstName: new FormControl(''),
        ownerLastName: new FormControl(''),
        ownerEmail: new FormControl(''),
        ownerPhoneNumber: new FormControl(''),
        ownerId: new FormControl(''),
        propertyStreetAddress: new FormControl(''),
        propertySuburb: new FormControl(''),
        propertyType: new FormControl(''),
        propertySize: new FormControl(''),
        propertyMeter: new FormControl(''),
    });

    public typesList = [
        {
            value: 'residential',
            label: 'Residential'
        },
        {
            value: 'commercial',
            label: 'Commercial'
        },
    ];

    constructor(private fb: FormBuilder, private propertyService: PropertyService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.eventsSubscription = this.propertySubject.subscribe((property) => {
            this.property = property;
            this.selectedSuburb = property.suburb.id;
            this.selectedType = property.type;

            this.editForm = this.fb.group({
                ownerFirstName: [property.owner.firstName, [Validators.required]],
                ownerLastName: [property.owner.lastName, [Validators.required]],
                ownerEmail: [property.owner.email, [Validators.required, Validators.email]],
                ownerPhoneNumber: [property.owner.phoneNumber, [Validators.required, Validators.pattern('^0[0-9]{9}$')]],
                ownerId: [property.owner.idNumber, [Validators.required, Validators.pattern('^[1-9]{2}-[1-9]{6}[A-Z][1-9]{2}$')]],
                propertyStreetAddress: [property.address, [Validators.required]],
                propertySuburb: [property.suburb.id, [Validators.required]],
                propertyType: [property.type, [Validators.required]],
                propertySize: [property.size, [Validators.required, Validators.min(1)]],
                propertyMeter: [property.meter, [Validators.required, Validators.pattern('[0-9]*')]]
            });
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.editForm.controls;
    }

    onTypeSelect(event) {
        this.f['propertyType'].patchValue(event.value);
    }

    onSuburbSelect(event) {
        this.f['propertySuburb'].patchValue(event.value);
    }

    onSubmit() {
        this.submitted = true;

        if (this.editForm.invalid) {
            return;
        }
        this.loading = true;
        this.propertyService.Update(
            this.property.id,
            this.f['ownerFirstName'].value,
            this.f['ownerLastName'].value,
            this.f['ownerEmail'].value,
            this.f['ownerPhoneNumber'].value,
            this.f['ownerId'].value,
            this.f['propertyStreetAddress'].value,
            this.f['propertySuburb'].value,
            this.f['propertyType'].value,
            this.f['propertySize'].value,
            this.f['propertyMeter'].value,
        ).subscribe({
            next: (value: Property) => {
                this.toastService.success('Property updated');
                this.propertyUpdated.emit();
                this.property = value;
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
