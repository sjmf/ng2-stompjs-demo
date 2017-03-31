import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StompConfig } from './';

import * as Stomp from '@stomp/stompjs';
import {ConfigService} from "../config/config.service";

/** possible states for the STOMP service */
export enum STOMPState {
  CLOSED,
  TRYING,
  CONNECTED,
  DISCONNECTING
}

/**
 * Angular2 STOMP Service using stomp.js
 *
 * @description This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into a Subject observable.
 */
@Injectable()
export class STOMPService {

  /* Service parameters */

  // State of the STOMPService
  public state: BehaviorSubject<STOMPState>;

  // Configuration structure with MQ creds
  private config: StompConfig;

  // STOMP Client from stomp.js
  private client: Stomp.Client;

  /** Constructor */
  public constructor(private _configService: ConfigService) {
    this.state = new BehaviorSubject<STOMPState>(STOMPState.CLOSED);

    // Get configuration from config service...
    this._configService.getConfig('api/config.json').then(
      config => {
        // ... then pass it to (and connect) STOMP:
        this.configure(config);
        this.try_connect();
      }
    );
  }

  /** Set up configuration */
  private configure(config?: StompConfig): void {

    this.config = config;

    // Connecting via SSL Websocket?
    let scheme = 'ws';
    if (this.config.ssl) {
      scheme = 'wss';
    }

    // Attempt connection, passing in a callback
    this.client = Stomp.client(`${scheme}://${this.config.host}:${this.config.port}/${this.config.path}`);

    // Configure client heartbeating
    this.client.heartbeat.incoming = this.config.heartbeat_in;
    this.client.heartbeat.outgoing = this.config.heartbeat_out;

    // Auto reconnect
    this.client.reconnect_delay = 5000;

    // Set function to debug print messages
    this.client.debug = this.config.debug || this.config.debug == null ? this.debug : null;
  }


  /**
   * Perform connection to STOMP broker, returning a Promise
   * which is resolved when connected.
   */
  private try_connect(): void {

    if (this.state.getValue() !== STOMPState.CLOSED) {
      throw Error('Can\'t try_connect if not CLOSED!');
    }
    if (this.client === null) {
      throw Error('Client not configured!');
    }

    // Attempt connection, passing in a callback
    this.client.connect(
      this.config.user,
      this.config.pass,
      this.on_connect,
      this.on_error
    );

    console.log('Connecting...');
    this.state.next(STOMPState.TRYING);
  }


  /** Disconnect the STOMP client and clean up */
  public disconnect(): void {

    // Notify observers that we are disconnecting!
    this.state.next(STOMPState.DISCONNECTING);

    // Disconnect if connected. Callback will set CLOSED state
    if (this.client && this.client.connected) {
      this.client.disconnect(
        () => this.state.next(STOMPState.CLOSED)
      );
    }
  }

  /** Send a message to all topics */
  public publish(queueName: string, message?: string): void {
    this.client.send(queueName, {}, message);
  }

  /** Subscribe to server message queues */
  public subscribe(queueName: string): Subject<Stomp.Message> {
    let messages: Subject<Stomp.Message>;

    messages = new Subject<Stomp.Message>();
    this.state.subscribe((currentState: number) => {
      if (currentState === STOMPState.CONNECTED) {

        this.client.subscribe(queueName, (message: Stomp.Message) => {
            messages.next(message);
          },
          { ack: 'auto' });
      }
    });

    return messages;
  }


  /**
   * Callback Functions
   *
   * Note the method signature: () => preserves lexical scope
   * if we need to use this.x inside the function
   */
  private debug(...args: any[]): void {

    // Push arguments to this function into console.log
    if (window.console && console.log && console.log.apply) {
      console.log.apply(console, args);
    }
  }

  // Callback run on successfully connecting to server
  private on_connect = () => {

    console.log('Connected');

    // Indicate our connected state to observers
    this.state.next(STOMPState.CONNECTED);
  };

  // Handle errors from stomp.js
  private on_error = (error: string | Stomp.Message) => {

    if (typeof error === 'object') {
      error = (<Stomp.Message>error).body;
    }

    console.error(`Error: ${error}`);

    // Check for dropped connection and try reconnecting
    if (!this.client.connected) {
      // Reset state indicator
      this.state.next(STOMPState.CLOSED);
    }
  };
}
