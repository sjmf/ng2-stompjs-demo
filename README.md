# STOMP.js Angular 2 Demo App

> A demo application using [Angular 2](https://github.com/angular/angular)+
[Typescript](https://github.com/Microsoft/TypeScript), and [STOMP.js](https://github.com/jmesnil/stomp-websocket).

This demo app implements a more ng2-faithful way of connecting to a message 
queue and subscribing to messages from a STOMP topic. Includes a Typescript 
interface definition for Jeff Mesnil's excellent STOMP.js JavaScript library,
a STOMPService which subscribes to messages, and an example 'raw data' 
component which uses the Observable type to data-bind messages to the DOM.

For a newer demo using MQTT instead of STOMP, see [https://github.com/sjmf/ng2-mqtt-demo](https://github.com/sjmf/ng2-mqtt-demo)

## Quick Start 

> As well as the following, you will also need the appropriate toolchain for 
> Typescript, and a message queue supporting STOMP, the Simple Text Oriented 
> Messaging Protocol. This example was built using [RabbitMQ WebSTOMP](http://www.rabbitmq.com/blog/2012/05/14/introducing-rabbitmq-web-stomp/)
> but other brokers will also work. (Shameless self-plug: if you want SSL with
> your RabbitMQ socks, you might want to read [my blog post](https://sjmf.in/wp/?p=86).)


To get started running this app locally (assuming you've already got Typescript):

```bash
# Clone the repo
git clone https://github.com/sjmf/ng2-stompjs-demo
# cd into it
cd ng2-stompjs-demo
# Install the packages from package.json
npm install
```

You will also need to edit the `app/api/config.json` configuration file to set
the correct connection parameters for your message broker. When you've done 
this, you can run the application locally:

```
# Run the application locally:
npm start
```

Then [http://localhost:3000](http://localhost:3000) should open in your browser.


## Layout

The source is located under the `app` folder:

```
├── README.md                        * This readme
│
├── api                              * Example API (static for demo)
│   └── config.json                  * Configuration file for STOMP
│
├── app                              * Source folder
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
STOMPService to subscribe to a data stream. At its' core, the STOMPService makes
available an Observable which the `RawDataComponent` uses in its own template, 
and additionally subscribes its' own `on_next` method to.

A barebones set-up of the service could run from a component's `ngOnInit`
method, and might look something like this:
```
this._stompService.configure( config, () => console.log("connected") );
this._stompService.try_connect();
```

Our `RawDataComponent` then copies a reference to the public member `messages`,
which can be used with a template variable and the `|async` pipe to update the
template in real time.

The instantiating component must provide an instance of STOMPService. This
implementation also uses a ConfigService to retrieve the STOMP connection
variables from a json file, with the intention that other clients might like to
route this request to an API along with some form of user token.

The STOMP connection status is also fed-back to the application user via a
`BehaviorSubject` observable, implemented following the model used in 
this [Angular2 stocks app](https://github.com/jeffbcross/aim). If the connection
fails, the application will retry every 5 seconds until it reopens.


## Contributing

Very happy to accept suggestions for improvement (or even pull requests!). This
project represents my first run-in with Typescript and Angular 2, so while I
feel like I've learned a lot it's possible that I've messed up somewhere. Raise
an issue and let me know!


## Licence

MIT Licence. Essentially: do what you like with it, but give credit if credit's 
due, and it's not my fault if this code eats your product/machine/whatever.

