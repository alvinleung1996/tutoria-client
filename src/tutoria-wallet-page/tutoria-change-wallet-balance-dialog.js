import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-form/iron-form.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';

import '../tutoria-api/tutoria-api-ajax.js';


export const otherTemplate = `
<tutoria-api-ajax>
  <iron-ajax id="update-wallet-ajax"
    method="PUT"
    url$="[[apiRootPath]]users/me/wallet"
    content-type="application/json"
    handle-as="json"
    last-response="{{_lastUpdateWalletAjaxResponse}}"
    last-error="{{_lastUpdateWalletAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>
`;

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>

</style>
`;

export const contentTemplate = `
<iron-form id="iron-form">
  <form>
    <paper-input id="amount-input" label="amount delta" name="amountDelta" required type="number" value="0"></paper-input>
  </form>
</iron-form>
`;

export default class TutoriaChangeWalletBalanceDialog extends TutoriaDialog {

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
        value: 'Change Wallet Balance'
      },
      width: {
        type: Number,
        value: '300px'
      },

      _lastUpdateWalletAjaxResponse: {
        observer: '_onLastUpdateWalletAjaxResponseChanged'
      },
      _lastUpdateWalletAjaxError: {
        observer: '_onLastUpdateWalletAjaxErrorChanged'
      }
    };
  }

  ready() {
    super.ready();
    this.buttons = [{
      text: 'Cancel',
      style: 'color: dodgerblue;',
      callback: (d, b) => this._onCancelButtonClick(d, b)
    }, {
      text: 'Change',
      style: 'color: dodgerblue;',
      callback: (d, b) => this._onAddButtonClick(d, b)
    }]
  }

  _onCancelButtonClick(dialog, button) {
    this.hide()
    .then(() => {
      this.dispatchEvent(new CustomEvent('tutoria-change-wallet-balance-dialog-cancel', {
        detail: {
          dialog: this
        }
      }));
    })
  }

  _onAddButtonClick(dialog, button) {
    const ironForm = this.$['iron-form'];
    let serializedForm = ironForm.serializeForm();
    let data = {};
    for (let key in serializedForm) {
      switch (key) {
        default:
          data[key] = serializedForm[key] || '';
      }
    }

    const ajax = this.$['update-wallet-ajax'];
    ajax.body = data;
    ajax.generateRequest();
  }

  _onLastUpdateWalletAjaxResponseChanged(response) {
    if (response) {
      this.hide().then(() => {
        this.dispatchEvent(new CustomEvent('tutoria-change-wallet-balance-dialog-success', {
          detail: {
            dialog: this
          }
        }));
      })
    }
  }

  _onLastUpdateWalletAjaxErrorChanged(errorResponse) {
    const error = errorResponse && errorResponse.response && errorResponse.response.error;
    if (!error) {
      return;
    }

    this._updateInput(this.$['amount-input'], 'amountDelta', error);
  }



  _updateInput(input, propertyName, error) {
    let isError = error && propertyName in error;
    input.setProperties({
      invalid: isError,
      errorMessage: isError ? error[propertyName] : undefined
    });
  }

}

window.customElements.define('tutoria-change-wallet-balance-dialog', TutoriaChangeWalletBalanceDialog);
