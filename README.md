# Practitioner Frontend App - Polymer 3

Esta es una aplicacion contruida en Polymer 3 en base al polymer-3-starter-kit

Esta app posee las siguientes funcionalidades:

* **Alta de usuario** Se realiza Alta de usuario
* **Consulta y modificacion de usuarios** Se realiza consulta de los datos del usuario y modificacion de los mismos.
* **Login** Se realiza login con usuario y clave
* **Alta de cuentas** Se realiza Alta de cuentas en base a tipo de cuenta, moneda y sucursal.
* **Consulta de cuentas** Se consultan las cuentas del usuario


### Repo Github

<https://github.com/matiasnhernandez/frontend-polymer>

### Build

`npm run build`

Contruye la aplicacion en la carpeta `/build`, actualmente esta configurada en el `polymer.json` para que construya el `es5-bundled`

```
build/
  es5-bundled/
```

* `es5-bundled` is a bundled, minified build with a service worker. ES6 code is compiled to ES5 for compatibility with older browsers.

### Serve

    npm start

Este comando levanta un server Express en nodejs en <http://127.0.0.1:3000> que sirve la app generada en `build/es5-bundled/`

### Deploy automatico e integracion continua

Esta app se deploya automaticamente en Heroku

<https://frontend-polymer.herokuapp.com/>