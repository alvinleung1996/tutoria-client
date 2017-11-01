import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';

import '../../node_modules/@polymer/iron-form/iron-form.js';
// import '../../node_modules/@polymer/paper-input/paper-input.js';

import './tutoria-tutor-page-tutorial-confirmed-dialog.js';

export const ajaxTemplate = `
<iron-ajax id="ajax"
  auto
  method="GET"
  url="[[apiRootPath]]tutor/[[tutor.username]]/tutorial-session-fee"
  params="[[_ajaxParams]]"
  handle-as="json"
  last-response="{{_ajaxLastResponse}}"
  last-error="{{_ajaxLastError}}">
</iron-ajax>
`;

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
    <div id="period" class="value">[[_computePeriod(startDate, endDate)]]</div>
  </form>
</iron-form>
`;

export default class TutoriaTutorialBillDialog extends TutoriaDialog {

  static get template() {
    return ajaxTemplate + TutoriaDialog.generateTemplate({
      contentStyles: contentStyles,
      contentTemplate: contentTemplate
    });
  }

  static get properties() {
    return {
      header: {
        type: String,
        value: 'Confirm Booking'
      },
      tutor: Object,
      startDate: Date,
      endDate: Date,

      okCallback: Function,

      _ajaxParams: {
        type: String,
        computed: '_computeAjaxParams(tutor.*, startDate, endDate)'
      }
    }
  }

  ready() {
    super.ready();
    this.actions = [
      {
        text: 'Cancel',
        callback: () => this._onCancelButtonClicked()
      },
      {
        text: 'Confirm',
        callback: () => this._onConfirmButtonClicked()
      }
    ];
  }

  _computeAjaxParams(tutorChangeRecord, startDate, endDate) {
    const tutor = tutorChangeRecord && tutorChangeRecord.base;
    if (!tutor || !startDate || !endDate) {
      return '';
    }
    return {
      'start-date': startDate.toISOString(),
      'end-date': endDate.toISOString()
    };
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

  _onCancelButtonClicked() {
    this.hide()
    .then(this._rejectDialog);
  }

  _onConfirmButtonClicked() {
    let ajax = document.createElement('iron-ajax');
    ajax.method = 'PUT'
    ajax.url = `${this.apiRootPath}tutor/${this.tutor.username}/tutorials`;
    ajax.contentType = 'application/json'
    ajax.body = {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString()
    };
    ajax.handleAs = 'json';
    let request = ajax.generateRequest();

    request.completes.then(request => {
      let response = request.response;
      return 'error' in response ? Promise.reject(response) : Promise.resolve(response);
    })
    .then(response => {
      return this.hide()
      .then(() => {
        this._showTutorialConfirmedDialog(response);
      });
    }, e => {
      console.warn(e);
    });
  }

  _showTutorialConfirmedDialog(response) {
    let dialog = document.createElement('tutoria-tutor-page-tutorial-confirmed-dialog');
    dialog.setProperties({
      tutor: this.tutor,
      startDate: this.startDate,
      endDate: this.endDate
    });
    dialog.showForResult()
    .then(this._resolveDialog, this._rejectDialog);
  }



}

window.customElements.define('tutoria-tutor-page-tutorial-bill-dialog', TutoriaTutorialBillDialog);
