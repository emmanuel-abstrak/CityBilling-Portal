import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { userRoles } from '@constants/user.roles';
import { User } from '@models/user.model';
import { PortalUserService } from '@services/api/portal-user.service';
import { ToastrService } from 'ngx-toastr';
import { Select2Module } from 'ng-select2-component';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-edit-portal-user',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, Select2Module],
    templateUrl: './edit-portal-user.component.html',
    styleUrl: './edit-portal-user.component.scss'
})
export class EditPortalUserComponent {
    private eventsSubscription: Subscription;
    @Output() userUpdated = new EventEmitter<boolean>();
    @Input() public userSubject: Observable<User>;
    public user: User;
    public loading: boolean = false;
    public submitted: boolean = false;
    public selectedRole = null;
    public selectedGender = null;

    public editForm: FormGroup = new FormGroup({
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
        this.eventsSubscription = this.userSubject.subscribe((user) => {
            this.user = user;
            this.selectedRole = user.role;
            this.selectedGender = user.gender;

            this.editForm = this.fb.group({
                email: [user.email, [Validators.required, Validators.email]],
                firstName: [user.firstName, [Validators.required]],
                lastName: [user.lastName, [Validators.required]],
                phoneNumber: [user.phoneNumber, [Validators.required, Validators.pattern('^0[0-9]{9}$')]],
                role: [user.role, [Validators.required]],
                gender: [user.gender, [Validators.required]]
            });
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.editForm.controls;
    }

    onRoleSelect(event) {
        this.f['role'].patchValue(event.value);
    }

    onGenderSelect(event) {
        this.f['gender'].patchValue(event.value);
    }

    onSubmit() {
        this.submitted = true;

        if (this.editForm.invalid) {
            return;
        }
        this.loading = true;
        this.portalUserService.Update(this.user.id, this.f['firstName'].value, this.f['lastName'].value, this.f['email'].value, this.f['phoneNumber'].value, this.f['role'].value, this.f['gender'].value).subscribe({
            next: (value: User) => {
                this.toastService.success('User updated');
                this.userUpdated.emit();
                this.user = value;
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
