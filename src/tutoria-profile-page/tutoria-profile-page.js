import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-form/iron-form.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';

import '../tutoria-api/tutoria-api-ajax.js';

export const template = `
<style>

</style>

<tutoria-api-ajax>
  <iron-ajax id="user-profile-ajax"
    method="GET"
    url$="[[apiRootPath]]users/me"
    handle-as="json"
    last-response="{{_lastUserProfileAjaxResponse}}"
    last-error="{{_lastUserProfileAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<tutoria-api-ajax>
  <iron-ajax id="update-user-ajax"
    method="PUT"
    url$="[[apiRootPath]]users/me"
    content-type="application/json"
    handle-as="json"
    last-response="{{_lastUpdateUserProfileAjaxResponse}}"
    last-error="{{_lastUpdateUserProfileAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<tutoria-api-ajax>
  <iron-ajax id="tutor-profile-ajax"
    method="GET"
    url$="[[apiRootPath]]users/me"
    handle-as="json"
    last-response="{{_lastTutorProfileAjaxResponse}}"
    last-error="{{_lastTutorProfileAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<tutoria-api-ajax>
  <iron-ajax id="update-tutor-profile-ajax"
    method="PUT"
    url$="[[apiRootPath]]tutor/me"
    content-type="application/json"
    handle-as="json"
    last-response="{{_lastUpdateTutorProfileAjaxResponse}}"
    last-error="{{_lastUpdateTutorProfileAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<iron-form id="user-iron-form" on-iron-form-presubmit="_onUserIronFormPresubmit">
  <form>
    <paper-input id="username-input" label="username" name="username" required value="[[_userProfile.username]]" on-keypress="_onUserInputKeyPress"></paper-input>
    <paper-input id="password-input" label="password" name="password" type="password" on-keypress="_onUserInputKeyPress"></paper-input>
    <paper-input id="email-input" label="email" name="email" required value="[[_userProfile.email]]" on-keypress="_onUserInputKeyPress"></paper-input>
    <paper-input id="given-name-input" label="given name" name="givenName" required value="[[_userProfile.givenName]]" on-keypress="_onUserInputKeyPress"></paper-input>
    <paper-input id="family-name-input" label="family name" name="familyName" required value="[[_userProfile.familyName]]" on-keypress="_onUserInputKeyPress"></paper-input>
    <paper-input id="phone-number-input" label="phone number" name="phoneNumber" required type="number" value="[[_userProfile.phoneNumber]]" on-keypress="_onUserInputKeyPress"></paper-input>
  </form>
</iron-form>

<paper-button id="update-user-profile-button" on-click="_onUpdateUserProfileButtonClick">Update</paper-button>
`;

export default class TutoriaProfilePage extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      visible: {
        type: Boolean,
        observer: '_onVisibleChanged'
      },

      _userProfile: {
        type: Object,
        computed: '_computeUserProfile(_lastUserProfileAjaxResponse)'
      },

      _lastUpdateUserProfileAjaxError: {
        observer: '_onLastUpdateUserProfileAjaxErrorChanged'
      }
    };
  }


  _onVisibleChanged(visible) {
    this.$['user-profile-ajax'].generateRequest();
  }



  _computeUserProfile(response) {
    return response.data;
  }

  _onUserInputKeyPress(evt) {
    if (evt.key === 'Enter') {
      this.$['user-iron-form'].submit();
    }
  }

  _onUpdateUserProfileButtonClick(evt) {
    this.$['user-iron-form'].submit();
  }

  _onUserIronFormPresubmit(evt) {
    evt.preventDefault();
    const ironForm = evt.target;

    let serializeForm = ironForm.serializeForm();
    let params = {};
    for (let key in serializeForm) {
      if (serializeForm[key]) {
        params[key] = serializeForm[key];
      }
    }

    this.$['update-user-ajax'].body = params;
    this.$['update-user-ajax'].generateRequest();
  }

  _onLastUpdateUserProfileAjaxErrorChanged(errorResponse) {
    const error = errorResponse.response.error;

    if (!error) {
      return;
    }
    // TODO more error type e.g. username not available
    this._updateInput(this.$['username-input'], 'username', error);
    this._updateInput(this.$['password-input'], 'password', error);
    this._updateInput(this.$['email-input'], 'email', error);
    this._updateInput(this.$['given-name-input'], 'givenName', error);
    this._updateInput(this.$['family-name-input'], 'familyName', error);
    this._updateInput(this.$['phone-number-input'], 'phoneNumber', error);
  }

  _updateInput(input, propertyName, error) {
    let isError = propertyName in error;
    input.setProperties({
      invalid: isError,
      errorMessage: isError ? error[propertyName] : undefined
    });
  }

}

window.customElements.define('tutoria-profile-page', TutoriaProfilePage);
