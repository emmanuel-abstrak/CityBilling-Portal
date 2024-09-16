import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyService } from '@services/api/currency.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-currency',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './add-currency.component.html',
    styleUrl: './add-currency.component.scss'
})
export class AddCurrencyComponent {
    @Output() currencyAdded = new EventEmitter<boolean>();
    public loading: boolean = false;
    public submitted: boolean = false;

    public addForm: FormGroup = new FormGroup({
        code: new FormControl(''),
        symbol: new FormControl(''),
        rate: new FormControl(''),
    });

    constructor(private fb: FormBuilder, private currencyService: CurrencyService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.addForm = this.fb.group({
            code: ['', [Validators.required]],
            symbol: ['', [Validators.required]],
            rate: ['', [Validators.required]],
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
        this.currencyService.Create(this.f['code'].value, this.f['symbol'].value, this.f['rate'].value).subscribe({
            next: () => {
                this.toastService.success('Currency added');
                this.currencyAdded.emit();
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
