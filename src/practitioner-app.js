import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import './log-out.js';
import './my-icons.js';

setPassiveTouchGestures(true);
setRootPath(PractitionerAppGlobals.rootPath);

class PractitionerApp extends PolymerElement {

  ready() {
    super.ready();

    this.getUserFromLocalStorage();

    this.addEventListener('login', function (e) {
      console.log('event login: ' + e.detail.storedUser);
      this.storedUser = e.detail.storedUser;
    });

    this.addEventListener('logout', function (e) {
      console.log('event logout: ' + e.detail.storedUser);
      this.storedUser = e.detail.storedUser;
    });
    
  }
  static get template() {

    return html`
      <style>
      :host {
        --app-primary-color: #1d73b2;
        --app-secondary-color: black;

        display: block;
      }

      app-drawer-layout:not([narrow]) [drawer-toggle] {
        display: none;
      }

      app-header {
        color: #fff;
        background-color: var(--app-primary-color);
      }

      app-header paper-icon-button {
        --paper-icon-button-ink-color: white;
      }

      .drawer-list {
        margin: 0 20px;
      }

      .drawer-list a {
        display: block;
        padding: 0 16px;
        text-decoration: none;
        color: var(--app-secondary-color);
        line-height: 40px;
      }

      .drawer-list a.iron-selected {
        color: black;
        font-weight: bold;
      }

      app-header .greeting,
      app-header a {
        color: #fff;
        font-size: 15px;
      }
      app-header .greeting {
        border-right: 1px solid rgba(255,255,255,.5);
        display: inline-block;
        padding-right: 6px;
      }
      .login-link{
        font-size: 18px;
      }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <!--<a name="login" href="[[rootPath]]login">Login</a> -->
            <a name="home-page" href="[[rootPath]]home-page">Home</a>
            <a name="mis-cuentas" href="[[rootPath]]mis-cuentas">Mis cuentas</a>
            <a name="alta-cuenta" href="[[rootPath]]alta-cuenta">Crear cuenta</a>
            <!--<a name="registrar" href="[[rootPath]]registrar">Registrar</a>-->
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">Practitioner App</div>

              <a class="login-link" name="login" href="[[rootPath]]login" hidden$="[[storedUser.loggedin]]">Log in</a>
              <template is="dom-if" if="[[storedUser.loggedin]]">
                <a name="datos-usuario" href="[[rootPath]]datos-usuario"><span class="greeting">Hola [[storedUser.datos.nombre]]!</span></a>
                <log-out link username="[[storedUser.datos.username]]" is-loggedin="{{storedUser.loggedin}}"></log-out>
              </template>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" selected-attribute="active" attr-for-selected="name" role="main">
            
            <home-page name="home-page"></home-page>
            <log-in name="login"></log-in>
            <datos-usuario name="datos-usuario"></datos-usuario>
            <mis-cuentas name="mis-cuentas"></mis-cuentas>
            <alta-cuenta name="alta-cuenta"></alta-cuenta>
            <sign-up name="registrar"></sign-up>
            <my-view404 name="view404"></my-view404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {

    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object,
      storedUser: { 
        type: Object,
        value:{},
        notify: true,
        reflectToAttribute: true
      }
    };
  }

  static get observers() {

    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  _routePageChanged(page) {

    this.getUserFromLocalStorage();
    if (!page) {
      this.page = 'home-page';
    } else if (['home-page','login', 'registrar', 'datos-usuario', 'mis-cuentas', 'alta-cuenta'].indexOf(page) !== -1) {

      if (!this.storedUser.loggedin){
        if (['registrar', 'view404', 'home-page'].indexOf(page) !== -1 ){
          this.page = page;
        }else{
          this.page = 'login';
        }
      }else{
        this.page = page;
      }

    } else {
      this.page = 'view404';
    }

    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  getUserFromLocalStorage(){
    
    var user = JSON.parse(localStorage.getItem("storedUser"));
    if (user != 'undefined'){
      this.storedUser = user;
    }

  }

  _pageChanged(page) {

    switch (page) {
      case 'home-page':
        import('./home-page.js');
        break;
      case 'login':
        import('./log-in.js');
        break;
      case 'datos-usuario':
        import('./datos-usuario.js');
        break;
      case 'mis-cuentas':
        import('./mis-cuentas.js');
        break;
      case 'alta-cuenta':
        import('./alta-cuenta.js');
        break;
      case 'registrar':
        import('./sign-up.js');
        break;
      case 'view404':
        import('./my-view404.js');
        break;
    }
  }
}

window.customElements.define('practitioner-app', PractitionerApp);
