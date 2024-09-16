import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Suburb } from '@models/suburb.model';
import { SuburbService } from '@services/api/suburb.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-suburb',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-suburb.component.html',
  styleUrl: './edit-suburb.component.scss'
})
export class EditSuburbComponent {
    private eventsSubscription: Subscription;
    @Output() suburbUpdated = new EventEmitter<boolean>();
    @Input() public suburbSubject: Observable<Suburb>;
    public suburb: Suburb;
    public loading: boolean = false;
    public submitted: boolean = false;

    public editForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });

    constructor(private fb: FormBuilder, private suburbService: SuburbService, private toastService: ToastrService) { }

    ngOnInit(): void {
        this.eventsSubscription = this.suburbSubject.subscribe((suburb) => {
            this.suburb = suburb;

            this.editForm = this.fb.group({
                name: [suburb.name, [Validators.required]]
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
        this.suburbService.Update(this.suburb.id, this.f['name'].value).subscribe({
            next: (value: Suburb) => {
                this.toastService.success('Suburb updated');
                this.suburbUpdated.emit();
                this.suburb = value;
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
