import TutoriaElement from '../tutoria-element/tutoria-element.js';
import {mixinBehaviors} from '../../node_modules/@polymer/polymer/lib/legacy/class.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-media-query/iron-media-query.js';
import {IronResizableBehavior} from '../../node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';

import '../tutoria-icons/tutoria-icons.js';
import '../tutoria-search-input/tutoria-search-input.js';
import '../tutoria-search-box/tutoria-search-box.js';
import '../tutoria-styles/tutoria-styles.js';

import './tutoria-toolbar-styles.js';


const template = `
<style>
:host {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  height: var(--tutoria-toolbar--normal_height);
  z-index: 10;
  outline: 1px solid var(--tutoria-divider_color);
  background-color: var(--tutoria-background--app-theme--primary_color);
  display: flex;
  transition: height var(--tutoria-toolbar_height-transition-duration) var(--tutoria-toolbar_height-transition-timing-function),
              transform var(--tutoria-toolbar_hide-toggling-duration) var(--tutoria-toolbar_hide-toggling-timing-function),
              outline-width var(--tutoria-shadow_transition-duration) var(--tutoria-shadow_transition-timing-function),
              var(--tutoria-shadow_transition);
}
:host([short]) {
  height: var(--tutoria-toolbar--short_height);
}
:host([hide]) {
  transform: translateY(-100%);
}
:host([show-shadow]) {
  outline-width: 0px;
  @apply --tutoria-shadow--elevation-2;
}

#left {
  flex: 0 0 auto;
  display: flex;
}
#home-button-link {
  flex: 0 0 auto;
  display: flex;
  text-decoration: none;
}
#home-button {
  flex: 0 0 auto;
  margin: 0px;
  padding: 0px 12px 0px 12px;
  @apply --tutoria-text--title_font;
  color: var(--tutoria-text--app-theme--primary_color);
  text-transform: none;
}

#center {
  flex: 1 1 0px;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
#search-button {
  color: white;
}
/* #center {
  flex: 0 1 960px;
  position: relative;
  display: flex;
  padding: var(--tutoria-toolbar__search-input--normal_margin);
  --tutoria-search-input_height: calc(var(--tutoria-toolbar--normal_height) - (var(--tutoria-toolbar__search-input--normal_margin) * 2));
  transition: padding var(--tutoria-toolbar_height-transition-duration) var(--tutoria-toolbar_height-transition-timing-function);
}
:host([short]) #center {
  padding: var(--tutoria-toolbar__search-input--short_margin);
  --tutoria-search-input_height: calc(var(--tutoria-toolbar--short_height) - (var(--tutoria-toolbar__search-input--short_margin) * 2));
}
#search-input {
  flex: 1 1 auto;
} */

#search-box {
  position: absolute;
  top: 100%;
  left: 0px;
  right: 0px;
  max-height: calc(100vh - var(--tutoria-toolbar--normal_height) - 8px);
}
:host([short]) #search-box {
  max-height: calc(100vh - var(--tutoria-toolbar--short_height) - 8px);
}
#center > #search-box {
  top: calc(100% - var(--tutoria-toolbar__search-input--normal_margin));
  left: var(--tutoria-toolbar__search-input--normal_margin);
  right: var(--tutoria-toolbar__search-input--normal_margin);
}
:host([short]) #center > #search-box {
  top: calc(100% - var(--tutoria-toolbar__search-input--short_margin));
  left: var(--tutoria-toolbar__search-input--short_margin);
  right: var(--tutoria-toolbar__search-input--short_margin);
}

#right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}
</style>

<iron-media-query
  query="not all and (min-height: 300px)"
  query-matches="{{short}}"
  full>
</iron-media-query>

<iron-media-query
  query="not all and (min-width: 700px)"
  query-matches="{{narrow}}"
  full>
</iron-media-query>

<div id="left">
  <a id="home-button-link" href="/" tabindex="-1">
    <paper-button id="home-button">Tutoria</paper-button>
  </a>
</div>

<div id="center">
  <!-- <tutoria-search-input id="search-input"
    short-toolbar="[[short]]"
    flip-drop-down-arrow="[[_searchBoxOpened]]">
  </tutoria-search-input> -->
  <paper-icon-button id="search-button" active="{{_openSearchBox}}" icon="tutoria:search" toggles></paper-icon-button>
</div>

<div id="right">
  <input id="username" type="text" placeholder="username" size="10">
  <input id="password" type="password" placeholder="password" size="10">
  <button on-click="_onLoginButtonClick">Login</button>
  <button on-click="_onLogoutButtonClick">Logout</button>
</div>

<tutoria-search-box
  id="search-box"
  opened="{{_searchBoxOpened}}">
</tutoria-search-box>
`;

