import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@models/user.model';
import { map } from 'rxjs';

@Pipe({
    name: 'filter',
    standalone: true
})
export class PermissionsPipe implements PipeTransform {
    user: User;
    constructor(private activatedRoute: ActivatedRoute) {
        activatedRoute.data.pipe(map((data) => { this.user = data['currentUserState'] }));
    }

    transform(roles: string[]): boolean {
        return roles.includes(this.user.role);
    }
}
