import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-progress/paper-progress.js'
import './log-out.js'
import '../my-icons.js';
import '../shared-styles.js';

class LogIn extends PolymerElement {

  static get template() {

    return html`

    <style include="shared-styles">
      :host {
        display: block;

        padding: 10px;
      }
      
      paper-progress.blue {
        --paper-progress-active-color: var(--paper-light-blue-500);
        --paper-progress-secondary-color: var(--paper-light-blue-100);
        margin-top: 20px;
      }
    </style>

    <iron-ajax
      id="registerLoginAjax"
      method="post"
      loading="{{loading}}"
      content-type="application/json"
      handle-as="text"
      on-response="handleUserResponse"
      on-error="handleUserError">
    </iron-ajax>

    <app-location route="{{route}}"></app-location>

    <div id="loginCard" class="card">

      <h1>Log In</h1>

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
        <label>Password</label>
        <iron-input slot="input" bind-value="{{formData.password}}">
          <input id="password" type="password" value="{{formData.password}}" placeholder="Password">
        </iron-input>
      </paper-input-container>

      <template is="dom-if" if="{{loading}}">
        <paper-progress class="blue" value="10" indeterminate="true" style="width:100%;"></paper-progress>
      </template>

      <template is="dom-if" if="{{!loading}}">
        <div class="wrapper-btns">
          <paper-button raised class="primary" on-tap="postLogin">Log In</paper-button>
          <a href='/sign-up'>
            <paper-button class="link">Sign Up</paper-button>
          </a>
        </div>
      </template>

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
        error: String,
        loading: {
          type: Boolean,
          notify: true,
          value: false
        }
    };
  }

  postLogin() {

      this.$.registerLoginAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/usuarios/login';
      this.$.registerLoginAjax.body = this.formData;
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

    this.formData = {};
  }

  handleUserError(event) {

    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }

}

window.customElements.define('log-in', LogIn);
