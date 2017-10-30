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

export default class TutoriaTutorialConfirmedDialog extends TutoriaDialog {

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

      okCallback: Function,
      confirmCallback: Function,

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

  

  _onOkButtonClicked() {
    if (this.okCallback) this.okCallback(this);
  }

}

window.customElements.define('tutoria-tutorial-confirmed-dialog', TutoriaTutorialConfirmedDialog);
