import {Injectable} from '@angular/core';

declare var $: any;

@Injectable()
export class ToasterService {

    private showNotification(msg, tipo) {
        const type = ['', 'info', 'success', 'warning', 'danger'];

        // const color = Math.floor((Math.random() * 4) + 1);

        $.notify({
            icon: 'notifications',
            title: 'Atenção!',
            message: msg
        }, {
            type: type[tipo],
            timer: 3000,
            placement: {
                from: 'top',
                align: 'right'
            },
            template: '<div data-notify="container" class="col-xl-3 col-lg-3 col-11 col-sm-3 col-md-3 alert alert-{0} alert-with-icon" role="alert">' +
                '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
                '<i class="material-icons" data-notify="icon">notifications</i> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        });
    }

    error(msg) {
        this.showNotification(msg, 4);
    }

    warning(msg) {
        this.showNotification(msg, 3);
    }

    success(msg) {
        this.showNotification(msg, 2)
    }
}