export default class TutoriaToolbar extends mixinBehaviors(IronResizableBehavior, TutoriaElement) {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      short: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true
      },
      narrow: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true,
        observer: '_onNarrowChanged'
      },
      hide: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      showShadow: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      _openSearchBox: {
        type: Boolean,
        value: false,
        observer: '_onOpenSearchBoxChanged'
      }
    };
  }

  ready() {
    super.ready();
    this.addEventListener('iron-resize', e => this._onIronResize(e));
    // this.$['search-input'].addEventListener('tutoria-search-input-drop-down-button-clicked',
    //   e => this._onSearchInputDropDownButtonClicked(e));
  }

  _onIronResize(evt) {
    // this._updateSearchBoxPosition();
  }

  _onNarrowChanged(narrow) {
    let searchBox = this.$['search-box'];
    let parent = narrow ? this.shadowRoot : this.$.center;
    parent.appendChild(searchBox);
  }

  // _updateSearchBoxPosition() {
  //     let toolbarRect = this.getBoundingClientRect();
  //     let x, y;
  //     if (this.narrow) {
  //       x = 0;
  //       y = toolbarRect.height;
  //     } else {
  //       let inputRect = this.$['search-input'].getBoundingClientRect();
  //       x = inputRect.left - toolbarRect.left;
  //     }
  //     let searchBox = this.$['search-box'];
  //     searchBox.style.setProperty('left', x !== undefined ? (x + 'px') : '');
  //     searchBox.style.setProperty('top', y !== undefined ? (y + 'px') : '');
  // }

  _onSearchInputDropDownButtonClicked(evt) {
    let searchBox = this.$['search-box'];
    if (searchBox.opened) {
      searchBox.close().then(() => console.log('hide-finished'));
    } else {
      searchBox.open().then(() => console.log('show-finished'));
    }
  }

  _onOpenSearchBoxChanged(open) {
    let searchBox = this.$['search-box'];
    if (open) searchBox.open();
    else searchBox.close();
  }


  _onLoginButtonClick(evt) {
    let ajax = document.createElement('iron-ajax');
    ajax.body = {
      username: this.$.username.value,
      password: this.$.password.value
    };
    ajax.contentType = 'application/json';
    ajax.handleAs = 'json';
    ajax.method = 'POST';
    ajax.url = `${this.apiRootPath}auth/login`;
    let request = ajax.generateRequest();
    request.completes.then(r => {
      let response = r.response;
      if ('error' in response) {
        return Promise.reject(response);
      } else {
        return Promise.resolve(response);
      }
    }, e => {
      return Promise.reject({
        error: e
      });
    }).then(r => {
      console.info('authenticate success!', r);
      window.location.reload();
    }, r => {
      console.warn('Cannot authenticate: ', r);
    });
  }

  _onLogoutButtonClick(evt) {
    let ajax = document.createElement('iron-ajax');
    ajax.handleAs = 'json';
    ajax.method = 'GET';
    ajax.url = `${this.apiRootPath}auth/logout`;
    let request = ajax.generateRequest();
    request.completes.then(r => {
      let response = r.response;
      if ('error' in response) {
        return Promise.reject(response);
      } else {
        return Promise.resolve(response);
      }
    }, e => {
      return Promise.reject({
        error: e
      });
    }).then(r => {
      console.info('logout success!', r);
      window.location.reload();
    }, r => {
      console.warn('Cannot logout: ', r);
    });
  }
}

window.customElements.define('tutoria-toolbar', TutoriaToolbar);
