import { Injectable } from 'angular2/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx'
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';

import { STOMPConfig } from './config';

import { Client, Message } from 'stompjs';
declare var Stomp; // Shut up, compiler

/** possible states for the STOMP service */
export enum STOMPState {
    CLOSED,
    TRYING,
    CONNECTED,
    SUBSCRIBED,
    DISCONNECTING
};

/** look up states for the STOMP service */
export const StateLookup: string[] = [
    "CLOSED",
    "TRYING",
    "CONNECTED",
    "SUBSCRIBED",
    "DISCONNECTING"
];

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
    public messages: Subject<Message>;

    // Configuration structure with MQ creds
    private config: STOMPConfig;

    // STOMP Client from stomp.js
    private client: Client;

    // Callback function (provided by calling class) to run when connected
    private connect_callback: () => any;


    /** Constructor */
    public constructor() {
        this.messages = new Subject<Message>();
        this.state = new BehaviorSubject<STOMPState>(STOMPState.CLOSED);
    }


    /** Set up configuration */
    public configure(config: STOMPConfig, callback: () => any): Error | void {

        if (this.state.getValue() != STOMPState.CLOSED)
            return Error("Already running!");
        
        // Set our configuration
        this.config = config;

        var scheme: string = 'ws';
        if (this.config.ssl) scheme = 'wss';

        // Attempt connection, passing in a callback
        this.client = Stomp.client(
            scheme + '://'
            + this.config.host + ':'
            + this.config.port
            + '/stomp/websocket'
        );

        // Configure client heartbeating
        this.client.heartbeat.incoming = this.config.heartbeat_in;
        this.client.heartbeat.outgoing = this.config.heartbeat_out;

        // Set function to debug print messages
        this.client.debug = this.debug;

        // Store calling class callback
        this.connect_callback = callback;
    }


    /** Perform connection to STOMP broker */
    public try_connect(): Error | void {

        if (this.client === null)
            return Error("Client not configured!");

        this.client.connect(
            this.config.user, 
            this.config.pass, 
            () => {
                this.on_connect();
                this.connect_callback();
            }, 
            this.on_error
        );

        console.log("connecting...");
        this.state.next( STOMPState.TRYING );
    }


    /** Disconnect the STOMP client and clean up */
    public disconnect(message?: string) {

        this.state.next( STOMPState.DISCONNECTING );
        this.client.disconnect(
            // Callback will set CLOSED state
            () => this.state.next( STOMPState.CLOSED ),
            message
        );
    }


    /** Send a message to all topics */
    public publish(message: string) {

        for (var t of this.config.publish)
            this.client.send(t, {}, message);
    }


    /** Subscribe to server message queues */
    private subscribe(): void {

        // Subscribe to our configured queues
        for (var t of this.config.subscribe)
            this.client.subscribe(t, this.on_message, <any>{ ack: 'auto' });
        
        // Update the state
        if (this.config.subscribe.length > 0)
            this.state.next( STOMPState.SUBSCRIBED );
    }


    /** 
     * Callback Functions
     *
     * Note the method signature: () => preserves lexical scope
     * if we need to use this.x inside the function
     */
    public debug(...args: any[]) {

        // Push arguments to this function into console.log
        if (window.console && console.log && console.log.apply) {
            console.log.apply(console, args);
        }
    }


    public on_connect = () => {

        this.state.next( STOMPState.CONNECTED );
        this.subscribe();
    }


    public on_error = (error: string) => {

        console.error('Error: ' + error);
    }


    public on_message = (message: Message) => {

        if (message.body) {
            this.messages.next(message);
        } else {
            console.error("Empty message received!");
        }
    }
}