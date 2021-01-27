import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import './shared-styles.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';

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

    return this.getTipoCuentaFmt(cuenta.tipoCuenta) + ' ' + this.getMonedaFmt(cuenta.moneda) + ' ' + cuenta.sucursal + '-' + cuenta.numero + '/' + cuenta.digito;
  }

  getImporteFormat(transferencia) {

    return this.getMonedaFmt(transferencia.idCuentaOrigen.moneda) + ' ' + this.formatMoney(transferencia.importe);
    
  }

  getTipoCuentaFmt(TipoCuenta){

    if (TipoCuenta == '1' || TipoCuenta == '20'){
      return 'Cuenta Corriente';
    }
    if (TipoCuenta == '2' || TipoCuenta == '40'){
      return 'Caja de Ahorros';
    }
    return 'N/A';
  }

  getMonedaFmt(moneda){

    if (moneda == '0'){
      return '$';
    }
    if (moneda == '2'){
      return 'U$S';
    }
    if (moneda == '8'){
      return 'Euro';
    }
    return 'N/A';
  }

  formatMoney(number, decPlaces, decSep, thouSep) {

    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSep = typeof decSep === "undefined" ? "," : decSep;
    thouSep = typeof thouSep === "undefined" ? "." : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;
    
    return sign +
      (j ? i.substr(0, j) + thouSep : "") +
      i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
      (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
  }

  handleUserError(event) {

    var errorResponse = JSON.parse(event.detail.request.xhr.response);
    this.error = errorResponse.mensaje;
  }

}
window.customElements.define('transferencia-card', TransferenciaCard);
