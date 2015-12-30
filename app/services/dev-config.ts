import {STOMPConfig} from './config.ts';

/** Stomp connection variables */
export var DEV_CONFIG: STOMPConfig = {
    host: "example.com.invalid",
    port: 15671,
    ssl: true,

    user: "username",
    pass: "changeme",

    subscribe: ["/topic/ng-demo-sub"],
    publish:   ["/topic/ng-demo-pub"],

    heartbeat_in: 0, // Unsupported in Websocket RabbitMQ
    heartbeat_out: 20000
};
