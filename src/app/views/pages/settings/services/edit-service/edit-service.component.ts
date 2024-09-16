import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service } from '@models/service.model';
import { ServiceService } from '@services/api/service.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-edit-service',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './edit-service.component.html',
    styleUrl: './edit-service.component.scss'
})
export class EditServiceComponent {
    private eventsSubscription: Subscription;
    @Output() serviceUpdated = new EventEmitter<boolean>();
    @Input() public serviceSubject: Observable<Service>;
    public service: Service;
    public loading: boolean = false;
    public submitted: boolean = false;

    public editForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });

    constructor(private fb: FormBuilder, private serviceService: ServiceService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.eventsSubscription = this.serviceSubject.subscribe((service) => {
            this.service = service;

            this.editForm = this.fb.group({
                name: [service.name, [Validators.required]]
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
        this.serviceService.Update(this.service.id, this.f['name'].value).subscribe({
            next: (value: Service) => {
                this.toastService.success('Suburb updated');
                this.serviceUpdated.emit();
                this.service = value;
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
