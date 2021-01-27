import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
import '@polymer/paper-spinner/paper-spinner.js';
import './cuenta-card.js';
import '../my-icons.js';
import '../shared-styles.js';

class CuentaAlta extends PolymerElement {

  static get template() {

    return html`

    <style include="shared-styles">
      :host {
        display: block;

        padding: 10px;
      }
      paper-dropdown-menu{
        width: 80%;
      }
      paper-input-container{
        width: 80%;
      }
      
    </style>

    <iron-ajax
      id="CuentaAltaAjax"
      method="post"
      loading="{{loading}}"
      content-type="application/json"
      handle-as="text"
      on-response="handleCuentaResponse"
      on-error="handleCuentaError">
    </iron-ajax>

    <iron-ajax 
      id="SucursalesAjax"
      method="get"
      loading="{{loading}}" 
      content-type="application/json"
      handle-as="text"
      on-response="handleSucursalesResponse"
      on-error="handleSucursalesError">
    </iron-ajax>

    <app-location route="{{route}}"></app-location>

    <template is="dom-if" if="[[error]]">
      <p class="alert-error"><strong>Error:</strong> [[error]]</p>
    </template>

    <template is="dom-if" if="{{loading}}">
      <div class="loader">
        <paper-spinner active></paper-spinner>
      </div>
    </template>

    <paper-dialog id="altaCorrecta" entry-animation="scale-up-animation" exit-animation="fade-out-animation">
      <h2>Alta correcta</h2>
      
      <p>
        <iron-icon class="success" icon="done"></iron-icon>
        <span>Cuenta creada correctamente</span>
      </p>
      
      <cuenta-card cuenta="{{cuenta}}" ></cuenta-card>
      
      <div class="buttons">
        <paper-button dialog-confirm autofocus>Cerrar</paper-button>
      </div>
    </paper-dialog>

    <template is="dom-if" if="{{!loading}}">

      <div class="card">
        
        <h1>Nueva cuenta</h1>

        <p>Complete los siguientes datos para dar de alta una nueva cuenta.</p>

        <div>
          <paper-dropdown-menu label="Tipo de Cuenta">
            <paper-listbox slot="dropdown-content" selected="{{formData.tipoCuenta}}" attr-for-selected="myid">
              <paper-item myid="40">Caja de Ahorros</paper-item>
              <paper-item myid="20">Cuenta Corriente</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div>
          <paper-dropdown-menu label="Moneda">
            <paper-listbox slot="dropdown-content" selected="{{formData.moneda}}" attr-for-selected="myid">
              <paper-item myid="0">Pesos</paper-item>
              <paper-item myid="2">Dolares</paper-item>
              <paper-item myid="8">Euros</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div>
          <paper-dropdown-menu label="Sucursal">
            <paper-listbox slot="dropdown-content" selected="{{formData.sucursal}}" attr-for-selected="myid">

            <template is="dom-repeat" items="{{sucursales}}">
                <paper-item myid="{{item.codigo}}">{{item.descripcion}} - {{item.direccion}}</paper-item>
            </template>

            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div>
          <paper-input-container>
            <label slot="input">Saldo</label>
            <iron-input slot="input" bind-value="{{formData.saldo}}">
              <input class="input-style" id="saldo" type="number" value="{{formData.saldo}}" placeholder="Saldo">
            </iron-input>
          </paper-input-container>
        </div>

        <div class="wrapper-btns">
          <paper-button raised class="primary" on-tap="postCuentaAlta">Crear Cuenta</paper-button>
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
        sucursales: {
          type: Object,
          notify: true,
        },
        cuenta: { 
          type: Object,
          notify: true,
        },
        error: String,
        loading: {
          type: Boolean,
          notify: true,
          value: false
        },
        active: {
          type: Boolean,
          observer: '_activeChanged'
        }
        
    };
  }

  _activeChanged(newValue, oldValue) {
    if (newValue){
      if (typeof this.sucursales == 'undefined' || this.sucursales.length == 0){
        this.getSucursales();
      }
    }
  }
  _informarAltaCorrecta(){

    this.$.altaCorrecta.toggle();
  }

  getSucursales() {

    var storedUser = JSON.parse(localStorage.getItem("storedUser"));
    this.$.SucursalesAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/sucursales';
    this.$.SucursalesAjax.headers['Authorization'] = 'Bearer ' + storedUser.access_token;
    this.$.SucursalesAjax.generateRequest();
  }

  postCuentaAlta() {

    console.log('formData: ' + this.formData);
    
    var storedUser = JSON.parse(localStorage.getItem("storedUser"));
    this.$.CuentaAltaAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/cuentas';
    this.$.CuentaAltaAjax.headers['Authorization'] = 'Bearer ' + storedUser.access_token;
    this.$.CuentaAltaAjax.body = this.formData;
    this.$.CuentaAltaAjax.generateRequest();
  }

  handleCuentaResponse(event) {

      var response = JSON.parse(event.detail.response);

      if (!response.data.error) {
        this.error = '';
        this.cuenta = response.data;
        this.$.altaCorrecta.toggle();
      }

    this.formData = {};
  }

  handleCuentaError(event) {

    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }

  handleSucursalesResponse(event) {

    var response = JSON.parse(event.detail.response);

    if (!response.data.error) {
      this.error = '';
      this.sucursales = response.data;
    }

  }

  handleSucursalesError(event) {

    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }

}

window.customElements.define('cuenta-alta', CuentaAlta);
