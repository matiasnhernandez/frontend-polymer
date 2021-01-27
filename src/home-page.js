import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class HomePage extends PolymerElement {
  
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
        li {
          margin: 10px;
        }
      </style>

      <div class="card">
        <h1>Bienvenidos a practitioner app!</h1>

        <p>Es una aplicacion desarrollada con polymer 3 y que cuenta con las siguientes funcionalidades: </p>

        <ul>
          <li>Login de usuarios</li>
          <li>Alta de usuarios</li>
          <li>Modificacion de usuarios (Requiere login)</li>
          <li>Creacion de cuentas (Requiere login)</li>
          <li>Consulta de cuentas (Requiere login)</li>
          <li>Transferencias entre cuentas (Requiere login)</li>
          <li>Consulta de transferencias (Requiere login)</li>
        </ul>

        
      </div>

        

    `;
  }

  static get properties() {
    return {
    };
  }
  
}

window.customElements.define('home-page', HomePage);
