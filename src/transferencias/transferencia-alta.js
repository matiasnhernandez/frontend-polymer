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
import '../cuentas/cuenta-card.js';
import '../my-icons.js';
import '../shared-styles.js';
import * as cuentaFunctions from '../cuentas/cuenta-functions.js';

class TransferenciaAlta extends PolymerElement {

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
      id="nuevaTransferenciaAjax"
      method="post"
      loading="{{loading}}"
      content-type="application/json"
      handle-as="text"
      on-response="handleTransferenciaResponse"
      on-error="handleTransferenciaError">
    </iron-ajax>

    <iron-ajax 
      id="consultaCuentasOrigenAjax"
      method="get"
      loading="{{loading}}" 
      content-type="application/json"
      handle-as="text"
      on-response="handleCuentasOrigenResponse"
      on-error="handleCuentasOrigenError">
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

    <paper-dialog id="transferenciaCorrecta" entry-animation="scale-up-animation" exit-animation="fade-out-animation">
      <h2>Transferencia Realizada!</h2>
      
      <p>
        <iron-icon class="success" icon="done"></iron-icon>
        <span>Transferencia realizada correctamente!</span>
      </p>
      
      <div class="buttons">
        <paper-button dialog-confirm autofocus>Cerrar</paper-button>
      </div>
    </paper-dialog>

    <template is="dom-if" if="{{!loading}}">

      <div class="card">
        
        <h1>Transferir</h1>

        <div>
          <paper-dropdown-menu label="Cuenta Origen">
            <paper-listbox slot="dropdown-content" selected="{{formData.idCuentaOrigen}}" attr-for-selected="myid" >

            <template is="dom-repeat" items="{{cuentasOrigen}}">
                <paper-item myid="[[item._id]]">[[item.label]] </paper-item>
            </template>

            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div>
          <paper-dropdown-menu label="Cuenta Destino">
            <paper-listbox slot="dropdown-content" selected="{{formData.idCuentaDestino}}" attr-for-selected="myid">

            <template is="dom-repeat" items="{{cuentasDestino}}">
                <paper-item myid="[[item._id]]" moneda="[[item.moneda]]">[[item.label]] </paper-item>
            </template>

            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div>
          <paper-input-container>
            <label slot="input">Concepto</label>
            <iron-input slot="input" bind-value="{{formData.concepto}}">
              <input class="input-style" id="concepto" type="text" value="{{formData.concepto}}" placeholder="concepto">
            </iron-input>
          </paper-input-container>
        </div>

        <div>
          <paper-input-container>
            <label slot="input">Importe</label>
            <iron-input slot="input" bind-value="{{formData.importe}}">
              <input class="input-style" id="importe" type="number" value="{{formData.importe}}" placeholder="importe">
            </iron-input>
          </paper-input-container>
        </div>

        <div class="wrapper-btns">
          <paper-button raised class="primary" on-tap="postTransferenciaAlta">Transferir</paper-button>
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
        cuentasOrigen: {
          type: Array,
          notify: true,
        },
        cuentasDestino: {
          type: Array,
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
        },
        
    };

  }

  static get observers() {
    return [
        'cuentaOrigenSelected(formData.idCuentaOrigen)'
    ]
  }
  
  cuentaOrigenSelected(cuentaOrigen) {
    if (cuentaOrigen) {
      this.getCuentasDestino();
    }
  }

  _activeChanged(newValue, oldValue) {
    if (newValue){
      this.getCuentasOrigen();
    }
  }

  getCuentasOrigen() {

    this.$.consultaCuentasOrigenAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/cuentas/';
    var storedUser = JSON.parse(localStorage.getItem("storedUser"));
    this.$.consultaCuentasOrigenAjax.headers['Authorization'] = 'Bearer ' + storedUser.access_token;
    this.$.consultaCuentasOrigenAjax.generateRequest();
  }

  getCuentasDestino() {

    this.cuentasDestino = [];
    var monedaSelected = '';

    this.cuentasOrigen.forEach(cuenta => {

      if (cuenta._id == this.formData.idCuentaOrigen){
        monedaSelected = cuenta.moneda;
        console.log('monedaSelected: ' + monedaSelected);
      }
      
    });

    this.cuentasOrigen.forEach(cuenta => {

      if (cuenta.moneda == monedaSelected && cuenta._id != this.formData.idCuentaOrigen){
        this.cuentasDestino.push(cuenta);
      }

    });

  }

  handleCuentasOrigenResponse(event) {

    var response = JSON.parse(event.detail.response);
    this.cuentasOrigen = [];
    
    if (!response.error) {
      this.error = '';
      if (response.data.length > 0){
        this.cuentasOrigen = this.formatCuentas(response.data);
        this.cuentasDestino = [];
      }else{
        this.error = 'Sin cuentas para mostrar';
      }
    }

  }

  handleCuentasOrigenError(event) {

    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }

  postTransferenciaAlta() {

    console.log('formData: ' + JSON.stringify(this.formData));
    
    var storedUser = JSON.parse(localStorage.getItem("storedUser"));
    this.$.nuevaTransferenciaAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/transferencias';
    this.$.nuevaTransferenciaAjax.headers['Authorization'] = 'Bearer ' + storedUser.access_token;
    this.$.nuevaTransferenciaAjax.body = this.formData;
    this.$.nuevaTransferenciaAjax.generateRequest();
  }

  handleTransferenciaResponse(event) {

      var response = JSON.parse(event.detail.response);

      if (!response.data.error) {
        this.error = '';
        this.cuenta = response.data;
        this.$.transferenciaCorrecta.toggle();
        this.getCuentasOrigen();
      }

    this.formData = {};
  }

  handleTransferenciaError(event) {

    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }

  formatCuentas(cuentas){
    
    var cuentasFormat = [];
    cuentas.forEach(cuenta => {

      if (cuenta.estado == 'abierta'){
        cuenta.label = cuentaFunctions.getDescripcionCuenta(cuenta) + ' ' + cuentaFunctions.getSaldoFormat(cuenta);
        cuentasFormat.push(cuenta);
      }
      
    });

    return cuentasFormat;
  }

}

window.customElements.define('transferencia-alta', TransferenciaAlta);
