import { Injectable } from 'angular2/core'; 
import { Http } from 'angular2/http';

import { STOMPConfig } from './config.ts';

/**
 * An injected class which grabs the application
 * config variables (e.g. STOMP credentials)
 * for the user application.
 *
 * This makes an AJAX request to the server
 * api containing some user token and secret
 * 
 * @type ConfigService
 */
@Injectable()
export class ConfigService {

    private static API_URL: string = 'app/api/config.json';
      
    // TODO: Provide a user object to the constructor
    //       to allow retrieval of per-user configs
    //       or from a specific URL.
    constructor( public _http:Http ) { }


    /** Make an http request for a config file, and 
      * return a Promise for its resolution.
      */
    getConfig(): Promise<STOMPConfig> {
        return this._http.get(ConfigService.API_URL)
            .map(res => res.json())
            .toPromise();
    }
}
