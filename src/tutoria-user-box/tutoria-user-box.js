import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-image/iron-image.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';

import { authManager } from '../tutoria-api/tutoria-auth-manager';
import '../tutoria-styles/tutoria-styles.js';
import * as AnimationStyles from '../tutoria-styles/tutoria-animation-styles.js';
import TransitionManager from '../tutoria-transition-manager/tutoria-transition-manager.js';

export const template = `
<style>
  :host {
    display: block;
    width: 300px;
    max-width: 100vw;
    border-radius: 4px;
    overflow-x: hidden;
    overflow-y: auto;
    @apply --tutoria-shadow--elevation-2;
    background-color: var(--tutoria-background--primary_color);
  }
  :host(:not([visible])) {
    display: none;
  }
  :host([transiting]) {
    overflow-y: hidden;
    pointer-events: none;
  }

  #content {
    padding: 16px;
  }

  #profile {
    height: 96px;
    display: flex;
  }
  #avatar {
    flex: 0 0 96px;
    border-radius: 50%;
    background-color: var(--tutoria-background--primary_color);
  }
  #info {
    flex: 1 1 auto;
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  #full-name {
    margin: 0px;
    @apply --tutoria-text--title_font;
    color: var(--tutoria-text--primary_color);
  }
  #email {
    margin: 16px 0px 0px 0px;
    @apply --tutoria-text--subheading_font;
    color: var(--tutoria-text--secondary_color);
  }

  #buttons {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
  .button {
    @apply --tutoria-text--button_font;
  }
  #profile-button {
    color: var(--tutoria-text--primary_color);
  }
  #log-out-button {
    background-color: var(--tutoria-background--app-theme--primary_color);
    color: var(--tutoria-text--app-theme--primary_color);
  }

  a {
    text-decoration: none;
  }
</style>

<tutoria-auth-manager
  logged-in="{{_loggedIn}}"
  user-profile="{{_userProfile}}">
</tutoria-auth-manager>

<div id="content">
  <div id="profile">
    <iron-image id="avatar" src="[[_userProfile.avatar]]" sizing="contain" fade preload on-click="_onAvatarClick"></iron-image>
    <div id="info">
      <p id="full-name">[[_userProfile.fullName]]</p>
      <p id="email">[[_userProfile.email]]</p>
    </div>
  </div>

  <div id="buttons">
    <a href$="[[rootPath]]profile" tabindex="-1" on-click="_onProfileButtonLinkClick"><paper-button id="profile-button" class="button">Profile</paper-button></a>
    <paper-button id="log-out-button" class="button" raised on-click="_onLogOutButtonClick">Log out</paper-button>
  </div>

</div>
`;

export default class TutoriaUserBox extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true
      },
      visible: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true
      },
      transiting: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true
      }
    };
  }

  constructor() {
    super();
    this.__onWindowClickHandler = e => this._onWindowClick(e);
  }

  ready() {
    super.ready();
    this._transitionManager = new TransitionManager(this);
    this.style.setProperty('height', '0px');
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('click', this.__onWindowClickHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('click', this.__onWindowClickHandler);
  }

  open(animated = true) {
    this.setProperties({
      opened: true,
      visible: true,
      transiting: true
    }, true);
    return this._transitionManager.transit({
      'height': {
        value: '',
        noAimation: !animated,
        duration: AnimationStyles.duration,
        timingFunction: AnimationStyles.timingFunction
      }
    })
    .then(() => {
      this._setTransiting(false)
    });
  }

  close(animated = true) {
    this.setProperties({
      opened: false,
      transiting: true
    }, true);
    return this._transitionManager.transit({
      'height': {
        value: '0px',
        noAimation: !animated,
        duration: AnimationStyles.duration,
        timingFunction: AnimationStyles.timingFunction
      }
    })
    .then(() => {
      this.setProperties({
        visible: false,
        transiting: false
      }, true);
    });
  }

  _onProfileButtonLinkClick(evt) {
    this.close();
  }

  _onLogOutButtonClick(evt) {
    authManager.logOut()
    .then(() => this.close());
  }

  _onWindowClick(evt) {
    if (!evt.composedPath().includes(this) && this.opened && !this.transiting) {
      this.close();
    }
  }

}

window.customElements.define('tutoria-user-box', TutoriaUserBox);
