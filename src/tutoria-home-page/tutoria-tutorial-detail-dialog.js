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

`;

export default class TutoriaTutorialDetailDialog extends TutoriaDialog {

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
        computed: '_computeHeader(startDate, endDate)'
      },

      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },

      cancelBookingCallback: Function,
      closeCallback: Function,
    }
  }

  ready() {
    super.ready();
    this.actions = [
      {
        text: 'Cancel Booking',
        callback: () => this._onCancelBookingButtonClicked()
      },
      {
        text: 'Close',
        callback: () => this._onCloseButtonClicked()
      }
    ];
  }

  _computeHeader(startDate, endDate) {
    return `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')} - ${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  }


  _onCancelBookingButtonClicked() {
    if (this.cancelBookingCallback) this.cancelBookingCallback(this);
  }

  _onCloseButtonClicked() {
    if (this.closeCallback) this.closeCallback(this);
  }

}

window.customElements.define('tutoria-tutorial-detail-dialog', TutoriaTutorialDetailDialog);
