import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-icon/iron-icon.js';

import '../tutoria-api/tutoria-api-ajax.js';


export const otherTemplate = `
<tutoria-api-ajax>
  <iron-ajax id="detail-ajax"
    auto
    method="GET"
    url$="[[apiRootPath]]unavailable-periods/[[unavailablePeriod.pk]]"
    handle-as="json"
    last-response="{{_lastDetailAjaxResponse}}"
    last-error="{{_lastDetailAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<!-- <tutoria-api-ajax>
  <iron-ajax id="cancel-ajax"
    method="DELETE"
    url$="[[apiRootPath]]tutorials/[[_detail.id]]"
    handle-as="json"
    last-response="{{_cancelAjaxLastResponse}}"
    last-error="{{_cancelAjaxLastError}}">
  </iron-ajax>
</tutoria-api-ajax> -->
`;

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>
#content {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 4px 16px;
}
.label,
.value {
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--secondary_color);
}
</style>
`;

export const contentTemplate = `
<span class="label">Start Time:</span>
<time class="value">[[_dateToString(_detail.startTime)]]</time>

<span class="label">End Time:</span>
<time class="value">[[_dateToString(_detail.endTime)]]</time>
`;

export default class TutoriaUnavailablePeriodDetailDialog extends TutoriaDialog {

  static get template() {
    return TutoriaDialog.generateTemplate({
      otherTemplate: otherTemplate,
      contentStyles: contentStyles,
      contentTemplate: contentTemplate
    });
  }

  static get properties() {
    return {
      unavailablePeriod: {
        type: Object
      },

      _detail: {
        type: Object,
        computed: '_computeDetail(_lastDetailAjaxResponse.data)'
      },

      header: {
        type: String,
        computed: '_computeHeader(_detail.startTime, _detail.endTime)'
      },
      buttons: {
        type: String,
        computed: '_computeButtons(_detail.cancellable)'
      },
      width: {
        type: Number,
        value: '400px'
      },
    }
  }



  _dateToString(value) {
    return value && value.toLocaleString();
  }



  _computeDetail(data) {
    if (!data) {
      return undefined;
    }
    const detail = data;
    detail.startTime = new Date(detail.startTime);
    detail.endTime = new Date(detail.endTime);
    return detail;
  }



  _computeHeader(startTime, endTime) {
    let header = 'Unavailable Period : ';
    header += `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')} - ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

    return header;
  }

  _computeButtons(cancellable) {
    let buttons = [
      {
        text: 'Close',
        style: 'color: dodgerblue;',
        callback: () => this._onCloseButtonClicked()
      }
    ];
    // if (username === studentUsername) {
    //   buttons.unshift({
    //     text: 'Reopen period',
    //     style: 'color: green;',
    //     disabled: !cancellable,
    //     callback: () => this._onReopenPeriodButtonClicked()
    //   });
    // }
    return buttons;
  }



  _onCloseButtonClicked() {
    this.hide().then(() => this.dispatchEvent(new CustomEvent(
      'tutoria-unavailable-period-detail-dialog-closed',
      {
        detail: { dialog: this }
      }
    )))
  }

  _onCancelBookingButtonClicked() {
    // this._showConfirmCancelDialog();
  }



  // _showConfirmCancelDialog() {
  //   let dialog = document.createElement('tutoria-dialog');
  //   let content;
  //   if (this._detail.totalFee > 0) {
  //     content = 'Tutorial fee will be refunded after the cancellation';
  //   } else {
  //     content = 'Are you sure to cancel the session?';
  //   }
  //   dialog.setProperties({
  //     header: 'Cancel Booking?',
  //     content: content,
  //     buttons: [{
  //       text: 'Cancel Booking',
  //       style: 'color: red;',
  //       callback: d => this._onConfirmCancelButtonClick(d)
  //     }, {
  //       text: 'Keep Booking',
  //       style: 'color: dodgerblue;',
  //       callback: d => this._onKeepBookingButtonClick(d)
  //     }]
  //   });
  //   dialog.show();
  //   this.__confirmDialog = dialog;
  // }

  // _onKeepBookingButtonClick(dialog) {
  //   dialog.hide();
  // }

  // _onConfirmCancelButtonClick(dialog) {
  //   this.$['cancel-ajax'].generateRequest();
  // }
  
  
  
  // _onCancelAjaxRespond(response, error) {
  //   const confirmDialog = this.__confirmDialog;
  //   delete this.__confirmDialog;
  //   if (error) {
  //     console.warn('Cannot cancel session', error);
  //     if (confirmDialog) {
  //       confirmDialog.hide();
  //     }
  //     this.$['detail-ajax'].generateRequest();
  //     return;
  //   }
  //   if (response) {
  //     let dialogs = [this.hide()];
  //     if (confirmDialog) dialogs.push(confirmDialog.hide());
  //     Promise.all(dialogs)
  //     .then(() => this._showTutorialCancelledDialog())
  //   }
  // }



  // _showTutorialCancelledDialog() {
  //   let dialog = document.createElement('tutoria-dialog');
  //   dialog.setProperties({
  //     header: 'Booking Cancelled!',
  //     buttons: [
  //       {
  //         text: 'Close',
  //         style: 'color: dodgerblue;',
  //         callback: d => d.hide().then(this._resolveDialog)
  //       }
  //     ]
  //   });
  //   dialog.show();
  // }

}

window.customElements.define('tutoria-unavailable-period-detail-dialog', TutoriaUnavailablePeriodDetailDialog);
