import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-form/iron-form.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';

import '../tutoria-api/tutoria-api-ajax.js';
import { authManager } from '../tutoria-api/tutoria-auth-manager.js';
import { redirectTo } from  '../tutoria-api/tutoria-redirect-utils.js';


export const otherTemplate = `
<tutoria-api-auth>
  <iron-ajax id="ajax"
    method="PUT"
    content-type="application/json"
    handle-as="json"
    last-response="{{_lastAjaxResponse}}"
    last-error="{{_lastAjaxError}}">
  </iron-ajax>
</tutoria-api-auth>
`;

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>

</style>
`;

export const contentTemplate = `
<iron-form id="iron-form" on-iron-form-presubmit="_onIronFormPresubmit">
  <form>
    <paper-input id="username-input" label="username" name="username" required on-keypress="_onInputKeyPress"></paper-input>
    <paper-input id="password-input" label="password" name="password" required type="password" on-keypress="_onInputKeyPress"></paper-input>
    <paper-input id="email-input" label="email" name="email" required on-keypress="_onInputKeyPress"></paper-input>
    <paper-input id="given-name-input" label="given name" name="givenName" required on-keypress="_onInputKeyPress"></paper-input>
    <paper-input id="family-name-input" label="family name" name="familyName" required on-keypress="_onInputKeyPress"></paper-input>
    <paper-input id="phone-number-input" label="phone number" name="phoneNumber" required type="tel" on-keypress="_onInputKeyPress"></paper-input>
  </form>
</iron-form>
`;

export default class TutoriaSignUpDialog extends TutoriaDialog {

  static get template() {
    return TutoriaDialog.generateTemplate({
      otherTemplate: otherTemplate,
      contentStyles: contentStyles,
      contentTemplate: contentTemplate
    });
  }

  static get properties() {
    return {
      header: {
        type: String,
        value: 'Sign Up'
      },
      width: {
        type: String,
        value: '500px'
      },

      _lastAjaxResponse: {
        observer: '_onLastAjaxResonseChanged'
      },
      _lastAjaxError: {
        observer: '_onLastAjaxErrorChanged'
      }
    };
  }

  ready() {
    super.ready();
    this.buttons = [{
      text: 'Cancel',
      callback: () => this._onCancelButtonClick()
    }, {
      text: 'Sign up',
      style: 'background-color: DodgerBlue; color: white',
      raised: true,
      callback: () => this._onSignUpButtonClick()
    }];
  }

  show() {
    return super.show()
    .then(() => {
      this.$['username-input'].focus();
    });
  }

  _onCancelButtonClick(evt) {
    this.hide().then(() => {
      this.dispatchEvent(new CustomEvent('tutoria-sign-up-dialog-cancel', {
        detail: {
          dialog: this
        }
      }));
    });
  }

  _onSignUpButtonClick() {
    this.$['iron-form'].submit();
  }

  _onInputKeyPress(evt) {
    if (evt.key === 'Enter') {
      this.$['iron-form'].submit();
    }
  }

  _onIronFormPresubmit(evt) {
    evt.preventDefault();
    const ironForm = evt.target;

    let params = ironForm.serializeForm();
    this.$.ajax.url = `${this.apiRootPath}users/${params.username}`;
    this.$.ajax.body = params;
    this.$.ajax.generateRequest();
  }


  _onLastAjaxResonseChanged(response) {
    if (!response) {
      return;
    }
    this.hide().then(() => {
      this.dispatchEvent(new CustomEvent('tutoria-sign-up-dialog-sign-up', {
        detail: {
          dialog: this
        }
      }));
    }).then(r => {
      // TODO Better way to preserve the username and password which has just sent to the server?
      let username = this.$['username-input'].value;
      let password = this.$['password-input'].value;
      return authManager.login(username, password);
    }).then(() => {
      redirectTo(`${this.rootPath}profile`);
    });
  }

  _onLastAjaxErrorChanged(errorResponse) {
    const error = errorResponse.response.error;

    if (!error) {
      return;
    }
    
    this._updateInput(this.$['username-input'], 'username', error);
    this._updateInput(this.$['password-input'], 'password', error);
    this._updateInput(this.$['email-input'], 'email', error);
    this._updateInput(this.$['given-name-input'], 'givenName', error);
    this._updateInput(this.$['family-name-input'], 'familyName', error);
    this._updateInput(this.$['phone-number-input'], 'phoneNumber', error);
  }

  _updateInput(input, propertyName, error) {
    let isError = propertyName in error;
    input.setProperties({
      invalid: isError,
      errorMessage: isError ? error[propertyName] : undefined
    });
  }

}

window.customElements.define('tutoria-sign-up-dialog', TutoriaSignUpDialog);
