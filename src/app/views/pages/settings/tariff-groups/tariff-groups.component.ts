import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatedResponse } from '@helpers/response.helper';
import { Suburb, SuburbSelect } from '@models/suburb.model';
import { TariffGroup } from '@models/tariff-group.model';
import { TariffGroupService } from '@services/api/tariff-group.service';
import { Select2Module } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AddTariffComponent } from "./add-tariff/add-tariff.component";
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { EditTariffComponent } from "./edit-tariff/edit-tariff.component";
import { SuburbService } from '@services/api/suburb.service';
import { ViewTariffChargesComponent } from "./view-tariff-charges/view-tariff-charges.component";

@Component({
    selector: 'app-tariff-groups',
    standalone: true,
    imports: [ReactiveFormsModule, Select2Module, AddTariffComponent, PaginationComponent, EditTariffComponent, ViewTariffChargesComponent],
    templateUrl: './tariff-groups.component.html',
    styleUrl: './tariff-groups.component.scss'
})
export class TariffGroupsComponent {
    public selectedTariffGroup: TariffGroup;
    public selectedTariffGroupSubject: Subject<TariffGroup> = new Subject<TariffGroup>();
    public paginatedTariffGroups: PaginatedResponse<TariffGroup>;
    public suburbs: SuburbSelect[] = [];
    public suburbAddSelectList: SuburbSelect[];
    public selectedSuburb = '';
    public submitted = false;
    public loading = false;

    constructor(
        private tariffGroupService: TariffGroupService,
        private suburbService: SuburbService,
        private toastService: ToastrService
    ) { }

    ngOnInit(): void {
        this.getTariffGroups({});

        this.suburbService.All().subscribe(data => {
            const subs = data.items.map((suburb: Suburb) => {
                return { value: suburb.id, label: suburb.name };
            });

            this.suburbs = [{ value: null, label: 'All Suburbs' }, ...subs];
            this.suburbAddSelectList = subs;
        });
    }

    changeSelectedTariff(tariff: TariffGroup) {
        this.selectedTariffGroup = tariff;
        this.selectedTariffGroupSubject.next(tariff);
    }

    onSuburbSelect(event) {
        this.selectedSuburb = event.value;
        const query = '?suburb=' + event.value;
        this.getTariffGroups({ query, isSearch: true });
    }

    showConfirmDelete(tariff: TariffGroup) {
        Swal.fire({
            title: `<span class="text-danger">Delete ${tariff.suburb.name} tariff?</span>`,
            text: 'All the data associated with this group will be removed.',
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
                this.tariffGroupService.Delete(tariff.id).subscribe((result) => {
                    if (result.success) {
                        this.toastService.success(`${tariff.suburb.name} deleted!`);
                    }
                    return;
                })
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.paginatedTariffGroups.items = this.paginatedTariffGroups.items.filter((t: TariffGroup) => t.id != tariff.id);
            }
        });;
    }

    clearSearch() {
        this.getTariffGroups({ isClear: true });
        this.selectedSuburb = '';
    }

    getTariffGroups(options: { query?: string, isSearch?: boolean, isClear?: boolean }) {
        this.loading = true;
        this.tariffGroupService.All(options.query).subscribe((data) => {
            this.paginatedTariffGroups = data;
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
