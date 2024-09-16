import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuburbService } from '@services/api/suburb.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-suburb',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './add-suburb.component.html',
    styleUrl: './add-suburb.component.scss'
})
export class AddSuburbComponent {
    @Output() suburbAdded = new EventEmitter<boolean>();
    public loading: boolean = false;
    public submitted: boolean = false;

    public addForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });

    constructor(private fb: FormBuilder, private suburbService: SuburbService, private toastService: ToastrService) { }

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
        this.suburbService.Create(this.f['name'].value).subscribe({
            next: () => {
                this.toastService.success('Suburb added');
                this.suburbAdded.emit();
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
