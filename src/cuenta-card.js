import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import './shared-styles.js';
import * as cuentaFunctions from './cuenta-functions.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';


class CuentaCard extends PolymerElement {

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
        .cuenta-card {
          margin: 10px;
          padding: 16px;
          color: #757575;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        .container {
          display: flex; 
        }
        .container .left {
          color: black;
          font-weight: bold;
          font-size: 18px;
        }
        .container .rigth {
          margin-left: auto;
        }
        .saldo {
          font-weight: bold;
          font-size: 18px;
        }
        .container .left {
          color: black;
          font-weight: bold;
          font-size: 18px;
        }

        .container a {
          cursor: pointer;
          font-size: 15px;
        }

        .cerrada {
          background: #ffcdd2;
        }
      </style>

      <iron-ajax
        id="updateCuentaAjax"
        method="put"
        content-type="application/json"
        handle-as="text"
        on-response="handleCerrarResponse"
        on-error="handleCuentasError">
      </iron-ajax>

      <iron-ajax
        id="eliminarCuentaAjax"
        method="delete"
        on-response="handleEliminarResponse"
        on-error="handleCuentasError">
      </iron-ajax>


      <div class$="cuenta-card [[cuenta.estado]]">
        
        <div class="container">
          <div class="left">[[descripCuenta]]</div>
          
          <template is="dom-if" if="[[showSaldo]]">
            <div class="rigth saldo"><span>{{saldoFormat}}</span></div>
          </template>
          
        </div>
        <div>Estado: <span>{{cuenta.estado}}</span></div>

        <template is="dom-if" if="[[editButtons]]">
          <div class="container">
            <div class="rigth">
              <template is="dom-if" if="[[_getShowCerrar(cuenta.estado)]]">
                <a name="cerrar" on-click="cerrarCuenta"><iron-icon icon="close"></iron-icon><span>Cerrar</span></a>
              </template>
              <template is="dom-if" if="[[!_getShowCerrar(cuenta.estado)]]">
                <a name="abrir" on-click="abrirCuenta"><iron-icon icon="check"></iron-icon><span>Abrir</span></a>
              </template>
              <a name="eliminar" on-click="eliminarCuenta"><iron-icon icon="delete"></iron-icon><span>Eliminar</span></a>
            </div>
          </div>
        </template>

      </div>
    `;
  }
  static get properties() {

    return {
      cuenta: { 
        type: Object,
        notify: true,
        reflectToAttribute: true
      },
      showSaldo: {
        type: Boolean,
        value: false
      },
      editButtons: {
        type: Boolean,
        value: false
      },
      showCerrar: {
        type: Boolean,
        value: false
      },
      descripCuenta: {
        type: String,
        computed: 'getDescripcionCuenta(cuenta)'
      },
      saldoFormat: {
        type: String,
        computed: 'getSaldoFormat(cuenta)'
      }
    };
  }

  getDescripcionCuenta(cuenta) {
    return cuentaFunctions.getDescripcionCuenta(cuenta);
  }

  getSaldoFormat(cuenta) {
    return cuentaFunctions.getSaldoFormat(cuenta);
  }
  
  _getShowCerrar(estado){
    if (estado == 'abierta'){
      return true;
    }else{
      return false;
    }
  }

  eliminarCuenta(){
    this.$.eliminarCuentaAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/cuentas/' + this.cuenta._id;
    var storedUser = JSON.parse(localStorage.getItem("storedUser"));
    this.$.eliminarCuentaAjax.headers['Authorization'] = 'Bearer ' + storedUser.access_token;
    this.$.eliminarCuentaAjax.generateRequest();
  }

  cerrarCuenta() {
    this.$.updateCuentaAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/cuentas/' + this.cuenta._id;
    var storedUser = JSON.parse(localStorage.getItem("storedUser"));
    this.$.updateCuentaAjax.headers['Authorization'] = 'Bearer ' + storedUser.access_token;

    this.cuenta.estado = 'cerrada';
    this.$.updateCuentaAjax.body = this.cuenta;

    this.$.updateCuentaAjax.generateRequest();
  }

  abrirCuenta() {
    this.$.updateCuentaAjax.url = 'https://practitioner-backend-nodejs.herokuapp.com/api/v1/cuentas/' + this.cuenta._id;
    var storedUser = JSON.parse(localStorage.getItem("storedUser"));
    this.$.updateCuentaAjax.headers['Authorization'] = 'Bearer ' + storedUser.access_token;

    this.cuenta.estado = 'abierta';
    this.$.updateCuentaAjax.body = this.cuenta;

    this.$.updateCuentaAjax.generateRequest();
  }

  handleEliminarResponse(event) {

    var response = event.detail.response;
    
    if (!response.error) {
      this.error = '';
      this.remove();
    }else{
      this.error = errorResponse.mensaje;
    }
  }

  handleCerrarResponse(event) {

    var response = event.detail.response;
    
    if (!response.error) {
      this.error = '';
      this.notifyPath('cuenta.estado');
      this.showCerrar = false;
    }else{
      this.error = errorResponse.mensaje;
    }
  }

  handleUserError(event) {

    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }

}
window.customElements.define('cuenta-card', CuentaCard);
