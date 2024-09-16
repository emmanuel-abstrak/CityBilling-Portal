import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Currency } from '@models/currency.model';
import { CurrencyService } from '@services/api/currency.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-currency',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-currency.component.html',
  styleUrl: './edit-currency.component.scss'
})
export class EditCurrencyComponent {
    private eventsSubscription: Subscription;
    @Output() currencyUpdated = new EventEmitter<boolean>();
    @Input() public currencySubject: Observable<Currency>;
    public currency: Currency;
    public loading: boolean = false;
    public submitted: boolean = false;

    public editForm: FormGroup = new FormGroup({
        code: new FormControl(''),
        symbol: new FormControl(''),
        rate: new FormControl(''),
    });

    constructor(private fb: FormBuilder, private currencyService: CurrencyService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.eventsSubscription = this.currencySubject.subscribe((currency) => {
            this.currency = currency;

            this.editForm = this.fb.group({
                code: [currency.code, [Validators.required]],
                symbol: [currency.symbol, [Validators.required]],
                rate: [currency.exchangeRate, [Validators.required]],
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
        this.currencyService.Update(this.currency.id, this.f['code'].value, this.f['symbol'].value, this.f['rate'].value).subscribe({
            next: (value: Currency) => {
                this.toastService.success('Currency updated');
                this.currencyUpdated.emit();
                this.currency = value;
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
