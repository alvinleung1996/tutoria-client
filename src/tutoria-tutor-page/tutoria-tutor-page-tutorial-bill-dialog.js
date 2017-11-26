import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';

import '../tutoria-api/tutoria-api-ajax.js';

import './tutoria-tutor-page-tutorial-confirmed-dialog.js';

export const otherTemplate = `
<tutoria-api-ajax>
  <iron-ajax id="preview-ajax"
    method="POST"
    url="[[apiRootPath]]tutorials"
    body="[[_previewAjaxBody]]"
    content-type="application/json"
    handle-as="json"
    last-response="{{_previewAjaxLastResponse}}"
    last-error="{{_previewAjaxLastError}}">
  </iron-ajax>
</tutoria-api-ajax>

<tutoria-api-ajax>
  <iron-ajax id="create-ajax"
    method="POST"
    url="[[apiRootPath]]tutorials"
    body="[[_createAjaxBody]]"
    content-type="application/json"
    handle-as="json"
    last-response="{{_createAjaxLastResponse}}"
    last-error="{{_createAjaxLastError}}">
  </iron-ajax>
</tutoria-api-ajax>
`;

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>
#bill {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 8px;
}

:host(:not([payment-required])) .payment-only {
  visibility: hidden;
}

.divider {
  border-top: 1px solid var(--tutoria-divider_color);
  grid-column: 1 / -1;
}
.span {
  grid-column: 1 / -1;
}

.value {
  justify-self: end;
}
.value[error] {
  color: red;
}

#coupon-code-form {
  display: flex;
  align-items: center;
}
#coupon-code-input {
  flex: 1 1 auto;
}
</style>
`;

export const contentTemplate = `
<div id="bill">

  <label for="period" class="label">Time: </label>
  <div id="period" class="value">[[_computePeriodText(_bill.startTime, _bill.endTime)]]</div>

  <div class="divider payment-only"></div>

  <label class="label payment-only" for="account-balance">Account balance: </label>
  <div id="account-balance" class="value payment-only" error$="[[!_bill.isPayable]]">$ [[_bill.balance]]</div>

  <div class="divider payment-only"></div>

  <label class="label payment-only" for="tutor-fee">Tutor Fee: </label>
  <div id="tutor-fee" class="value payment-only">$ [[_bill.tutorFee]]</div>

  <label class="label payment-only" for="commission-fee">Commission Fee: </label>
  <div id="commission-fee" class="value payment-only">$ [[_bill.commissionFee]]</div>

  <div class="divider payment-only"></div>

  <label class="label payment-only" for="coupon-discount">Coupon Discount: </label>
  <div id="coupon-discount" class="value payment-only">$ [[_bill.couponDiscount]]</div>

  <div id="coupon-code-form" class="span payment-only">
    <paper-input id="coupon-code-input" label="coupon code"></paper-input>
    <paper-button id="enter-coupon-code-button" on-click="_onEnterCouponCodeButtonClick">Enter</paper-button>
  </div>

  <div class="divider payment-only"></div>

  <label class="label payment-only" for="total">Total: </label>
  <div id="total" class="value payment-only">$ [[_bill.totalFee]]</div>

