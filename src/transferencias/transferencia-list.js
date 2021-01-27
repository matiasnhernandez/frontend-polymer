import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-spinner/paper-spinner.js';
import './transferencia-card.js';
import '../shared-styles.js';

class TransferenciaList extends PolymerElement {
  
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
        id="consultaTransferenciasAjax"
        method="get"
        loading="{{loading}}"
        content-type="application/json"
        handle-as="text"
        on-response="handleConsultarResponse"
        on-error="handleTransferenciasError">
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
        <dom-repeat items="{{transferencias}}">
          <template>
            <transferencia-card transferencia="{{item}}"></transferencia-card>
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
      transferencias: { 
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
      this.getTransferencias();
    }
  }
  
  getTransferencias() {

    this.$.consultaTransferenciasAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/transferencias/';
    var storedUser = JSON.parse(localStorage.getItem("storedUser"));
    this.$.consultaTransferenciasAjax.headers['Authorization'] = 'Bearer ' + storedUser.access_token;
    this.$.consultaTransferenciasAjax.generateRequest();
  }

  handleConsultarResponse(event) {

    var response = JSON.parse(event.detail.response);
    this.transferencias = [];
    
    if (!response.error) {
      this.error = '';
      if (response.data.length > 0){
        this.transferencias = response.data;
      }else{
        this.error = 'Sin transferencias para mostrar';
      }
      

    }

  }

  handleTransferenciasError(event) {

    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }
}

window.customElements.define('transferencia-list', TransferenciaList);
