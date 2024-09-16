import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatedResponse } from '@helpers/response.helper';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
    @Input() public pagination: PaginatedResponse<any>;
    @Output() clickedPagination = new EventEmitter<string>();

    clicked(url: string) {
        if (url != null) {
            this.clickedPagination.emit('?' + url);
        }
    }
}
