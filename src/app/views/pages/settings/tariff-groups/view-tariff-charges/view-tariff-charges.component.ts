import { Component, Input, OnInit } from '@angular/core';
import { TariffGroup } from '@models/tariff-group.model';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-view-tariff-charges',
    standalone: true,
    imports: [],
    templateUrl: './view-tariff-charges.component.html',
    styleUrl: './view-tariff-charges.component.scss'
})
export class ViewTariffChargesComponent implements OnInit {
    private eventsSubscription: Subscription;
    @Input() public tariffGroupSubject: Observable<TariffGroup>;
    public tariff: TariffGroup;

    ngOnInit(): void {
        this.eventsSubscription = this.tariffGroupSubject.subscribe((tariff) => {
            this.tariff = tariff;
        });
    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }
}
