import { Injectable } from 'angular2/core'; 
//import { Http, HTTP_PROVIDERS } from 'angular2/http';

import { STOMPConfig } from './config.ts';
import { DEV_CONFIG }  from './dev-config';

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

    private static API_URL: string
        = 'http://localhost:3001/api/config.json';
      
    // TODO: Provide a user object to the constructor
    //       to allow retrieval of per-user configs
    //       or from a specific URL.
//    constructor( public _http:Http ) { }


    /** Make an http request for a config file, and 
      * return a Promise for its resolution.
      */
/*    getConfig(): Promise<STOMPConfig> {
        return this._http.get(ConfigService.API_URL)
            .map(res => res.json())
            .toPromise();
    }
*/

    /** Return a dummy configuration object */
    getDummyConfig(): Promise<STOMPConfig> {
        return Promise.resolve(DEV_CONFIG);
    }
}