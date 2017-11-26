import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';

import '../tutoria-api/tutoria-api-ajax.js';

export const otherTemplate = `
<tutoria-api-ajax>
  <iron-ajax id="create-ajax"
    method="POST"
    url="[[apiRootPath]]tutors/me/unavailable-periods"
    content-type="application/json"
    handle-as="json"
    last-response="{{_lastCreateAjaxResponse}}"
    last-error="{{_lastCreateAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>
`;

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>
#iron-form form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 8px 16px;
}
</style>
`;

export const contentTemplate = `
<iron-form id="iron-form" on-iron-form-presubmit="_onIronFormPresubmit">
  <form>
    <paper-input id="start-date-input" label="start date" name="startDate" required type="date" placeholder="YYYY-MM-DD" on-keypress="_onInputKeyPress"></paper-input>
    <paper-input id="start-time-input" label="start time" name="startTime" required type="time" placeholder="hh:mm" on-keypress="_onInputKeyPress"></paper-input>

    <paper-input id="end-date-input" label="end date" name="endDate" required type="date" placeholder="YYYY-MM-DD" on-keypress="_onInputKeyPress"></paper-input>
    <paper-input id="end-time-input" label="end time" name="endTime" required type="time" placeholder="hh:mm" on-keypress="_onInputKeyPress"></paper-input>
  </form>
</iron-form>
`;

export default class TutoriaAddUnavailablePeriodDialog extends TutoriaDialog {

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
        value: 'Add Unavailable Period'
      },
      width: {
        type: String,
        value: '500px'
      },

      _lastCreateAjaxResponse: {
        observer: '_onLastCreateAjaxResponseChanged'
      },
      _lastCreateAjaxError: {
        observer: '_onLastCreateAjaxErrorChanged'
      }
    }
  }

  ready() {
    super.ready();
    this.buttons = [{
      text: 'Cancel',
      callback: () => this._onCancelButtonClick()
    }, {
      text: 'Create',
      style: 'background-color: DodgerBlue; color: white',
      raised: true,
      callback: () => this._onCreateButtonClick()
    }];
  }



  _onCancelButtonClick(evt) {
    this.hide().then(() => {
      this.dispatchEvent(new CustomEvent('tutoria-add-unavailable-period-dialog-cancel', {
        detail: { dialog: this }
      }));
    });
  }

  _onCreateButtonClick() {
    this.$['iron-form'].submit();
  }

  _onInputKeyPress(evt) {
    if (evt.key === 'Enter') {
      this.$['iron-form'].submit();
    }
  }
  
  _onIronFormPresubmit(evt) {
    evt.preventDefault();
    const ironForm = evt.target;

    let params = ironForm.serializeForm();
    this.$['create-ajax'].body = {
      startTime: new Date(params.startDate+' '+params.startTime).toISOString(),
      endTime: new Date(params.endDate+' '+params.endTime).toISOString()
    };
    this.$['create-ajax'].generateRequest();
  }

  _onLastCreateAjaxErrorChanged(errorResponse) {
    const error = errorResponse.response.error;

    if (!error) {
      return;
    }

    this._updateInput(this.$['start-date-input'], 'startTime', error);
    this._updateInput(this.$['end-date-input'], 'endTime', error);
  }

  _onLastCreateAjaxResponseChanged(response) {
    const data = response && response.data;
    if (!data) {
      return;
    }

    this.hide().then(() => {
      this.dispatchEvent(new CustomEvent('tutoria-add-unavailable-period-dialog-added', {
        detail: { dialog: this }
      }));
    });
  }

  _updateInput(input, propertyName, error) {
    let isError = propertyName in error;
    input.setProperties({
      invalid: isError,
      errorMessage: isError ? error[propertyName] : undefined
    });
  }

}

window.customElements.define('tutoria-add-unavailable-period-dialog', TutoriaAddUnavailablePeriodDialog);
