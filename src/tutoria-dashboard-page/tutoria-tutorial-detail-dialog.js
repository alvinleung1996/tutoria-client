import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-icon/iron-icon.js';
import '../../node_modules/@polymer/iron-image/iron-image.js';

import '../tutoria-api/tutoria-api-ajax.js';
import '../tutoria-api/tutoria-auth-manager.js';


export const otherTemplate = `
<tutoria-auth-manager user-profile="{{_userProfile}}"></tutoria-auth-manager>

<tutoria-api-ajax>
  <iron-ajax id="detail-ajax"
    auto
    method="GET"
    url$="[[apiRootPath]]tutorials/[[event.id]]"
    handle-as="json"
    last-response="{{_detailAjaxLastResponse}}"
    last-error="{{_detailAjaxLastError}}">
  </iron-ajax>
</tutoria-api-ajax>

<tutoria-api-ajax>
  <iron-ajax id="cancel-ajax"
    method="DELETE"
    url$="[[apiRootPath]]tutorials/[[_detail.id]]"
    handle-as="json"
    last-response="{{_cancelAjaxLastResponse}}"
    last-error="{{_cancelAjaxLastError}}">
  </iron-ajax>
</tutoria-api-ajax>
`;

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>
#content {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-rows: minmax(48px, auto);
  grid-gap: 16px 16px;
  align-items: center;
}
#avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}
p#full-name,
p.value {
  margin: 0px;
}
#full-name {
  @apply --tutoria-text--title_font;
  color: var(--tutoria-text--primary_color);
}
.icon {
  justify-self: center;
  color: var(--tutoria-accent_color);
}
</style>
`;

export const contentTemplate = `
<iron-image id="avatar" src="[[_avatar]]" fade preload sizing="contain"></iron-image>
<p id="full-name">[[_fullName]]</p>

<iron-icon icon="tutoria:phone" class="icon"></iron-icon>
<p id="phone-number" class="value">[[_phoneNumber]]</p>

<iron-icon icon="tutoria:message" class="icon"></iron-icon>
<p id="send-message" class="value">Send Message</p>
`;

export default class TutoriaTutorialDetailDialog extends TutoriaDialog {

  static get template() {
    return TutoriaDialog.generateTemplate({
      otherTemplate: otherTemplate,
      contentStyles: contentStyles,
      contentTemplate: contentTemplate
    });
  }

  static get properties() {
    return {
      event: {
        type: Object
      },

      _detail: {
        type: Object,
        computed: '_computeDetail(_detailAjaxLastResponse.data)'
      },

      header: {
        type: String,
        computed: '_computeHeader(_detail.startTime, _detail.endTime)'
      },
      buttons: {
        type: String,
        computed: '_computeButtons(_userProfile.username, _detail.student.username, _detail.cancellable)'
      },
      width: {
        type: Number,
        value: '350px'
      },

      _avatar: {
        type: String,
        computed: '_computeAvatar(_userProfile.username, _detail.student.username, _detail.tutor.username, _detail.student.avatar, _detail.tutor.avatar)'
      },
      _fullName: {
        type: String,
        computed: '_computeFullName(_userProfile.username, _detail.student.username, _detail.tutor.username, _detail.student.fullName, _detail.tutor.fullName)'
      },
      _phoneNumber: {
        type: String,
        computed: '_computePhoneNumber(_userProfile.username, _detail.student.username, _detail.tutor.username, _detail.student.phoneNumber, _detail.tutor.phoneNumber)'
      }
    }
  }

  static get observers() {
    return [
      '_onCancelAjaxRespond(_cancelAjaxLastResponse, _cancelAjaxLastError)'
    ];
  }



  _computeDetail(data) {
    if (!data) {
      return undefined;
    }
    const detail = data;
    detail.startTime = new Date(detail.startTime);
    detail.endTime = new Date(detail.endTime);
    detail.totalFee = Number.parseFloat(detail.totalFee);
    return detail;
  }



  _computeHeader(startTime, endTime) {
    let header = 'Tutorial : ';
    header += `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')} - ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

    return header;
  }

  _computeButtons(username, studentUsername, cancellable) {
    let buttons = [
      {
        text: 'Close',
        style: 'color: dodgerblue;',
        callback: () => this._onCloseButtonClicked()
      }
    ];
    if (username === studentUsername) {
      buttons.unshift({
        text: 'Cancel Booking',
        style: 'color: red;',
        disabled: !cancellable,
        callback: () => this._onCancelBookingButtonClicked()
      });
    }
    return buttons;
  }

  _computeAvatar(username, studentUsername, tutorUsername, studentAvatar, tutorAvatar) {
    if (username === tutorUsername) {
      return studentAvatar;
    } else {
      return tutorAvatar;
    }
  }

  _computeFullName(username, studentUsername, tutorUsername, studentFullName, tutorFullName) {
    if (username === tutorUsername) {
      return studentFullName;
    } else {
      return tutorFullName;
    }
  }

  _computePhoneNumber(username, studentUsername, tutorUsername, studentPhoneNumber, tutorPhoneNumber) {
    if (username === tutorUsername) {
      return studentPhoneNumber;
    } else {
      return tutorPhoneNumber;
    }
  }



  showForResult(...args) {
    return this.show(...args)
    .then(() => new Promise((resolve, reject) => {
      this._resolveDialog = resolve;
      this._rejectDialog = reject;
    }));
  }



  _onCloseButtonClicked() {
    this.hide()
    .then(this._rejectDialog);
  }

  _onCancelBookingButtonClicked() {
    this._showConfirmCancelDialog();
  }



  _showConfirmCancelDialog() {
    let dialog = document.createElement('tutoria-dialog');
    let content;
    if (this._detail.totalFee > 0) {
      content = 'Tutorial fee will be refunded after the cancellation';
    } else {
      content = 'Are you sure to cancel the session?';
    }
    dialog.setProperties({
      header: 'Cancel Booking?',
      content: content,
      buttons: [{
        text: 'Cancel Booking',
        style: 'color: red;',
        callback: d => this._onConfirmCancelButtonClick(d)
      }, {
        text: 'Keep Booking',
        style: 'color: dodgerblue;',
        callback: d => this._onKeepBookingButtonClick(d)
      }]
    });
    dialog.show();
    this.__confirmDialog = dialog;
  }

  _onKeepBookingButtonClick(dialog) {
    dialog.hide();
  }

  _onConfirmCancelButtonClick(dialog) {
    this.$['cancel-ajax'].generateRequest();
  }
  
  
  
  _onCancelAjaxRespond(response, error) {
    const confirmDialog = this.__confirmDialog;
    delete this.__confirmDialog;
    if (error) {
      console.warn('Cannot cancel session', error);
      if (confirmDialog) {
        confirmDialog.hide();
      }
      this.$['detail-ajax'].generateRequest();
      return;
    }
    if (response) {
      let dialogs = [this.hide()];
      if (confirmDialog) dialogs.push(confirmDialog.hide());
      Promise.all(dialogs)
      .then(() => this._showTutorialCancelledDialog())
    }
  }



  _showTutorialCancelledDialog() {
    let dialog = document.createElement('tutoria-dialog');
    dialog.setProperties({
      header: 'Booking Cancelled!',
      buttons: [
        {
          text: 'Close',
          style: 'color: dodgerblue;',
          callback: d => d.hide().then(this._resolveDialog)
        }
      ]
    });
    dialog.show();
  }

}

window.customElements.define('tutoria-tutorial-detail-dialog', TutoriaTutorialDetailDialog);
