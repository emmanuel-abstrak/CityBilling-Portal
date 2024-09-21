import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyTypeSelect } from '@models/property-type.model';
import { SuburbSelect } from '@models/suburb.model';
import { PropertyService } from '@services/api/property.service';
import { Select2Module } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-property',
    standalone: true,
    imports: [ReactiveFormsModule, Select2Module],
    templateUrl: './add-property.component.html',
    styleUrl: './add-property.component.scss'
})
export class AddPropertyComponent {
    @Output() propertyAdded = new EventEmitter<boolean>();
    @Input() suburbList: SuburbSelect[];
    @Input() typesList: PropertyTypeSelect[];
    public loading: boolean = false;
    public submitted: boolean = false;
    public selectedSuburb = null;
    public selectedType = null;

    public addForm: FormGroup = new FormGroup({
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
        sendNotification: new FormControl(''),
    });
    
    constructor(private fb: FormBuilder, private propertyService: PropertyService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.addForm = this.fb.group({
            ownerFirstName: ['', [Validators.required]],
            ownerLastName: ['', [Validators.required]],
            ownerEmail: ['', [Validators.required, Validators.email]],
            ownerPhoneNumber: ['', [Validators.required, Validators.pattern('^0[0-9]{9}$')]],
            ownerId: ['', [Validators.required, Validators.pattern('^[1-9]{2}-[1-9]{6}[A-Z][1-9]{2}$')]],
            propertyStreetAddress: ['', [Validators.required]],
            propertySuburb: ['', [Validators.required]],
            propertyType: ['', [Validators.required]],
            propertySize: ['', [Validators.required, Validators.min(1)]],
            propertyMeter: ['', [Validators.required, Validators.pattern('[0-9]*')]],
            sendNotification: [true],
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.addForm.controls;
    }

    onTypeSelect(event) {
        this.f['propertyType'].patchValue(event.value);
    }

    onSuburbSelect(event) {
        this.f['propertySuburb'].patchValue(event.value);
    }

    onSubmit() {
        this.submitted = true;

        if (this.addForm.invalid) {
            return;
        }
        this.loading = true;

        this.propertyService.Create(
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
            this.f['sendNotification'].value,
        ).subscribe({
            next: () => {
                this.toastService.success('Property added');
                this.propertyAdded.emit();
                this.resetForm();
            },
        }).add(() => {
            this.loading = false;
            this.submitted = false;
        });
    }

    resetForm() {
        this.addForm.reset();
        this.addForm.clearAsyncValidators();
        this.selectedSuburb = null;
        this.selectedType = null;
    }
}
