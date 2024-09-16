import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/api/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    public loading: boolean = false;
    public submitted: boolean = false;

    public loginForm: FormGroup = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    });

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            username: ['emmanuel@abstrak.agency', [Validators.required]],
            password: ['password', [Validators.required]]
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.authService.Login(this.f['username'].value, this.f['password'].value).subscribe({
            next: () => {
                this.router.navigateByUrl('/');
            },
        }).add(() => this.loading = false);
    }
}
