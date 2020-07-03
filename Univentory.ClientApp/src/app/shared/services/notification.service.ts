import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationService {
    constructor(private toastr: ToastrService) {

    }
    successMessage(message: string) {
        this.toastr.success(message);
    }

    errorMessage(message: string) {
        this.toastr.error(message);
    }
}
