import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '../my-icons.js';
import '../shared-styles.js';

class SignUp extends PolymerElement {

  static get template() {

    return html`

    <style include="shared-styles">
      :host {
        display: block;

        padding: 10px;
      }
      
    </style>

    <iron-ajax
      id="registerLoginAjax"
      method="post"
      content-type="application/json"
      handle-as="text"
      on-response="handleUserResponse"
      on-error="handleUserError">
    </iron-ajax>

    <app-location route="{{route}}"></app-location>

    <div id="registrarCard" class="card">
      
      <h1>Registrarse</h1>

      <p><strong>Registarse</strong> para acceder a la aplicacion</p>

      <template is="dom-if" if="[[error]]">
        <p class="alert-error"><strong>Error:</strong> [[error]]</p>
      </template>

      <paper-input-container>
        <label slot="input">Usuario</label>
        <iron-input slot="input" bind-value="{{formData.username}}">
          <input class="input-style" id="username" type="text" value="{{formData.username}}" placeholder="Usuario">
        </iron-input>
      </paper-input-container>

      <paper-input-container>
        <label slot="input">Email</label>
        <iron-input slot="input" bind-value="{{formData.email}}">
          <input class="input-style" id="email" type="email" value="{{formData.email}}" placeholder="Email">
        </iron-input>
      </paper-input-container>

      <paper-input-container>
        <label slot="input">Nombre</label>
        <iron-input slot="input" bind-value="{{formData.nombre}}">
          <input class="input-style" id="nombre" type="text" value="{{formData.nombre}}" placeholder="Nombre">
        </iron-input>
      </paper-input-container>
  
      <paper-input-container>
        <label slot="input">Apellido</label>
        <iron-input slot="input" bind-value="{{formData.apellido}}">
          <input class="input-style" id="apellido" type="text" value="{{formData.apellido}}" placeholder="Apellido">
        </iron-input>
      </paper-input-container>

      <paper-input-container>
        <label slot="input">Direccion</label>
        <iron-input slot="input" bind-value="{{formData.direccion}}">
          <input class="input-style" id="direccion" type="text" value="{{formData.direccion}}" placeholder="Direccion">
        </iron-input>
      </paper-input-container>

      <paper-input-container>
        <label>Password</label>
        <iron-input slot="input" bind-value="{{formData.password}}">
          <input id="password" type="password" value="{{formData.password}}" placeholder="Password" on-change="passmatch">
        </iron-input>
      </paper-input-container>

      <paper-input-container>
        <label>Confirmar Password</label>
        <iron-input slot="input" bind-value="{{confirmaPassword}}">
          <input id="confirmaPassword" type="password" value="{{confirmaPassword}}" placeholder="Confirmar Password" on-change="passmatch">
        </iron-input>
      </paper-input-container>

      <div class="wrapper-btns">
        <paper-button raised class="primary" on-tap="postRegister">Registrarse</paper-button>
      </div>

    </div>
    `;
  }

  static get properties() {

    return {
        formData: {
            type: Object,
            value: {}
        },
        storedUser: { 
          type: Object,
          value:{},
          notify: true,
          reflectToAttribute: true
        },
        confirmaPassword: String,
        error: String
    };
  }

  passmatch(){

    var password = encodeURIComponent(this.formData.password);
    var confirmPassword = encodeURIComponent(this.confirmaPassword);
      if(password != confirmPassword){
        this.error = 'Las claves deben coincidir';
      }else{
        this.error = '';
      }
  }

  _setReqBody() {

      this.$.registerLoginAjax.body = this.formData;
  }

  postRegister() {

    this.$.registerLoginAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/usuarios/registrar';
    this._setReqBody();
    this.$.registerLoginAjax.generateRequest();
      
  }

  handleUserResponse(event) {

    var response = JSON.parse(event.detail.response);

    if (response.data.token) {
      this.error = '';
      
      this.storedUser = {};
      this.storedUser.datos = response.data.usuario;
      this.storedUser.access_token = response.data.token;
      this.storedUser.loggedin = true;
      
      localStorage.setItem("storedUser", JSON.stringify(this.storedUser));

      var customEvent = new CustomEvent('login', {
        bubbles: true, 
        composed: true,
        detail: {storedUser: this.storedUser}
      });
      this.dispatchEvent(customEvent);

      this.set('route.path', '/home-page');
    }

    // reset form data
    this.formData = {};
  }

  handleUserError(event) {
    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }

}

window.customElements.define('sign-up', SignUp);
