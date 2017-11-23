import TutoriaElement from '../tutoria-element/tutoria-element.js';
import {mixinBehaviors} from '../../node_modules/@polymer/polymer/lib/legacy/class.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-media-query/iron-media-query.js';
import {IronResizableBehavior} from '../../node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-icon-button/paper-icon-button.js';
import '../../node_modules/@polymer/iron-image/iron-image.js';

import { authManager } from '../tutoria-api/tutoria-auth-manager.js';
import '../tutoria-icons/tutoria-icons.js';
import '../tutoria-login-dialog/tutoria-login-dialog.js';
import '../tutoria-search-box/tutoria-search-box.js';
import '../tutoria-sign-up-dialog/tutoria-sign-up-dialog.js';
import '../tutoria-styles/tutoria-styles.js';
import '../tutoria-user-box/tutoria-user-box.js';

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
  justify-content: center;
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

#content {
  position: relative;
  flex: 0 1 1000px;
  display: flex;
  justify-content: space-between;
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

#right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
}
#search-button {
  color: var(--tutoria-text--app-theme--primary_color);
  --paper-icon-button-ink-color: var(--tutoria-text--app-theme--primary_color);
  margin-right: 12px;
}
#search-button:not([show]) {
  display: none;
}
:host([_logged-in]) #log-in-button,
:host([_logged-in]) #sign-up-button,
:host(:not([_logged-in])) #search-button,
:host(:not([_logged-in])) #avatar {
  display: none;
}
#log-in-button,
#sign-up-button {
  background-color: var(--tutoria-background--primary_color);
  @apply --tutoria-text--button_font;
  color: var(--tutoria-background--app-theme--primary_color);
}
#avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--tutoria-background--primary_color);
  cursor: pointer;
}

#user-box {
  position: absolute;
  top: 100%;
  right: 0px;
}

#search-box {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 600px;
  transform: translateX(-50%);
  max-height: calc(100vh - var(--tutoria-toolbar--normal_height) - 8px);
  max-width: 100%;
}
:host([short]) #search-box {
  max-height: calc(100vh - var(--tutoria-toolbar--short_height) - 8px);
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

<tutoria-auth-manager
  logged-in="{{_loggedIn}}"
  user-profile="{{_userProfile}}">
</tutoria-auth-manager>

<div id="content">

<div id="left">
  <a id="home-button-link" href="/" tabindex="-1">
    <paper-button id="home-button">Tutoria</paper-button>
  </a>
</div>

<div id="right">
  <paper-icon-button id="search-button" icon="tutoria:search" show$="[[_computeShowSearchButton(_userProfile.roles)]]" on-click="_onSearchButtonClick"></paper-icon-button>
  <paper-button id="log-in-button" raised on-click="_onLogInButtonClick">Log in</paper-button>
  <paper-button id="sign-up-button" raised on-click="_onSignUpButtonClick">Sign up</paper-button>
  <iron-image id="avatar" src="[[_userProfile.avatar]]" sizing="contain" fade preload on-click="_onAvatarClick"></iron-image>
</div>

<tutoria-user-box id="user-box"></tutoria-user-box>

<tutoria-search-box
  id="search-box"
  opened="{{_searchBoxOpened}}">
</tutoria-search-box>

</div>
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
        notify: true
      },
      hide: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      showShadow: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },

      _loggedIn: {
        type: Boolean,
        reflectToAttribute: true
      }
    };
  }

  _computeShowSearchButton(roles) {
    return Boolean(roles && roles.includes('student'));
  }

  _onLogInButtonClick(evt) {
    let dialog = document.createElement('tutoria-login-dialog');
    dialog.showForResult();
  }

  _onSignUpButtonClick(evt) {
    // alert('Not yet implemented 😎');
    let dialog = document.createElement('tutoria-sign-up-dialog');
    dialog.show();
  }

  _onSearchButtonClick(evt) {
    let searchBox = this.$['search-box'];
    if (searchBox.opened) searchBox.close();
    else searchBox.open();
  }

  _onAvatarClick(evt) {
    let userBox = this.$['user-box'];
    if (userBox.opened) {
      userBox.close();
    } else {
      userBox.open();
    }
  }

}

window.customElements.define('tutoria-toolbar', TutoriaToolbar);
