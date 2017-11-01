import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-form/iron-form.js';
// import '../../node_modules/@polymer/paper-input/paper-input.js';

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>
#form {
  display: grid;
  justify-content: start;
  grid-template-columns: auto 1fr;
  grid-gap: 8px;
}
.value {
  justify-self: end;
}
</style>
`;

export const contentTemplate = `
<iron-form>
  <form id="form">
    <label>Time</label>
    <div id="period" class="value">[[_period]]</div>
  </form>
</iron-form>
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
      startDate: Date,
      endDate: Date,

      _period: {
        type: String,
        computed: '_computePeriod(startDate, endDate)'
      }
    }
  }

  ready() {
    super.ready();
    this.actions = [
      {
        text: 'OK',
        callback: () => this._onOkButtonClicked()
      }
    ];
  }


  _computePeriod(startDate, endDate) {
    return `${startDate.getDate()}/${endDate.getMonth()} ${startDate.getHours().toString().padStart(2,'0')}:${startDate.getMinutes().toString().padStart(2,'0')} - ${endDate.getHours().toString().padStart(2,'0')}:${endDate.getMinutes().toString().padStart(2,'0')}`;
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

}

window.customElements.define('tutoria-tutor-page-tutorial-confirmed-dialog', TutoriaTutorPageTutorialConfirmedDialog);
