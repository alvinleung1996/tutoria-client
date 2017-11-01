import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-icon/iron-icon.js';

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>
#content {
  display: grid;
  justify-content: start;
  grid-template-columns: auto 1fr;
  grid-gap: 8px;
}
</style>
`;

export const contentTemplate = `
[[content]]
`;

export default class TutoriaHomePageEventDetailDialog extends TutoriaDialog {

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
        computed: '_computeHeader(event)'
      },

      content: {
        type: String,
        computed: '_computeContent(event)'
      },

      event: {
        type: Object
      },

      cancelCallback: Function,
      closeCallback: Function,
    }
  }

  ready() {
    super.ready();
    this.actions = [
      {
        text: 'Cancel Booking',
        callback: () => this._onCancelButtonClicked()
      },
      {
        text: 'Close',
        callback: () => this._onCloseButtonClicked()
      }
    ];
  }

  _computeHeader(event) {
    const startDate = event.startDate;
    const endDate = event.endDate;
    return `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')} - ${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  }

  _computeContent(event) {
    return `Tutorial with ${event.tutor.givenName} ${event.tutor.familyName}`;
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

  _onCancelButtonClicked() {
    let dialog = this._confirmDialog = document.createElement('tutoria-dialog');
    dialog.setProperties({
      header: 'Cancel Booking?',
      // content: '',
      actions: [
        {
          text: 'Keep Booking',
          callback: d => d.hide()
        },
        {
          text: 'Cancel Booking',
          callback: d =>
            this._sendCancelEventRequest().then(

              () => Promise.all([d.hide(), this.hide()])
              .then(() => this._showTutorialConfirmedDialog()),
              
              e => e && console.error(e)
            )
        }
      ]
    });
    dialog.show();
  }

  _sendCancelEventRequest() {
    let ajax = document.createElement('iron-ajax');
    ajax.method = 'DELETE'
    ajax.url = `${window.Tutoria.apiRootPath}event/${this.event.id}`;
    ajax.handleAs = 'json';
    let request = ajax.generateRequest();

    return request.completes.then(r => {
      let response = r.response;
      return 'error' in response ? Promise.reject(response) : Promise.resolve(response);
    }, e => Promise.reject({error: e}));
  }

  _showTutorialConfirmedDialog() {
    let dialog = this._confirmDialog = document.createElement('tutoria-dialog');
    dialog.setProperties({
      header: 'Booking Cancelled!',
      // content: '',
      actions: [
        {
          text: 'Close',
          callback: d => {
            d.hide()
            .then(this._resolveDialog)
          }
        }
      ]
    });
    dialog.show();
  }

}

window.customElements.define('tutoria-home-page-event-detail-dialog', TutoriaHomePageEventDetailDialog);

