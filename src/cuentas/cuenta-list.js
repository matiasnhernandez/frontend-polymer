import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-spinner/paper-spinner.js';
import './cuenta-card.js';
import '../shared-styles.js';

class CuentaList extends PolymerElement {
  
  constructor(){
    super();
  }

  static get template() {

    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
        
      </style>

      <iron-ajax
        id="consultaCuentasAjax"
        method="get"
        loading="{{loading}}"
        content-type="application/json"
        handle-as="text"
        on-response="handleConsultarResponse"
        on-error="handleCuentasError">
      </iron-ajax>

      <template is="dom-if" if="[[error]]">
        <p class="alert-error"><strong>Error:</strong> [[error]]</p>
      </template>

      <template is="dom-if" if="{{loading}}">
        <div class="loader">
          <paper-spinner active></paper-spinner>
        </div>
      </template>

      <template is="dom-if" if="{{!loading}}">
        <dom-repeat items="{{cuentas}}">
          <template>
            <cuenta-card show-saldo edit-buttons cuenta="{{item}}"></cuenta-card>
          </template>
        </dom-repeat>
      </template>

      
      
      

    `;
  }

  static get properties() {

    return {
      formData: {
        type: Object,
        value: {}
      },
      cuentas: { 
        type: Array,
        notify: true,
        reflectToAttribute: true
      },
      error: String,
      active: {
        type: Boolean,
        observer: '_activeChanged'
      },
      loading: {
        type: Boolean,
        notify: true,
        value: false
      }
    }
  }
  
  _activeChanged(newValue, oldValue) {
    if (newValue){
      this.getCuentas();
    }
  }
  
  getCuentas() {

    this.$.consultaCuentasAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/cuentas/';
    var storedUser = JSON.parse(localStorage.getItem("storedUser"));
    this.$.consultaCuentasAjax.headers['Authorization'] = 'Bearer ' + storedUser.access_token;
    this.$.consultaCuentasAjax.generateRequest();
  }

  handleConsultarResponse(event) {

    var response = JSON.parse(event.detail.response);
    this.cuentas = [];
    
    if (!response.error) {
      this.error = '';
      if (response.data.length > 0){
        this.cuentas = response.data;
      }else{
        this.error = 'Sin cuentas para mostrar';
      }
      

    }

  }

  handleCuentasError(event) {

    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }
}

window.customElements.define('cuenta-list', CuentaList);
