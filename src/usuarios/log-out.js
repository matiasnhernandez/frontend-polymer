import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '../my-icons.js';
import '../shared-styles.js';

class LogOut extends PolymerElement {

  static get template() {
    return html`

    <style>
      :host {
        margin: 0;
        padding: 0;
      }
      paper-button {
        color: #fff;
      }
      paper-button.link {
        color: #fff;
        display: inline-block;
        font-size: 13px;
      }
      paper-button.indigo {
        background-color: var(--paper-indigo-500);
        color: white;
        --paper-button-raised-keyboard-focus: {
          background-color: var(--paper-pink-a200) !important;
          color: white !important;
        };
      }
      paper-button.indigo:hover {
        background-color: var(--paper-indigo-400);
      }
    </style>

    <app-location route="{{route}}"></app-location>

    <template is="dom-if" if="{{!link}}">
      <paper-button raised class="indigo" on-tap="logout">Log Out [[[username]]]</paper-button>
    </template>

    <template is="dom-if" if="{{link}}">
      <paper-button class="link" on-tap="logout">Log Out [[[username]]]</paper-button>
    </template>

    `;
  }

  static get properties() {

    return {
      link: {
          type: Boolean,
          value: false
      },
      isLoggedin: {
        type: Boolean,
        value: false,
        notify: true
      },
      username: String

    };
  }

  logout() {
    
    var storedUser = {};
    storedUser.loggedin = false;
    storedUser.access_token = '';
    storedUser.datos = {};
    
    localStorage.setItem("storedUser", JSON.stringify(storedUser));

    this.isLoggedin = false;

    var customEvent = new CustomEvent('logout', {
      bubbles: true, 
      composed: true,
      detail: {storedUser: storedUser}
    });
    this.dispatchEvent(customEvent);

    this.set('route.path', '/login');

  }
}

window.customElements.define('log-out', LogOut);
