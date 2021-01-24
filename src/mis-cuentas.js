/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './cuenta-card.js';
import './shared-styles.js';

class MisCuentas extends PolymerElement {
  
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
        content-type="application/json"
        handle-as="text"
        on-response="handleConsultarResponse"
        on-error="handleCuentasError">
      </iron-ajax>

      <template is="dom-if" if="[[error]]">
        <p class="alert-error"><strong>Error:</strong> [[error]]</p>
      </template>

      
        <dom-repeat items="{{cuentas}}">
          <template>
            <cuenta-card show-saldo edit-buttons cuenta="{{item}}"></cuenta-card>
          </template>
        </dom-repeat>
      

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

window.customElements.define('mis-cuentas', MisCuentas);
