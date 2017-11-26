import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-form/iron-form.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';

import '../tutoria-api/tutoria-api-ajax.js';

export const otherTemplate = `
<tutoria-api-ajax>
  <iron-ajax id="ajax"
    method="PUT"
    content-type="application/json"
    handle-as="json"
    last-response="{{_lastAjaxResponse}}"
    last-error="{{_lastAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>
`;

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>

</style>
`;

export const contentTemplate = `
<iron-form id="iron-form" on-iron-form-presubmit="_onIronFormPresubmit">
  <form>
    <paper-input id="access-token-input" label="access token" name="accessToken" required on-keypress="_onInputKeyPress"></paper-input>
    <paper-input id="username-input" label="username" name="username" required on-keypress="_onInputKeyPress"></paper-input>
    <paper-input id="password-input" label="new password" name="password" type="password" required on-keypress="_onInputKeyPress"></paper-input>
  </form>
</iron-form>
`;

export default class TutoriaResetPasswordDialog extends TutoriaDialog {

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
        value: 'Step 2. Enter the access token and new password'
      },
      width: {
        type: String,
        value: 'auto'
      },

      _lastAjaxResponse: {
        observer: '_onLastAjaxResponseChanged'
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
      text: 'Next',
      style: 'background-color: DodgerBlue; color: white',
      raised: true,
      callback: () => this._onNextButtonClick()
    }];
  }

  show() {
    return super.show()
    .then(() => {
      this.$['access-token-input'].focus();
    });
  }

  _onCancelButtonClick(evt) {
    this.hide().then(() => {
      this.dispatchEvent(new CustomEvent('tutoria-reset-password-dialog-cancel', {
        detail: { dialog: this }
      }));
    });
  }

  _onNextButtonClick() {
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

    let serializedForm = ironForm.serializeForm();
    let data = {};
    for (let key in serializedForm) {
      switch (key) {
        default:
          if (serializedForm[key]) data[key] = serializedForm[key];
      }
    }

    if (!data.username) {
      return;
    }

    const ajax = this.$.ajax;
    ajax.url = `${this.apiRootPath}users/${serializedForm.username}/password`
    ajax.body = data;
    ajax.generateRequest();
  }

  _onLastAjaxResponseChanged(response) {
    if (response) {
      this.hide().then(() => {
        this.dispatchEvent(new CustomEvent('tutoria-reset-password-dialog-next', {
          detail: {
            dialog: this
          }
        }));
      })
    }
  }

  _onLastAjaxErrorChanged(errorResponse) {
    const error = errorResponse && errorResponse.response && errorResponse.response.error;
    if (!error) {
      return;
    }

    this._updateInput(this.$['access-token-input'], 'accessToken', error);
    this._updateInput(this.$['username-input'], 'username', error);
    this._updateInput(this.$['password-input'], 'password', error);
  }



  _updateInput(input, propertyName, error) {
    let isError = error && propertyName in error;
    input.setProperties({
      invalid: isError,
      errorMessage: isError ? error[propertyName] : undefined
    });
  }

}

window.customElements.define('tutoria-reset-password-dialog', TutoriaResetPasswordDialog);
