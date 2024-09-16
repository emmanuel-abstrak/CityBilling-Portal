import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { userRoles } from '@constants/user.roles';
import { PortalUserService } from '@services/api/portal-user.service';
import { Select2Module } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-portal-user',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, Select2Module],
    templateUrl: './add-portal-user.component.html',
    styleUrl: './add-portal-user.component.scss'
})
export class AddPortalUserComponent {
    @Output() userAdded = new EventEmitter<boolean>();
    public loading: boolean = false;
    public submitted: boolean = false;
    public selectedRole = '';
    public selectedGender = '';

    public addForm: FormGroup = new FormGroup({
        email: new FormControl(''),
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        phoneNumber: new FormControl(''),
        password: new FormControl(''),
        role: new FormControl(''),
        gender: new FormControl(''),
    });

    public rolesList = userRoles;

    public genderList = [
        {
            value: 'female',
            label: 'Female'
        },
        {
            value: 'male',
            label: 'Male'
        },
        {
            value: 'other',
            label: 'Other'
        },
    ];

    constructor(private fb: FormBuilder, private portalUserService: PortalUserService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.addForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            phoneNumber: ['', [Validators.required, Validators.pattern('^0[0-9]{9}$')]],
            role: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });

        this.f['password'].patchValue(Math.random().toString(36).slice(-8));
    }

    get f(): { [key: string]: AbstractControl } {
        return this.addForm.controls;
    }

    onRoleSelect(event) {
        this.f['role'].patchValue(event.value);
    }

    onGenderSelect(event) {
        this.f['gender'].patchValue(event.value);
    }

    onSubmit() {
        this.submitted = true;

        if (this.addForm.invalid) {
            return;
        }
        this.loading = true;
        this.portalUserService.Create(this.f['firstName'].value, this.f['lastName'].value, this.f['email'].value, this.f['phoneNumber'].value, this.f['role'].value, this.f['gender'].value, this.f['password'].value).subscribe({
            next: () => {
                this.toastService.success('User added');
                this.userAdded.emit();
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
        this.selectedGender = '';
        this.selectedRole = '';
    }
}
