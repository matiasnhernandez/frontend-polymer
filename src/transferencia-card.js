import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import './shared-styles.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';
import * as cuentaFunctions from './cuenta-functions.js';

class TransferenciaCard extends PolymerElement {

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
        .transferencia-card {
          margin: 10px;
          padding: 16px;
          color: #757575;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        .flex-row {
          flex-direction: row;
          display: flex;
          align-content: end;
          margin-left: auto;
          margin-top: auto;
          margin-bottom: auto;
        }
        
        .flex-column {
            flex-direction: column;
            display: flex;
        }
        
        .flex-body {
            display: flex;
        }
        
        .flex-body div:not([class*="flex"]) {
          flex: 1 1;
          width: 100%;
          margin-bottom: 10px;
          margin-top: 10px;
        }
        .saldo {
          font-weight: bold;
          font-size: 25px;
        }
      </style>

      <div class="transferencia-card">

      <div class="flex-body">
        <div class="flex-column">
          <div><b>Cuenta Origen: </b>[[descripCuentaOrigen]]</div>
          <div><b>Cuenta Destino: </b>[[descripCuentaDestino]]</div>
          <div><b>Concepto: </b>[[transferencia.concepto]]</div>
        </div>
        <div class="flex-row">
          <div class="saldo"><span>{{importeFormat}}</span></div>
        </div>
      </div>
        
      </div>
    `;
  }
  static get properties() {

    return {
      transferencia: { 
        type: Object,
        notify: true,
        reflectToAttribute: true
      },
      descripCuentaOrigen: {
        type: String,
        computed: 'getDescripcionCuenta(transferencia.idCuentaOrigen)'
      },
      descripCuentaDestino: {
        type: String,
        computed: 'getDescripcionCuenta(transferencia.idCuentaDestino)'
      },
      importeFormat: {
        type: String,
        computed: 'getImporteFormat(transferencia)'
      }
    };
  }

 
  getDescripcionCuenta(cuenta) {

    return cuentaFunctions.getDescripcionCuenta(cuenta);

  }

  getImporteFormat(transferencia) {

    return cuentaFunctions.getMonedaFmt(transferencia.idCuentaOrigen.moneda) + ' ' + cuentaFunctions.formatMoney(transferencia.importe);
    
  }

  handleUserError(event) {

    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }

}
window.customElements.define('transferencia-card', TransferenciaCard);
