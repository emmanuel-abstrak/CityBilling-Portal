import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '@services/api/service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-service',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './add-service.component.html',
    styleUrl: './add-service.component.scss'
})
export class AddServiceComponent {
    @Output() serviceAdded = new EventEmitter<boolean>();
    public loading: boolean = false;
    public submitted: boolean = false;

    public addForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });

    constructor(private fb: FormBuilder, private serviceService: ServiceService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.addForm = this.fb.group({
            name: ['', [Validators.required]],
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.addForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        if (this.addForm.invalid) {
            return;
        }
        this.loading = true;
        this.serviceService.Create(this.f['name'].value).subscribe({
            next: () => {
                this.toastService.success('Service added');
                this.serviceAdded.emit();
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
    }
}
