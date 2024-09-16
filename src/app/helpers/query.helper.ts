import { Location } from '@angular/common';
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class QueryHelper {
    constructor(private location: Location) { }
    public getQueryString(): string {
        const [_, query] = this.location.path().split('?');
        return query ? '?' + query : '';
    }

    public appendQuery(query: string, replace: boolean = false) {
        const [path, _] = this.location.path().split('?');
        if (replace) {
            this.location.go(path, query);
        }
    }
}
