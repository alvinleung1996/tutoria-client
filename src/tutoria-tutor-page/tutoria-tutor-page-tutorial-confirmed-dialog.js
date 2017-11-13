import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>
#bill {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 8px;
}

:host(:not([payment-required])) .payment-only {
  display: none;
}

.divider {
  border-top: 1px solid var(--tutoria-divider_color);
  grid-column: 1 / -1;
}

.value {
  justify-self: end;
}
</style>
`;

export const contentTemplate = `
<div id="bill">

  <label for="period" class="label">Time: </label>
  <div id="period" class="value">[[_computePeriodText(confirmedBill.startTime, confirmedBill.endTime)]]</div>

  <div class="divider payment-only"></div>

  <label class="label payment-only" for="account-balance">Account balance: </label>
  <div id="account-balance" class="value payment-only">$ [[confirmedBill.balance]]</div>

</div>
`;

export default class TutoriaTutorPageTutorialConfirmedDialog extends TutoriaDialog {

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
        value: 'Tutorial Confirmed!'
      },

      confirmedBill: Object,

      paymentRequired: {
        type: Boolean,
        computed: '_computePaymentRequired(confirmedBill.tutorFee)',
        reflectToAttribute: true
      }
    }
  }

  ready() {
    super.ready();
    this.buttons = [{
        text: 'OK',
        style: 'color: dodgerblue;',
        callback: () => this._onOkButtonClicked()
    }];
  }


  _computePaymentRequired(tutorFee) {
    return tutorFee > 0;
  }

  _computePeriodText(startTime, endTime) {
    if (!startTime || !endTime) {
      return '';
    }
    return `${this._getFormattedDate(startTime)} ${this._getFormattedTime(startTime)} - ${this._getFormattedTime(endTime)}`;
  }

  
  showForResult(...args) {
    return this.show(...args)
    .then(() => new Promise((resolve, reject) => {
      this._resolveDialog = resolve;
      this._rejectDialog = reject;
    }));
  }

  _onOkButtonClicked() {
    this.hide()
    .then(this._resolveDialog)
  }


  _getFormattedDate(time) {
    return `${time.getDate()}/${time.getMonth()}`;
  }

  _getFormattedTime(time) {
    return `${time.getHours().toString().padStart(2,'0')}:${time.getMinutes().toString().padStart(2,'0')}`;
  }

}

window.customElements.define('tutoria-tutor-page-tutorial-confirmed-dialog', TutoriaTutorPageTutorialConfirmedDialog);
