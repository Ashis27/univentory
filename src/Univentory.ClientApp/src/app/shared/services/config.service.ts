import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Subject } from 'rxjs';
import { IConfiguration } from './interfaces/IConfiguration';

@Injectable()
export class ConfigService {
    serverSettings: IConfiguration;
    isReady: boolean = false;

    private settingLoadedSource = new Subject();
    settingsLoaded$ = this.settingLoadedSource.asObservable();


    constructor(private storageService: StorageService) {
    }

    load() {
        const baseURI = document.baseURI.endsWith('/') ? document.baseURI : `${document.baseURI}/`;
        var res = {
            apiServiceUrl: "https://localhost:44302/",
            clientBaseUri: baseURI
        } as IConfiguration;
        this.serverSettings = res;
        this.storageService.store('apiServiceUrl', this.serverSettings.apiServiceUrl);
        this.isReady = true;
        this.settingLoadedSource.next();
    }
}