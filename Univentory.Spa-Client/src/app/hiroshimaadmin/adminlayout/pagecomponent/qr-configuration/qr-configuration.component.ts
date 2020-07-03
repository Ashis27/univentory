import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from 'src/app/_models';
import { UserService, ConfigurationServiceProvider } from 'src/app/_services/componentservice';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { ApiServicesHandlerService } from 'src/app/shared/handler/app.constant';
import { CreateAdminComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/super-admin/create-admin/create-admin.component';
import { SearchParams } from 'src/app/shared/models';
import { ILanguageInfo } from 'src/app/shared/interfaces';
import { TravellerFeedback } from 'src/app/shared/models/TravellerFeedback';
import { QRCodeConfigurationModel } from 'src/app/shared/models/QRCodeConfigurationModel';

/**
 * Language information component
 */
@Component({ templateUrl: 'qr-configuration.component.html' })

export class QRCodeConfigurationComponent extends LanguageHandlerService implements OnInit {

    /**
    * Value of the QR code configuration model
    */
    qrConfig: QRCodeConfigurationModel = { regenerationTimeInMin: "" };
    /**
     * Value of the available status
     */
    isAvaileble: boolean = true;

    /**
    * @ignore
    */
    constructor(injector: Injector, private configService: ConfigurationServiceProvider) {
        super(injector);
    }

    /**
     * Initial entry point
     * @example
     * ngOnInit()
     * @returns {void}
     */
    ngOnInit(): void {
        this.getQRConfig();
    }

    /**
     * To get active QR code configuration
     * @example
     * getQRConfig()
     * @returns {QRCodeConfiguration} active feedback information
     */
    getQRConfig() {
        this.configService.GetQRConfiguration()
            .pipe(first())
            .subscribe(response => {
                if (!response)
                    return this.isAvaileble = false;
                this.isAvaileble = true;
                this.qrConfig = response;
            },
                error => {
                    this.isAvaileble = false;
                    this._custom_message_handler.errorMessage(this.lang(error));
                });

    }

    /**
     * To update QR code configuration
     * @example
     * updateQrConfig()
     * @param {QRCodeConfiguration} qrConfig configuration information
     * @returns {boolean}
     */
    updateQrConfig() {
        if (this.qrConfig.regenerationTimeInMin != "" && this.qrConfig.regenerationTimeInMin != undefined) {
            if (confirm(this.lang("ConfirmUpdate"))) {
                this.configService.UpdateQRConfiguration(this.qrConfig)
                    .pipe(first())
                    .subscribe(response => {
                        if (!response || !response.success)
                            return this._custom_message_handler.errorMessage(this.lang(response.message));
                        return this._custom_message_handler.successMessage(this.lang(response.message));
                    },
                        error => {
                            this._custom_message_handler.errorMessage(this.lang(error));
                        });
            }
        }
        else
            this._custom_message_handler.errorMessage(this.lang("RegenerationTimeRequiredMessage"));

    }

}