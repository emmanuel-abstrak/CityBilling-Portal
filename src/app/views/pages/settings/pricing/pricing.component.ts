import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginatedResponse } from '@helpers/response.helper';
import { Pricing } from '@models/pricing.model';
import { PricingService } from '@services/api/pricing.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {
    public selectedPricing: Pricing;
    public selectedPricingSubject: Subject<Pricing> = new Subject<Pricing>();
    public pricingSubject: Subject<Pricing[]> = new Subject<Pricing[]>();
    public paginatedPricings: PaginatedResponse<Pricing>;
    public submitted = false;
    public loading = false;

    public searchForm: FormGroup = new FormGroup({
        search: new FormControl('')
    });

    constructor(
        private fb: FormBuilder,
        private pricingService: PricingService,
        private toastService: ToastrService
    ) { }

    ngOnInit(): void {
        this.getPrices({});

        this.searchForm = this.fb.group({
            search: [''],
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.searchForm.controls;
    }

    changeSelectedService(pricing: Pricing) {
        this.selectedPricing = pricing;
        this.selectedPricingSubject.next(pricing);
    }

    showConfirmDelete(pricing: Pricing) {
        Swal.fire({
            title: `<span class="text-danger">Delete ${pricing.name}?</span>`,
            text: 'All the data associated with this pricing will be removed.',
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
                this.pricingService.Delete(pricing.id).subscribe((result) => {
                    if (result.success) {
                        this.toastService.success(`${pricing.name} deleted!`);
                    }
                    return;
                })
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.getPrices({ query: '' });
            }
        });
    }

    doSearch() {
        if (this.searchForm.invalid) {
            return;
        }
        const query = "?search=" + this.f['search'].value;
        this.getPrices({ query, isSearch: true });
    }

    clearSearch() {
        this.getPrices({ isClear: true });
        this.f['search'].patchValue('');
    }

    getPrices(options: { query?: string, isSearch?: boolean, isClear?: boolean }) {
        this.loading = true;
        this.pricingService.All(options.query).subscribe((data) => {
            this.paginatedPricings = data;
            this.pricingSubject.next(data.items);
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
