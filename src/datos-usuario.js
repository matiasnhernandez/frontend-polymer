import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-spinner/paper-spinner.js';
import './my-icons.js';
import './shared-styles.js';

class DatosUsuario extends PolymerElement {

  static get template() {

    return html`

    <style include="shared-styles">
      :host {
        display: block;

        padding: 10px;
      }
      .wrapper-btns {
        margin-top: 15px;
      }
      paper-button.link {
        color: #757575;
      }
      
      input {
        position: relative; /* to make a stacking context */
        outline: none;
        box-shadow: none;
        margin: 0;
        padding: 0;
        width: 100%;
        max-width: 100%;
        border: none;
        color: var(--paper-input-container-input-color, var(--primary-text-color));
        -webkit-appearance: none;
        text-align: inherit;
        vertical-align: bottom;
        /* Firefox sets a min-width on the input, which can cause layout issues */
        min-width: 0;
        @apply --paper-font-subhead;
        @apply --paper-input-container-input;
      }

    </style>

    <iron-ajax
      id="consultarUsuarioAjax"
      method="get"
      loading="{{loading}}"
      content-type="application/json"
      handle-as="text"
      on-response="handleConsultarResponse"
      on-error="handleUserError">
    </iron-ajax>

    <iron-ajax
      id="actualizarUsuarioAjax"
      method="put"
      content-type="application/json"
      handle-as="text"
      on-response="handleActualizarResponse"
      on-error="handleUserError">
    </iron-ajax>

    <app-location route="{{route}}"></app-location>

    <template is="dom-if" if="[[error]]">
      <p class="alert-error"><strong>Error:</strong> [[error]]</p>
    </template>

    <template is="dom-if" if="[[actualizaOk]]">
      <p class="alert-success"><strong>Usuario actualizado correctamente</strong></p>
    </template>

    <template is="dom-if" if="{{loading}}">
        <div class="loader">
          <paper-spinner active></paper-spinner>
        </div>
      </template>

    <template is="dom-if" if="{{!loading}}">
      <div id="registrarCard" class="card">
        
        <h1>Datos del usuario</h1>

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
          <paper-button raised class="primary" on-tap="actualizarUsuario">Actualizar</paper-button>
        </div>

      </div>
    </template>
    `;
  }

  static get properties() {

    return {
        formData: {
            type: Object,
            notify: true,
            value: {}
        },
        error: String,
        actualizaOk: Boolean,
        confirmaPassword: String,
        active: {
          type: Boolean,
          observer: '_activeChanged'
        },
        loading: {
          type: Boolean,
          notify: true,
          value: false
        }
    };
  }

  _activeChanged(newValue, oldValue) {
    
    if (newValue){
      this.getDatosUsuario();
    }
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

  getDatosUsuario() {

    this.actualizaOk = false;
    this.confirmaPassword = '';
    
    var storedUser = JSON.parse(localStorage.getItem("storedUser"));
    this.$.consultarUsuarioAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/usuarios/' + storedUser.datos._id;
    this.$.consultarUsuarioAjax.headers['Authorization'] = 'Bearer ' + storedUser.access_token;
    this.$.consultarUsuarioAjax.generateRequest();
  }

  actualizarUsuario() {


    var storedUser = JSON.parse(localStorage.getItem("storedUser"));
    this.$.actualizarUsuarioAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/usuarios/' + storedUser.datos._id;
    this.$.actualizarUsuarioAjax.headers['Authorization'] = 'Bearer ' + storedUser.access_token;
    this.$.actualizarUsuarioAjax.body = this.formData;
    this.$.actualizarUsuarioAjax.generateRequest();
      
  }

  handleConsultarResponse(event) {

      var response = JSON.parse(event.detail.response);
      this.formData = {};
      
      if (response.data) {
        this.error = '';
        this.formData = response.data;
      }

  }

  handleActualizarResponse(event) {

    var response = JSON.parse(event.detail.response);
    
    if (response.data) {
      this.actualizaOk = true;
    }

  }
  
  handleUserError(event) {

    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }

}

window.customElements.define('datos-usuario', DatosUsuario);
