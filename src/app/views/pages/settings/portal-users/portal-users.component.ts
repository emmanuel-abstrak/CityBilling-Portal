import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResponse } from '@helpers/response.helper';
import { Select2Module } from 'ng-select2-component';
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { PortalUserService } from '@services/api/portal-user.service';
import { userRoles } from '@constants/user.roles';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { User } from '@models/user.model';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AddPortalUserComponent } from './add-portal-user/add-portal-user.component';
import { EditPortalUserComponent } from './edit-portal-user/edit-portal-user.component';

@Component({
    selector: 'app-portal-users',
    standalone: true,
    imports: [
        Select2Module,
        NgIf,
        CommonModule,
        PaginationComponent,
        AddPortalUserComponent,
        EditPortalUserComponent
    ],
    templateUrl: './portal-users.component.html',
    styleUrl: './portal-users.component.scss'
})
export class PortalUsersComponent implements OnInit {
    public selectedUser: User;
    public selectedUserSubject: Subject<User> = new Subject<User>();
    public paginatedUsers: PaginatedResponse<User>;
    public roles = [
        {
            value: '',
            label: 'All Roles'
        }, ...userRoles
    ];
    public selectedRole: string = '';
    public searchForm: FormGroup = new FormGroup({
        search: new FormControl(''),
        role: new FormControl('')
    });
    public submitted = false;
    public loading = false;

    constructor(
        private fb: FormBuilder,
        private portalUserService: PortalUserService,
        private toastService: ToastrService
    ) { }

    ngOnInit(): void {
        this.getUsers({});

        this.searchForm = this.fb.group({
            search: [''],
            role: ['']
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.searchForm.controls;
    }

    changeSelectedUser(user: User) {
        this.selectedUser = user;
        this.selectedUserSubject.next(user);
    }

    doSearch() {
        if (this.searchForm.invalid) {
            return;
        }
        const query = "?search=" + this.f['search'].value + "&role=" + this.f['role'].value;
        this.getUsers({ query, isSearch: true });
    }

    clearSearch() {
        this.getUsers({ isClear: true });
        this.f['search'].patchValue('');
        this.f['role'].patchValue('');
        this.selectedRole = '';
    }

    onRoleSelect(event) {
        this.selectedRole = event.value;
        this.f['role'].patchValue(event.value);
    }

    doPagination(event) {
        this.getUsers({ query: event });
    }

    getUsers(options: { query?: string, isSearch?: boolean, isClear?: boolean }) {
        this.loading = true;
        this.portalUserService.All(options.query ?? '').subscribe((data) => {
            this.paginatedUsers = data;
        }).add(() => {
            if (options.isSearch) {
                this.submitted = true;
            }
            if (options.isClear) {
                this.submitted = false;
            }
            this.loading = false;
        });
    }

    showConfirmDelete(user: User) {
        Swal.fire({
            title: `<span class="text-danger">Delete ${user.firstName}?</span>`,
            text: 'All the data associated with this user will be removed.',
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
                this.portalUserService.Delete(user.id).subscribe((result) => {
                    if (result.success) {
                        this.toastService.success(`${user.firstName} deleted!`);
                    }
                    return;
                })
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.paginatedUsers.items = this.paginatedUsers.items.filter((u: User) => u.id != user.id);
            }
        });
    }
}
