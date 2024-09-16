import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Service } from '@models/service.model';
import { ServiceService } from '@services/api/service.service';
import { Observable, Subscription } from 'rxjs';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-reorder-services',
    standalone: true,
    imports: [CdkDropList, CdkDrag],
    templateUrl: './reorder-services.component.html',
    styleUrl: './reorder-services.component.scss'
})
export class ReorderServicesComponent implements OnInit {
    @Output() serviceOrdered = new EventEmitter<boolean>();
    @Input() public servicesSubject: Observable<Service[]>;

    public services: Service[];
    public loading: boolean;
    public ordered: boolean = false;

    constructor(private serviceService: ServiceService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.servicesSubject.subscribe((services) => {
            this.services = services;
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        this.ordered = true;
        moveItemInArray(this.services, event.previousIndex, event.currentIndex);
    }

    submit = () => {
        this.loading = true;
        this.serviceService.Reorder(this.services.map((d) => d.id)).subscribe({
            next: () => {
                this.toastService.success('Suburb updated');
                this.serviceOrdered.emit();
            },
        }).add(() => {
            this.loading = false;
        });
    }
}
