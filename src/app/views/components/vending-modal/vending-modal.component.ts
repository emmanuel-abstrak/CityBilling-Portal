import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Property } from '@models/property.model';
import { VendingSummary } from '@models/vending-summary.model';
import { VendingService } from '@services/api/vending.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-vending-modal',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './vending-modal.component.html',
    styleUrl: './vending-modal.component.scss'
})
export class VendingModalComponent {
    private eventsSubscription: Subscription;
    @Input() public propertySubject: Observable<Property>;
    public property: Property;
    public loading: boolean = false;
    public submitted: boolean = false;

    public step: number = 1;
    public vendingSummary: VendingSummary;

    public vendForm: FormGroup = new FormGroup({
        rates: new FormControl(''),
        refuse: new FormControl(''),
        sewer: new FormControl(''),
    });

    constructor(private fb: FormBuilder, private vendingService: VendingService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.eventsSubscription = this.propertySubject.subscribe((property) => {
            this.property = property;
            this.vendForm = this.fb.group({
                rates: [property.balances.rates, [Validators.required]],
                refuse: [property.balances.refuse, [Validators.required]],
                sewer: [property.balances.sewer, [Validators.required]]
            });
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.vendForm.controls;
    }

    onSubmit = () => {
        this.submitted = true;

        if (this.vendForm.invalid) {
            return;
        }
        this.loading = true;

        this.vendingService.Lookup(this.f['meter'].value, this.f['amount'].value, this.f['currency'].value)
            .subscribe({
                next: (summary) => {
                    this.step = 2;
                    this.vendingSummary = summary;
                },
            }).add(() => {
                this.loading = false;
                this.submitted = false;
            });
    }

    CompletePurchase = () => {
        this.submitted = true;

        if (this.vendForm.invalid) {
            return;
        }
        this.loading = true;

        this.vendingService.Vend(this.f['meter'].value, this.f['amount'].value, this.f['currency'].value)
            .subscribe({
                next: (summary) => {
                    this.step = 3;
                    this.vendingSummary = summary;
                },
            }).add(() => {
                this.loading = false;
                this.submitted = false;
            });
    }

    resetForm() {
        this.vendForm.reset();
        this.vendForm.clearAsyncValidators();
    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }
}
