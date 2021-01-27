# Practitioner Frontend App - Polymer 3

Esta es una aplicacion contruida en Polymer 3 en base al polymer-3-starter-kit

Esta app posee las siguientes funcionalidades:

* **Alta de usuario** Se realiza Alta de usuario
* **Consulta y modificacion de usuarios** Se realiza consulta de los datos del usuario y modificacion de los mismos.
* **Login** Se realiza login con usuario y clave
* **Alta de cuentas** Se realiza Alta de cuentas en base a tipo de cuenta, moneda y sucursal.
* **Consulta de cuentas** Se consultan las cuentas del usuario
* **Trasferencias** Se realizan transferencias entre cuentas
* **Consulta de transferencias** Se consultan las transferencias realizadas


### Repo Github

<https://github.com/matiasnhernandez/frontend-polymer>

### Build

`npm run build`

Contruye la aplicacion en la carpeta `/build`, actualmente esta configurada en el `polymer.json` para que construya el `es5-bundled`

```
build/
  es5-bundled/
  es6-bundled/
  esm-bundled/
```

* `es5-bundled` is a bundled, minified build with a service worker. ES6 code is compiled to ES5 for compatibility with older browsers.
* `es6-bundled` is a bundled, minified build with a service worker. ES6 code is served as-is. This build is for browsers that can handle ES6 code - see [building your project for production](https://www.polymer-project.org/3.0/toolbox/build-for-production#compiling) for a list.
* `esm-bundled` is a bundled, minified build with a service worker. It uses standard ES module import/export statements for browsers that support them.

### Serve build proyect

    npm start

Este comando levanta un server Express en nodejs en <http://127.0.0.1:3001> que sirve la app generada en `build/es6-bundled/`

### Serve polymer proyect

    polymer serve

Levanta un server en <http://127.0.0.1:8081> que sirve la app que se esta desarrollando

### Deploy automatico e integracion continua

Esta app se deploya automaticamente en Heroku

<https://frontend-polymer.herokuapp.com/>