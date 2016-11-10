import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { StompConfig } from '../stomp';

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

  // TODO: Provide a user object to the constructor
  //       to allow retrieval of per-user configs
  //       or from a specific URL.
  /** Constructor */
  constructor(private _http: Http) { }


  /** Make an http request for a config file, and
    * return a Promise for its resolution.
    */
  public getConfig(path): Promise<StompConfig> {
    return this._http.get(path)
      .map(res => res.json())
      .toPromise();
  }
}
