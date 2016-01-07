import { Component, OnInit, OnDestroy } from 'angular2/core';
import { Http, HTTP_PROVIDERS } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { Message } from 'stompjs';

import {STOMPService} from '../services/stomp.service';
import {ConfigService} from '../services/config.service';
import {STOMPStatusComponent} from './status.component';

/**
 * This component is an example implementation which uses
 *  the STOMPService to subscribe to data from a queue, 
 *  then pass that into Angular2 template variables.
 *  
 *  The STOMPService makes available an Observable which
 *  this component uses in its own template, and
 *  additionally subscribes its' own on_next method to.
 *  
 *  The instantiating component must provide an instance 
 *  of STOMPService.
 */
@Component({
    selector: 'rawdata',
    template: `
        <stomp-status></stomp-status>

        <div id="raw">

            <h2>Messages</h2>
            <p>{{count}} total</p>

            <h3 *ngIf="count">Latest:</h3>
            <pre>{{messages | async}}</pre>

            <h3 *ngIf="mq.length">History:</h3>
            <ol>
                <li *ngFor="#m of mq">{{m}}</li>
            </ol>

        </div>
        `,
    providers: [STOMPService, ConfigService, HTTP_PROVIDERS],
    directives: [STOMPStatusComponent]
})
export class RawDataComponent implements OnInit, OnDestroy {

    // Stream of messages
    public messages: Observable<Message>;

    // Array of historic message (bodies)
    public mq: Array<string> = [];

    // A count of messages received
    public count: number = 0;

    /** Constructor */
    constructor(private _stompService: STOMPService,
        private _configService: ConfigService) { }

    ngOnInit() {
        // Get configuration from config service...
        this._configService.getConfig().then(
            config => {
                // ... then pass it to (and connect) STOMP:
                this._stompService.configure(config);
                this._stompService.try_connect().then(this.on_connect);
            }
        );
    }

    ngOnDestroy() {
        this._stompService.disconnect();
    }

    /** Callback on_connect to queue */
    public on_connect = () => {

        // Store local reference to Observable
        // for use with template ( | async )
        this.messages = this._stompService.messages;
        
        // Subscribe a function to be run on_next message
        this.messages.subscribe(this.on_next);
    }

    /** Consume a message from the _stompService */
    public on_next = (message: Message) => {
        
        // Store message in "historic messages" queue
        this.mq.push(message.body + '\n');

        // Count it
        this.count++;

        // Log it to the console
        console.log(this.messages);
    }
}
