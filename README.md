# STOMP.js Angular 2 Demo App

> A demo application using [Angular 2](https://github.com/angular/angular)+
[Typescript](https://github.com/Microsoft/TypeScript), and [STOMP.js](https://github.com/jmesnil/stomp-websocket).

This demo app implements a more ng2-faithful way of connecting to a message 
queue and subscribing to messages from a STOMP topic. Includes a Typescript 
interface definition for Jeff Mesnil's excellent STOMP.js JavaScript library,
a STOMPService which subscribes to messages, and an example 'raw data' 
component which uses the Observable type to data-bind messages to the DOM.


## Quick Start 

To get started running this app locally (assuming you've already got node.js &
Typescript installed):

```bash
# Clone the repo
git clone https://github.com/sjmf/ng2-stompjs-demo
# cd into it
cd ng2-stompjs-demo
# Install the packages from package.json
npm install
# Run the application locally:
npm start
```

Then [http://localhost:3000](http://localhost:3000) should open in your browser.

You will also need the appropriate toolchain for Typescript, and a message queue
supporting STOMP, the Simple Text Oriented Messaging Protocol. This example was
built using [RabbitMQ WebSTOMP](http://www.rabbitmq.com/blog/2012/05/14/introducing-rabbitmq-web-stomp/)
but other brokers will also work. (Shameless self-plug: if you want SSL with
your RabbitMQ socks, you might want to read [my blog post](https://sjmf.in/wp/?p=86).)


## Layout

The source is located under the `app` folder:

```
├── README.md                        * This readme
├── app                              * Source folder
│   ├── api
│   │   └── config.json              * Configuration file for STOMP
│   │
│   ├── boot.ts                      * boot.ts for SystemJS bootstrap
│   │
│   ├── components
│   │   ├── app.component.ts         * Top-level my-app component
│   │   └── rawdata.component.tsp    * Example data streaming component
│   │
│   ├── modules
│   │   └── stompjs.d.ts             * STOMP.js Typescript interface exports
│   │
│   └── services
│       ├── config.service.ts        * Service which retrieves /api/config.json
│       ├── config.ts                * Type definition for a STOMP configuration
│       └── stomp.service.ts         * STOMP ng2 service definition
│
├── index.html                       * App page served to browser
├── package.json                     * npm list of packages to install
└── tsconfig.json                    * Typescript transpiler options
```

Two extra directories will be generated: `dist` for the compiled app, and 
`node_modules`, for installed node packages.

## Extending

The example data streaming component provides a demonstration of how to use the
STOMPService to subscribe to a data stream.

The STOMPService makes available an Observable which the RawDataComponent uses 
in its own template, and additionally subscribes its' own on_next method to.

The instantiating component must provide an instance of STOMPService. This
implementation also uses a ConfigService to retrieve the STOMP connection
variables.

# TODO

* Error Handling - if the connection fails there is currently no feedback to the
  user of the application (or any indication whatsoever if you're not watching
  the terminal). The seeds of this are implemented following the model used in 
  this [Angular2 stocks app](https://github.com/jeffbcross/aim).

# Contributing

Very happy to accept suggestions for improvement (or even pull requests!). This
project represents my first run-in with Typescript and Angular 2, so while I
feel like I've learned a lot it's possible that I've messed up somewhere. Raise
an issue and let me know!


