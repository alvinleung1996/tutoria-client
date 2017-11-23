import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';

import '../tutoria-api/tutoria-api-ajax.js';
import '../tutoria-styles/tutoria-styles.js';


export const otherTemplate = `
<tutoria-api-ajax>
  <iron-ajax id="get-message-ajax"
    auto
    method="GET"
    url$="[[apiRootPath]]messages/[[message.pk]]"
    handle-as="json"
    last-response="{{_lastGetMessageAjaxResponse}}"
    last-error="{{_lastGetMessageAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<tutoria-api-ajax>
  <iron-ajax id="read-message-ajax"
    auto
    method="PUT"
    url$="[[apiRootPath]]messages/[[message.pk]]"
    content-type="application/json"
    body="[[_readMessageAjaxBody]]"
    handle-as="json"
    last-response="{{_lastReadMessageAjaxResponse}}"
    last-error="{{_lastReadMessageAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>
`;

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>
#meta {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 4px 16px;
}
.label,
.value {
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--secondary_color);
}
#message-content {
  margin-top: 16px;
  @apply --tutoria-text--body2_font;
  color: var(--tutoria-text--primary_color);
}
</style>
`;

export const contentTemplate = `
<div id="meta">

  <span class="label">Time:</span>
  <time class="value">[[_dateToString(_messageDetail.time)]]</time>

  <span class="label">Sender:</span>
  <span class="value">[[_messageDetail.sendUser.fullName]]</span>

  <span class="label">Receiver:</span>
  <span class="value">[[_messageDetail.receiveUser.fullName]]</span>

</div>
<div id="message-content">[[_messageDetail.content]]</div>
`;

export default class TutoriaMessageDetailDialog extends TutoriaDialog {

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
        computed: '_computeHeader(_messageDetail.title)'
      },
      width: {
        type: Number,
        value: '600px'
      },

      message: Object,

      _readMessageAjaxBody: {
        type: Object,
        value: () => ({
          read: true
        })
      },

      _messageDetail: {
        type: Object,
        computed: '_computeMessageDetail(_lastGetMessageAjaxResponse)'
      }

      // _lastGetMessageAjaxResponse: {
      //   observer: '_onLastGetMessageAjaxResponseChanged'
      // },
      // _lastGetMessageAjaxError: {
      //   observer: '_onLastGetMessageAjaxErrorChanged'
      // }
    };
  }

  ready() {
    super.ready();
    this.buttons = [{
      text: 'Close',
      style: 'color: dodgerblue;',
      callback: (d, b) => this._onCloseButtonClick(d, b)
    }]
  }



  _dateToString(value) {
    return value && value.toLocaleString();
  }



  _computeMessageDetail(response) {
    const message = response && response.data;
    message.time = new Date(message.time);
    return message;
  }

  _computeHeader(title) {
    return title;
  }

  _onCloseButtonClick(dialog, button) {
    this.hide()
    .then(() => {
      this.dispatchEvent(new CustomEvent('tutoria-message-detail-dialog-close', {
        detail: {
          dialog: this
        }
      }));
    })
  }

}

window.customElements.define('tutoria-message-detail-dialog', TutoriaMessageDetailDialog);
