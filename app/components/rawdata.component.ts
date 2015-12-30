import { Component, OnInit } from 'angular2/core';
import { Observable } from 'rxjs/Observable';
import { Message } from 'stompjs';

import {STOMPService} from '../services/stomp.service';

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
 *  of STOMPService (which in turn requires ConfigService)
 */
@Component({
    selector: 'rawdata',
    template: `
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
        `
})
export class RawDataComponent implements OnInit {

    // Stream of messages
    public messages: Observable<Message>;

    // Array of historic message (bodies)
    public mq: Array<string> = [];

    // A count of messages received
    public count: number = 0;

    constructor(private _stompService: STOMPService) { }

    ngOnInit() {
        this._stompService.configure().then(
            _stompService => this._stompService.connect(this.on_connect)
        );
    }

    /** Callback on_connect to queue */
    public on_connect = (message: Message) => {

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