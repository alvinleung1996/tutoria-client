import {Element as PolymerElement} from '../../node_modules/@polymer/polymer/polymer-element.js';
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
#form > * {
  flex-basis: calc(50% - 8px);
}
#form > .span {
  flex-basis: 100%;
}
#form > .composite {
  display: flex;
  align-items: center;
}
#form > .composite.align-right {
  justify-content: flex-end;
}
#form > .composite > * {

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
      <select label="tutor type" name="type">
        <option value="">All</option>
        <option value="contracted">Only Contracted</option>
        <option value="private">Only Private</option>
      </select>
      <div class="composite">
        Price:
        <paper-input label="min" name="price-min" type="number" min="0" step="10" error-message="Price must be a multiple of $10"><div prefix>$</div></paper-input>
        -
        <paper-input label="max" name="price-max" type="number" min="0" step="10"><div prefix>$</div></paper-input>
      </div>
      <paper-checkbox name="show-all" value="true">Show tutors with no available timeslot</paper-checkbox>
      <div class="span composite align-right">
        <paper-button on-click="_onResetButtonClicked">Reset</paper-button>
        <paper-button raised on-click="_onSubmitButtonClicked">Search</paper-button>
      </div>
    </form>
  </iron-form>
</div>
`;

export default class TutoriaSearchBox extends PolymerElement {

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

  ready() {
    super.ready();
    this._transitionManager = new TransitionManager(this);
    this.style.setProperty('height', '0px');
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
    console.log('submit button clicked!');
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
    let queryString = parts.join('&');
    let uri = '/search' + (queryString ? ('?'+queryString) : '');
    redirectTo(uri);
  }

}

window.customElements.define('tutoria-search-box', TutoriaSearchBox);
