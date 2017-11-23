import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-form/iron-form.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-checkbox/paper-checkbox.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';

import '../tutoria-api/tutoria-api-ajax.js';
import '../tutoria-styles/tutoria-styles.js';

export const template = `
<style>
  :host {
    display: block;
  }

  #cannot-review-section {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #cannot-review-section:not([show]) {
    display: none;
  }
  #cannot-review-text {
    @apply --tutoria-text--title_font;
    color: var(--tutoria-text--primary_color);
  }

  #thank-you-section {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #thank-you-section:not([show]) {
    display: none;
  }
  #thank-you-text {
    @apply --tutoria-text--title_font;
    color: var(--tutoria-text--primary_color);
  }

  #review-card {
    box-sizing: border-box;
    max-width: 800px;
    margin-top: 32px;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--tutoria-background--primary_color);
    @apply --tutoria-shadow--elevation-2;
    border-radius: 4px;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  #review-card:not([show]) {
    display: none;
  }

  header {
    @apply --tutoria-text--title_font;
    color: var(--tutoria-text--primary_color);
  }

  #info {
    margin-top: 16px;
    margin-bottom: 16px;
    border-top: 1px solid var(--tutoria-divider_color);
    border-bottom: 1px solid var(--tutoria-divider_color);
    padding-top: 16px;
    padding-bottom: 16px;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 8px 16px;
  }
  .label,
  .value {
    @apply --tutoria-text--body1_font;
    color: var(--tutoria-text--secondary_color);
  }

  #review-iron-form form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px 16px;
    align-items: center;
  }
  .short-field {
    justify-self: start;
  }
  #submit-review-button {
    grid-column: 1 / -1;
    justify-self: end;
    @apply --tutoria-text--button_font;
    background-color: dodgerblue;
    color: white;
  }
  paper-textarea {
    grid-column: 1 / -1;
  }

  paper-button {
    display: block;
    margin: 0px;
  }
</style>

<tutoria-api-ajax>
  <iron-ajax id="get-tutorial-ajax"
    auto
    method="GET"
    url$="[[apiRootPath]]tutorials/[[pathMatchResult.1]]"
    handle-as="json"
    last-response="{{_lastGetTutorialAjaxResponse}}"
    last-error="{{_lastGetTutorialAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<tutoria-api-ajax>
  <iron-ajax id="submit-review-ajax"
    method="PUT"
    url$="[[apiRootPath]]tutorials/[[pathMatchResult.1]]/review"
    content-type="application/json"
    handle-as="json"
    last-response="{{_lastSubmitReviewAjaxResponse}}"
    last-error="{{_lastSubmitReviewAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<section id="cannot-review-section" show$="[[_showCannotReviewMessage]]">
  <span id="cannot-review-text">Sorry, you cannot review this tutorial 🙇</span>
</section>

<section id="thank-you-section" show$="[[_showThankYouMessage]]">
  <span id="thank-you-text">Thanking for your review 🙇</span>
</section>

<section id="review-card" show$="[[_showReviewForm]]">
  <header>Tutorial Review</header>
  <div id="info">
    <span class="label">Start Time:</span>
    <span class="value">[[_dateToString(_tutorial.startTime)]]</span>
    <span class="label">End Time:</span>
    <span class="value">[[_dateToString(_tutorial.endTime)]]</span>
    <span class="label">Tutor:</span>
    <span class="value">[[_tutorial.tutor.fullName]]</span>
  </div>
  <iron-form id="review-iron-form" on-iron-form-presubmit="_onReviewIronFormPresubmit">
    <form>
      <paper-input id="score-input" class="short-field" label="score" name="score" value="3" required type="number" min="1" max="5" on-keypress="_onReviewInputKeyPress"></paper-input>
      <paper-checkbox id="anonymous-input" class="short-field" name="anonymous">Keep review anonymous</paper-checkbox>
      <paper-textarea id="comment-input" label="comment" name="comment"></paper-textarea>
      
      <paper-button id="submit-review-button" raised on-click="_onSubmitReviewButtonClick">Submit</paper-button>
    </form>
  </iron-form>
</section>
`;

export default class TutoriaTutorialReviewPage extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      pageTitle: {
        type: String,
        value: 'Tutorial Review',
        readOnly: true,
        notify: true
      },

      _tutorial: {
        type: Object,
        computed: '_computeTutorial(_lastGetTutorialAjaxResponse)'
      },

      _showCannotReviewMessage: {
        type: Boolean,
        computed: '_computeShowCannotReviewMessage(_tutorial.reviewable)'
      },
      _showReviewForm: {
        type: Boolean,
        computed: '_computeShowReviewForm(_tutorial.reviewable, _showThankYouMessage)'
      },
      _showThankYouMessage: {
        type: Boolean,
        value: false
      },

      _lastSubmitReviewAjaxResponse: {
        observer: '_onLastSubmitReviewAjaxResponseChanged'
      },
      _lastSubmitReviewAjaxError: {
        observer: '_onLastSubmitReviewAjaxErrorChanged'
      }
    };
  }



  _dateToString(value) {
    return value && value.toLocaleString();
  }


  _computeShowCannotReviewMessage(reviewable) {
    return !reviewable;
  }

  _computeTutorial(response) {
    const tutorial = response && response.data;
    if (!tutorial) {
      return undefined;
    }

    tutorial.startTime = new Date(tutorial.startTime)
    tutorial.endTime = new Date(tutorial.endTime);
    tutorial.totalFee = Number.parseFloat(tutorial.totalFee);

    return tutorial;
  }

  _computeShowReviewForm(reviewable, showThankYouMessage) {
    return reviewable && !showThankYouMessage;
  }



  _onSubmitReviewButtonClick(evt) {
    this.$['review-iron-form'].submit();
  }

  _onReviewIronFormPresubmit(evt) {
    evt.preventDefault();
    const ironForm = evt.target;

    let serializeForm = ironForm.serializeForm();
    let params = {};
    for (let key in serializeForm) {
      switch (key) {
        case 'score':
          try {
            params[key] = Number.parseInt(serializeForm[key]);
          } catch (e) {
            params[key] = serializeForm[key];
          }
          break;
        default:
          params[key] = serializeForm[key] || '';
      }
    }

    this.$['submit-review-ajax'].body = params;
    this.$['submit-review-ajax'].generateRequest();
  }

  _onLastSubmitReviewAjaxErrorChanged(errorResponse) {
    const error = errorResponse && errorResponse.response. errorResponse.response.error;
    if (!error) {
      return;
    }
    
    this._updateInput(this.$['score-input'], 'score', error);
    this._updateInput(this.$['comment-input'], 'comment', error);
  }

  _onLastSubmitReviewAjaxErrorChanged(response) {
    if (!response || !response.data) {
      return;
    }

    alert('success');
  }

  _onLastSubmitReviewAjaxResponseChanged(response) {
    if (!response || !response.data) {
      return;
    }

    this._showThankYouMessage = true;
  }


  _updateInput(input, propertyName, error) {
    let isError = error && propertyName in error;
    input.setProperties({
      invalid: isError,
      errorMessage: isError ? error[propertyName] : undefined
    });
  }

}

window.customElements.define('tutoria-tutorial-review-page', TutoriaTutorialReviewPage);
