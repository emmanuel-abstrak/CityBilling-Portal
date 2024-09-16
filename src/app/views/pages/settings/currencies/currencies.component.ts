import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResponse } from '@helpers/response.helper';
import { Currency } from '@models/currency.model';
import { CurrencyService } from '@services/api/currency.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { AddCurrencyComponent } from "./add-currency/add-currency.component";
import { EditCurrencyComponent } from "./edit-currency/edit-currency.component";

@Component({
    selector: 'app-currencies',
    standalone: true,
    imports: [ReactiveFormsModule, PaginationComponent, AddCurrencyComponent, EditCurrencyComponent],
    templateUrl: './currencies.component.html',
    styleUrl: './currencies.component.scss'
})
export class CurrenciesComponent {
    public selectedCurrency: Currency;
    public selectedCurrencySubject: Subject<Currency> = new Subject<Currency>();
    public paginatedCurrencies: PaginatedResponse<Currency>;
    public submitted = false;
    public loading = false;

    public searchForm: FormGroup = new FormGroup({
        search: new FormControl('')
    });

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private currencyService: CurrencyService,
        private toastService: ToastrService
    ) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(data => {
            this.paginatedCurrencies = data['currenciesState'];
        });

        this.searchForm = this.fb.group({
            search: [''],
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.searchForm.controls;
    }

    changeSelectedCurrency(currency: Currency) {
        this.selectedCurrency = currency;
        this.selectedCurrencySubject.next(currency);
    }

    showConfirmDelete(currency: Currency) {
        Swal.fire({
            title: `<span class="text-danger">Delete ${currency.code}?</span>`,
            text: 'All the data associated with this currency will be removed.',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            reverseButtons: true,
            showLoaderOnConfirm: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: "btn btn-danger",
                cancelButton: "btn btn-light"
            },
            preConfirm: async () => {
                this.currencyService.Delete(currency.id).subscribe((result) => {
                    if (result.success) {
                        this.toastService.success(`${currency.code} deleted!`);
                    }
                    return;
                })
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.getCurrencies({ query: '' });
            }
        });
    }

    doSearch() {
        if (this.searchForm.invalid) {
            return;
        }
        const query = "?search=" + this.f['search'].value;
        this.getCurrencies({ query, isSearch: true });
    }

    clearSearch() {
        this.getCurrencies({ isClear: true });
        this.f['search'].patchValue('');
    }

    getCurrencies(options: { query?: string, isSearch?: boolean, isClear?: boolean }) {
        this.loading = true;
        this.currencyService.All(options.query).subscribe((data) => {
            this.paginatedCurrencies = data;
        }).add(() => {
            if (options.isSearch) {
                this.submitted = true;
            }
            if (options.isClear) {
                this.submitted = false;
            }
            this.loading = false;
        })
    }
}
