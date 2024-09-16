import { Injectable } from '@angular/core';

export interface PaginationLink {
    url?: string;
    label?: string;
    active?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PaginationService {

    constructor() { }
}
