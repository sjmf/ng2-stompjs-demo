# STOMP.js Angular 2 Demo App

> A demo application using [Angular 2](https://github.com/angular/angular) in
[Typescript](https://github.com/Microsoft/TypeScript) and [STOMP.js](https://github.com/jmesnil/stomp-websocket),
> generated with [angular-cli](https://github.com/angular/angular-cli).

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

```bash
# Run the application locally
npm start
```

Then [http://localhost:4200](http://localhost:4200) should open in your browser.
The app will automatically reload if you change any of the source files.

> You can override the default port by changing it in the `.ember-cli` file. 


## Layout

The source is located under the `app` folder:

```
├── e2e                                          * End To End testing folder
│   ├── app.e2e-spec.ts                          * App behaviour testings
│   ├── app.po.ts                                * App behavior definitions
│   └── tsconfig.json                            * Typescript transpiler options
│
├── src                                          * Source folder
│   ├── api                                      * Example API folder (static for demo)
│   │   └── config.json                          * Configuration file for STOMP
│   │
│   ├── app                                      * Application folder
│   │   ├── components                           * Components folder
│   │   │   ├── rawdata                          * Data streaming component folder
│   │   │   │   ├── rawdata.component.css        * Component css file
│   │   │   │   ├── rawdata.component.html       * Component html file
│   │   │   │   ├── rawdata.component.spec.ts    * Component testings
│   │   │   │   └── rawdata.component.ts         * Example data streaming component
│   │   │   │
│   │   │   └── status                           * Status component folder
│   │   │       ├── status.component.css         * Component css file
│   │   │       ├── status.component.html        * Component html file
│   │   │       ├── status.component.spec.ts     * Component testings
│   │   │       └── status.component.ts          * STOMP Status component
│   │   │
│   │   ├── services                             * Services folder
│   │   │   ├── config                           * Config service folder
│   │   │   │   ├── config.service.spec.ts       * Service testings
│   │   │   │   └── config.service.ts            * Service which retrieves the configuration
│   │   │   │
│   │   │   └── stomp                            * STOMP service folder
│   │   │       ├── index.ts                     * Indexing file
│   │   │       ├── stomp.config.ts              * Type definition for a STOMP configuration
│   │   │       ├── stomp.service.spec.ts        * Service testing
│   │   │       └── stomp.service.ts             * STOMP ng2 service definition
│   │   │
│   │   ├── app.component.css                    * Component css file
│   │   ├── app.component.html                   * Component html file
│   │   ├── app.component.spec.ts                * Component testings
│   │   ├── app.component.ts                     * Top-level app-root component
│   │   ├── app.module.ts                        * App module definition
│   │   └── index.ts                             * Indexing file
│   │
│   ├── assets                                   * Assets folder
│   │   └── .gitkeep                             * Placeholder to include the folder to source control
│   │
│   ├── environments                             * Environment settings folder
│   │   ├── environment.prod.ts                  * Production environment settings
│   │   └── environment.ts                       * Development environment settings
│   │
│   ├── favicon.ico                              * App favorite icon
│   ├── index.html                               * The root page served to browser
│   ├── main.ts                                  * App bootstrap
│   ├── polyfills.ts                             *  
│   ├── styles.css                               * Main css file
│   ├── test.ts                                  * Testings bootstrap
│   ├── tsconfig.json                            * Typescript transpiler options 
│   └── typings.d.ts                             * Typescript typings definition file
│
├── .editorconfig                                * Editor configuration file
├── .gitignore                                   * Git ignore file
├── README.md                                    * This file
├── angular-cli.json                             * Angular CLI configuration file
├── karma.config.js                              * Karma configuration file
├── package.json                                 * Package info and list of dependencies to install
├── protractor.config.js                         * Protractor configuration file
└── tslint.json                                  * Typescript Linter configuration file
```

> Two extra directories will be generated: `dist` for the compiled app, and 
`node_modules`, for the installed node packages.


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


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