</div>
`;

export default class TutoriaTutorialBillDialog extends TutoriaDialog {

  static get template() {
    return TutoriaDialog.generateTemplate({
      otherTemplate: otherTemplate,
      contentStyles: contentStyles,
      contentTemplate: contentTemplate
    });
  }

  static get properties() {
    return {
      tutor: Object,
      startTime: Date,
      endTime: Date,

      header: {
        type: String,
        value: 'Confirm Booking'
      },
      buttons: {
        type: Array,
        computed: '_computeButtons(_bill, paymentRequired)'
      },

      _couponCode: {
        type: String
      },
      _previewAjaxBody: {
        type: String,
        computed: '_computePreviewAjaxBody(tutor.username, startTime, endTime, _couponCode)',
        observer: '_onPreviewAjaxBodyChanged'
      },

      _bill: {
        type: Object,
        computed: '_computeBill(_previewAjaxLastResponse)',
        observer: '_onBillChanged'
      },
      paymentRequired: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
        notify: true
      },
      _createAjaxBody: {
        type: Object,
        computed: '_computeCreateAjaxBody(_bill)'
      },

      _confirmedBill: {
        type: Object,
        computed: '_computeConfirmedBill(_createAjaxLastResponse, _createAjaxLastError)',
        observer: '_onConfirmedBillChanged'
      }
    }
  }

  static get observers() {
    return [
    ];
  }

  ready() {
    super.ready();
    
  }



  _computeButtons(bill, paymentRequired) {
    return [{
      text: 'Cancel',
      style: 'color: dodgerblue;',
      callback: () => this._onCancelButtonClicked()
    }, {
      text: paymentRequired ? 'Pay' : 'Confirm',
      style: 'color: dodgerblue;',
      disabled: !Boolean(bill && bill.creatable),
      callback: () => this._onConfirmButtonClicked()
    }];
  }



  showForResult(...args) {
    return this.show(...args)
    .catch(e => {
      if (e !== 'abort transition') {
        return Promise.reject(e);
      }
    }).then(() => new Promise((resolve, reject) => {
      this._resolveDialog = resolve;
      this._rejectDialog = reject;
    }));
  }


  _computePreviewAjaxBody(tutorUsername, startTime, endTime, couponCode) {
    if (!tutorUsername || !startTime || !endTime) {
      return undefined
    }
    let body = {
      preview: true,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      studentUsername: 'me',
      tutorUsername: tutorUsername
    };
    if (couponCode) {
      body.couponCode = couponCode
    }
    return body;
  }

  _onPreviewAjaxBodyChanged(body) {
    if (body) {
      this.$['preview-ajax'].generateRequest();
    }
  }



  _computeBill(response) {
    if (!response) {
      return undefined;
    }

    let bill = response.data;
    bill.startTime = new Date(bill.startTime);
    bill.endTime = new Date(bill.endTime);
    bill.balance = Number.parseFloat(bill.balance);
    bill.tutorFee = Number.parseFloat(bill.tutorFee);
    bill.commissionFee = Number.parseFloat(bill.commissionFee);
    bill.couponDiscount = Number.parseFloat(bill.couponDiscount);
    bill.totalFee = Number.parseFloat(bill.totalFee);

    return bill;
  }

  _onBillChanged(bill) {
    if (bill && !bill.timeValid) {
        console.info('Time is not valid');
        this.hide()
        .then(() => {
          this._showCannotCreateTutorialDialog(bill);
        });
    }

    this.$['coupon-code-input'].invalid = Boolean(bill && bill.couponValid === false);

    this.set('buttons.1.disabled', !Boolean(bill && bill.creatable));

    this._setPaymentRequired(bill.tutorFee > 0);
  }
  

  _computeCreateAjaxBody(bill) {
    if (!bill) {
      return undefined;
    }
    let body = {
      studentUsername: bill.studentUsername,
      tutorUsername: bill.tutorUsername,
      startTime: bill.startTime.toISOString(),
      endTime: bill.endTime.toISOString()
    };
    if (bill.couponCode !== undefined && bill.couponCode !== null) {
      body.couponCode = bill.couponCode;
    }
    return body;
  }
  
  _computeConfirmedBill(response, error) {
    if (error) {
      return false;

    } else if (response && response.data) {
      let confirmedBill = response.data;
      confirmedBill.startTime = new Date(confirmedBill.startTime);
      confirmedBill.endTime = new Date(confirmedBill.endTime);
      confirmedBill.balance = Number.parseFloat(confirmedBill.balance);
      confirmedBill.tutorFee = Number.parseFloat(confirmedBill.tutorFee);
      confirmedBill.commissionFee = Number.parseFloat(confirmedBill.commissionFee);
      confirmedBill.couponDiscount = Number.parseFloat(confirmedBill.couponDiscount);
      confirmedBill.totalFee = Number.parseFloat(confirmedBill.totalFee);
      return confirmedBill;

    } else {
      return undefined;
    }
  }
  
  _onConfirmedBillChanged(confirmedBill) {
    if (confirmedBill === false) {
      this.hide()
      .then(() => {
        this._showCannotCreateTutorialDialog(this._bill);
        // TODO: how to ensure the bill is the same as when the request is sent?
      });
    } else if (confirmedBill) {
      this._showTutorialConfirmedDialog(confirmedBill);
    }
  }



  _computePeriodText(startTime, endTime) {
    if (!startTime || !endTime) {
      return '';
    }
    return `${this._getFormattedDate(startTime)} ${this._getFormattedTime(startTime)} - ${this._getFormattedTime(endTime)}`;
  }

  _onEnterCouponCodeButtonClick(evt) {
    this._couponCode = this.$['coupon-code-input'].value;
  }



  _onCancelButtonClicked() {
    this.hide()
    .then(this._rejectDialog);
  }

  _onConfirmButtonClicked() {
    this.$['create-ajax'].generateRequest();
  }


  _showCannotCreateTutorialDialog(bill) {
    let dialog = document.createElement('tutoria-dialog');
    let content = `You cannot book this timeslots: ${this._getFormattedDate(bill.startTime)} ${this._getFormattedTime(bill.startTime)} - ${this._getFormattedTime(bill.endTime)}`;
    dialog.setProperties({
      header: 'Sorry 🙇',
      content: content,
      buttons: [{
        text: 'OK',
        style: 'color: dodgerblue;',
        callback: d => d.hide().then(this._rejectDialog)
      }]
    });
    dialog.show();
  }


  _showTutorialConfirmedDialog(confirmedBill) {
    let dialog = document.createElement('tutoria-tutor-page-tutorial-confirmed-dialog');
    dialog.confirmedBill = confirmedBill;
    this.hide()
    .then(() => dialog.showForResult())
    .then(this._resolveDialog);
  }




  _getFormattedDate(time) {
    return `${time.getDate()}/${time.getMonth()}`;
  }

  _getFormattedTime(time) {
    return `${time.getHours().toString().padStart(2,'0')}:${time.getMinutes().toString().padStart(2,'0')}`;
  }

}

window.customElements.define('tutoria-tutor-page-tutorial-bill-dialog', TutoriaTutorialBillDialog);
