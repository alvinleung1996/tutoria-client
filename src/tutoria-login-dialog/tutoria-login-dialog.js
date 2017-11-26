import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-form/iron-form.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';

import { authManager } from '../tutoria-api/tutoria-auth-manager.js';
import '../tutoria-reset-password-dialog/tutoria-ask-account-email-dialog.js';


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
  </form>
</iron-form>
`;

export default class TutoriaLoginDialog extends TutoriaDialog {

  static get template() {
    return TutoriaDialog.generateTemplate({
      contentStyles: contentStyles,
      contentTemplate: contentTemplate
    });
  }

  static get properties() {
    return {
      header: {
        type: String,
        value: 'Log in'
      },
      width: {
        type: String,
        value: 'auto'
      }
    };
  }

  ready() {
    super.ready();
    this.buttons = [{
      text: 'Reset password',
      callback: () => this._onResetPasswordButtonClick()
    }, {
      text: 'Cancel',
      callback: () => this._onCancelButtonClick()
    }, {
      text: 'Log in',
      style: 'background-color: DodgerBlue; color: white',
      raised: true,
      callback: () => this._onLogInButtonClick()
    }];
  }

  showForResult(...args) {
    return this.show(...args)
    .then((resolve, reject) => {
      this._resolveDialog = resolve;
      this._rejectDialog = reject;
      this.$['username-input'].focus();
    });
  }

  _onCancelButtonClick(evt) {
    this.hide().then(this._rejectDialog);
  }

  _onLogInButtonClick() {
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
    authManager.logIn(params.username, params.password)
    .then(() => {
      // Login success
      this.hide().then(() => {
        return this._resolveDialog
      });
    }, () => {
      // Error
      this.$['username-input'].invalid = true;
      this.$['password-input'].invalid = true;
    })
  }



  _onResetPasswordButtonClick() {
    let dialog = document.createElement('tutoria-ask-account-email-dialog');
    dialog.show();
  }

}

window.customElements.define('tutoria-login-dialog', TutoriaLoginDialog);
