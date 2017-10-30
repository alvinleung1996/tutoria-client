import TutoriaDialog, * as TutoriaDialogTemplates from '../tutoria-dialog/tutoria-dialog.js';

import '../../node_modules/@polymer/iron-form/iron-form.js';
// import '../../node_modules/@polymer/paper-input/paper-input.js';

export const contentStyles = `
${TutoriaDialogTemplates.contentStyles}
<style>
#form {
  display: grid;
  justify-content: start;
  grid-template-columns: auto auto;
  grid-gap: 8px;
}
</style>
`;

export const contentTemplate = `
<iron-form>
  <form id="form">
    <label for="start-time-input">Start Time</label>
    <input id="start-time-input" type="time" value="{{_startTimeString::input}}" step="[[_timeStepSecond]]" required></input>
    <label for="end-time-input">End Time</label>
    <input id="end-time-input" type="time" value="{{_endTimeString::input}}" step="[[_timeStepSecond]]" required></input>
  </form>
</iron-form>
`;

export default class TutoriaSelectTutorialTimeDialog extends TutoriaDialog {

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
        value: 'Select Tutorial Session Time'
      },

      startDate: {
        type: Date,
        observer: '_onStartDateChanged'
      },
      endDate: {
        type: Date,
        observer: '_onEndDateChanged'
      },
      timeStep: {
        type: Number, // Second
        value: 30 * 60
      },
      _startTimeString: {
        type: String,
        observer: '_onStartTimeStringChanged'
      },
      _endTimeString: {
        type: String,
        observer: '_onEndTimeStringChanged'
      },
      _timeStepSecond: {
        type: Number,
        computed: '_computeTimeStepSecond(timeStep)'
      },

      okCallback: Function,
      cancelCallback: Function,
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
        text: 'OK',
        callback: () => this._onOkButtonClicked()
      }
    ];
  }

  _onStartDateChanged(date) {
    this._startTimeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  _onEndDateChanged(date) {
    this._endTimeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  _onStartTimeStringChanged(timeString) {
    let matches = timeString.match(/^([\d]{2})\:([\d]{2})/);
    if (matches) {
      let date = new Date(this.startDate.getTime());
      date.setHours(Number.parseInt(matches[1]));
      date.setMinutes(Number.parseInt(matches[2]));
      this.startDate = date;
    }
  }

  _onEndTimeStringChanged(timeString) {
    let matches = timeString.match(/^([\d]{2})\:([\d]{2})/);
    if (matches) {
      let date = new Date(this.endDate.getTime());
      date.setHours(Number.parseInt(matches[1]));
      date.setMinutes(Number.parseInt(matches[2]));
      this.endDate = date;
    }
  }

  _computeTimeStepSecond(timeStep) {
    return Math.floor(timeStep / 1000);
  }


  _onCancelButtonClicked() {
    if (this.cancelCallback) this.cancelCallback(this);
  }

  _onOkButtonClicked() {
    if (this.okCallback) this.okCallback(this);
  }

}

window.customElements.define('tutoria-select-tutorial-time-dialog', TutoriaSelectTutorialTimeDialog);
