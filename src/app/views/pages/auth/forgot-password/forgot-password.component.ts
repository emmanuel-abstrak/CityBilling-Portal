import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/api/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
    public loading: boolean = false;
    public submitted: boolean = false;

    public forgotForm: FormGroup = new FormGroup({
        email: new FormControl('')
    });

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.forgotForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.forgotForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        if (this.forgotForm.invalid) {
            return;
        }
        this.loading = true;
        this.authService.Login(this.f['email'].value, this.f['password'].value).subscribe({
            next: () => {
                this.router.navigateByUrl('/');
            },
        }).add(() => this.loading = false);
    }
}
