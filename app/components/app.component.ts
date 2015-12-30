import {Component} from 'angular2/core';
import {RawDataComponent} from './rawdata.component';

@Component({
    selector: 'my-app',
    template: `
        <h1>Angular 2 STOMP.js Demo</h1>
        <rawdata></rawdata>
    `,
    directives: [RawDataComponent]
})

export class AppComponent { }