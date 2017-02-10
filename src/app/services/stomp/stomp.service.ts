import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StompConfig } from './';

import * as Stomp from 'stompjs';

/** possible states for the STOMP service */
export enum STOMPState {
  CLOSED,
  TRYING,
  CONNECTED,
  SUBSCRIBED,
  DISCONNECTING
};

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

  // Publishes new messages to Observers
  public messages: Subject<Stomp.Message>;

  // Configuration structure with MQ creds
  private config: StompConfig;

  // STOMP Client from stomp.js
  private client: Stomp.Client;

  // Resolve Promise made to calling class, when connected
  private resolvePromise: (...args: any[]) => void;

  // Timer
  private timer: NodeJS.Timer;

  /** Constructor */
  public constructor() {
    this.messages = new Subject<Stomp.Message>();
    this.state = new BehaviorSubject<STOMPState>(STOMPState.CLOSED);
  }


  /** Set up configuration */
  public configure(config?: StompConfig): void {

    // Check for errors:
    if (this.state.getValue() !== STOMPState.CLOSED) {
      throw Error('Already running!');
    }
    if (config === null && this.config === null) {
      throw Error('No configuration provided!');
    }

    // Set our configuration
    if (config != null) {
      this.config = config;
    }

    // Connecting via SSL Websocket?
    let scheme = 'ws';
    if (this.config.ssl) {
      scheme = 'wss';
    }

    // Attempt connection, passing in a callback
    this.client = Stomp.client(`${scheme}://${this.config.host}:${this.config.port}/stomp/websocket`);

    // Configure client heartbeating
    this.client.heartbeat.incoming = this.config.heartbeat_in;
    this.client.heartbeat.outgoing = this.config.heartbeat_out;

    // Set function to debug print messages
    this.client.debug = this.config.debug || this.config.debug == null ? this.debug : null;
  }


  /**
   * Perform connection to STOMP broker, returning a Promise
   * which is resolved when connected.
   */
  public try_connect(): Promise<{}> {

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

    return new Promise(
      (resolve, reject) => this.resolvePromise = resolve
    );
  }


  /** Disconnect the STOMP client and clean up */
  public disconnect(): void {

    // Notify observers that we are disconnecting!
    this.state.next(STOMPState.DISCONNECTING);

    // Abort reconnecting if in progress
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // Disconnect if connected. Callback will set CLOSED state
    if (this.client && this.client.connected) {
      this.client.disconnect(
        () => this.state.next(STOMPState.CLOSED)
      );
    }
  }


  /** Send a message to all topics */
  public publish(message?: string): void {

    for (const t of this.config.publish) {
      this.client.send(t, {}, message);
    }
  }


  /** Subscribe to server message queues */
  public subscribe(): void {

    // Subscribe to our configured queues
    for (const t of this.config.subscribe) {
      this.client.subscribe(t, this.on_message, { ack: 'auto' });
    }

    // Update the state
    if (this.config.subscribe.length > 0) {
      this.state.next(STOMPState.SUBSCRIBED);
    }
  }


  /**
   * Callback Functions
   *
   * Note the method signature: () => preserves lexical scope
   * if we need to use this.x inside the function
   */
  public debug(...args: any[]): void {

    // Push arguments to this function into console.log
    if (window.console && console.log && console.log.apply) {
      console.log.apply(console, args);
    }
  }


  // Callback run on successfully connecting to server
  public on_connect = () => {

    console.log('Connected');

    // Indicate our connected state to observers
    this.state.next(STOMPState.CONNECTED);

    // Subscribe to message queues
    this.subscribe();

    // Resolve our Promise to the caller
    this.resolvePromise();

    // Clear callback
    this.resolvePromise = null;

    // Clear timer
    this.timer = null;
  }


  // Handle errors from stomp.js
  public on_error = (error: string | Stomp.Message) => {

    if (typeof error === 'object') {
      error = (<Stomp.Message>error).body;
    }

    console.error(`Error: ${error}`);

    // Check for dropped connection and try reconnecting
    if (error.indexOf('Lost connection') !== -1) {

      // Reset state indicator
      this.state.next(STOMPState.CLOSED);

      // Attempt reconnection
      console.log('Reconnecting in 5 seconds...');
      this.timer = setTimeout(() => {
        this.configure();
        this.try_connect();
      }, 5000);
    }
  }


  // On message RX, notify the Observable with the message object
  public on_message = (message: Stomp.Message) => {

    if (message.body) {
      this.messages.next(message);
    } else {
      console.error('Empty message received!');
    }
  }
}
