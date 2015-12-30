import {Component} from 'angular2/core';

import {STOMPService}  from '../services/stomp.service';
import {ConfigService} from '../services/config.service';

import {RawDataComponent} from './rawdata.component';

@Component({
    selector: 'my-app',
    template: `
        <h1>Angular 2 STOMP.js Demo</h1>
        <rawdata></rawdata>
    `,
    directives: [RawDataComponent],
    providers: [STOMPService, ConfigService]
})

export class AppComponent {
    constructor(private _stompService: STOMPService) { }
}