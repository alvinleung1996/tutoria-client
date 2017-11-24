import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-form/iron-form.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-checkbox/paper-checkbox.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';

import {redirectTo} from  '../tutoria-api/tutoria-redirect-utils.js';
import '../tutoria-styles/tutoria-styles.js';
import * as AnimationStyles from '../tutoria-styles/tutoria-animation-styles.js';
import TransitionManager from '../tutoria-transition-manager/tutoria-transition-manager.js';

const template = `
<style>
:host {
  display: block;
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

#form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  grid-gap: 8px;
}
#tutor-type-input,
#tutor-type-input_select {
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--primary_color);
}
#tutor-type-input_select {
  height: 32px;
}
#hourly-rate-range-input {
  display: flex;
  align-items: flex-end;
}
#hourly-rate-range-input_label,
#hourly-rate-range-input_hyphen {
  margin-bottom: 16px;
}
#hourly-rate-range-input_label {
  margin-right: 16px;
}
#hourly-rate-range-input_hyphen {
  margin-left: 16px;
  margin-right: 16px;
}
.label {
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--primary_color);
}
#buttons {
  grid-column-end: span 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
#search-button {
  background-color: dodgerblue;
  color: white;
}
</style>

<div id="content">
  <iron-form id="iron-form"
    on-iron-form-presubmit="_onIronFormPresubmit">
    <form id="form">

      <paper-input label="given name" name="given-name" type="text"></paper-input>
      <paper-input label="family name" name="family-name" type="text"></paper-input>

      <paper-input label="university" name="university" type="text"></paper-input>
      <paper-input label="course code" name="course-code" type="text"></paper-input>

      <paper-input label="subject tags" name="subject-tags" type="text"></paper-input>
      <div id="tutor-type-input">
        <label for="tutor-type-input_select">tutor type:</label>
        <select id="tutor-type-input_select" label="tutor type" name="type">
          <option value="">All</option>
          <option value="contracted">Only Contracted</option>
          <option value="private">Only Private</option>
        </select>
      </div>

      <div id="hourly-rate-range-input">
        <span id="hourly-rate-range-input_label" class="label">Price: </span>
        <paper-input label="min" name="hourly-rate-min" type="number" min="0" step="10"><div prefix>$</div></paper-input>
        <span id="hourly-rate-range-input_hyphen" class="label">-</span>
        <paper-input label="max" name="hourly-rate-max" type="number" min="0" step="10"><div prefix>$</div></paper-input>
      </div>
      <paper-checkbox name="free-only" value="true">Show tutors available timeslot only</paper-checkbox>

      <div id="buttons">
        <paper-button on-click="_onResetButtonClicked">Reset</paper-button>
        <paper-button id="search-button" raised on-click="_onSubmitButtonClicked">Search</paper-button>
      </div>

    </form>
  </iron-form>
</div>
`;

export default class TutoriaSearchBox extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        value: false,
        readOnly: true,
        notify: true
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



  _onWindowClick(evt) {
    if (!evt.composedPath().includes(this) && this.opened && !this.transiting) {
      this.close();
    }
  }



  open(animated = true) {
    this._setOpened(true);
    this._setVisible(true);
    this._setTransiting(true);
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
    this._setOpened(false);
    this._setTransiting(true);
    return this._transitionManager.transit({
      'height': {
        value: '0px',
        noAimation: !animated,
        duration: AnimationStyles.duration,
        timingFunction: AnimationStyles.timingFunction
      }
    })
    .then(() => {
      this._setVisible(false);
      this._setTransiting(false);
    });
  }

  /*
   * Form related operation
   */
  _onResetButtonClicked(evt) {
    this.$['iron-form'].reset();
  }
  _onSubmitButtonClicked(evt) {
    this.$['iron-form'].submit();
  }

  _onIronFormPresubmit(evt) {
    evt.preventDefault();
    this.close();

    let param = evt.target.serializeForm();
    let parts = [];
    for (let key in param) {
      if (param.hasOwnProperty(key) && param[key]) {
        parts.push(`${window.encodeURIComponent(key)}=${window.encodeURIComponent(param[key])}`);
      }
    }
    let uri = this.rootPath + 'search';
    if (parts.length > 0) uri += '?' + parts.join('&');
    redirectTo(uri);
  }

}

window.customElements.define('tutoria-search-box', TutoriaSearchBox);
