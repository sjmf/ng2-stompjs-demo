import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Message } from '@stomp/stompjs';

import { STOMPService } from '../../services/stomp';

@Component({
  selector: 'app-rawdata',
  templateUrl: './rawdata.component.html',
  styleUrls: ['./rawdata.component.css'],
  providers: [STOMPService]
})
export class RawDataComponent implements OnInit, OnDestroy {

  // Stream of messages
  public messages: Observable<Message>;

  // Array of historic message (bodies)
  public mq: Array<string> = [];

  // A count of messages received
  public count = 0;

  private _counter = 1;

  /** Constructor */
  constructor(private _stompService: STOMPService) { }

  ngOnInit() {
    // Store local reference to Observable
    // for use with template ( | async )
    this.messages = this._stompService.messages;

    // Subscribe a function to be run on_next message
    this.messages.subscribe(this.on_next);
  }

  ngOnDestroy() {
  }

  public onClick() {
    const _getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    this._stompService.publish(`{ type: "Test Message", data: [ ${this._counter}, ${_getRandomInt(1, 100)}, ${_getRandomInt(1, 100)}] }`);

    this._counter++;
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
