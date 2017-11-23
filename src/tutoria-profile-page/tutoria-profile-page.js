import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-form/iron-form.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';
import '../../node_modules/@polymer/paper-checkbox/paper-checkbox.js';
import '../../node_modules/@polymer/paper-input/paper-input.js';
import '../../node_modules/@polymer/paper-input/paper-textarea.js';

import '../tutoria-api/tutoria-api-ajax.js';
import '../tutoria-api/tutoria-auth-manager.js';
import '../tutoria-styles/tutoria-styles.js';

export const template = `
<style>
:host {
  display: block;
}

section {
  border-bottom: 1px solid var(--tutoria-divider_color);
}
.section-content {
  box-sizing: border-box;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.section-content > :not(:first-child) {
  margin-top: 16px;
}

header {
  @apply --tutoria-text--title_font;
  color: var(--tutoria-text--primary_color);
}

form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px 16px;
}
.submit-button {
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

#register-tutor-button {
  align-self: flex-start;
}
:host([_show-tutor-input]) #register-tutor-button {
  display: none;
}

:host(:not([_show-tutor-input])) #tutor-iron-form {
  display: none;
}
</style>

<tutoria-auth-manager id="auth-manager"
  user-profile="{{_userProfile}}">
</tutoria-auth-manager>

<tutoria-api-ajax>
  <iron-ajax id="update-user-profile-ajax"
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
    url$="[[apiRootPath]]tutors/me"
    handle-as="json"
    last-response="{{_lastTutorProfileAjaxResponse}}"
    last-error="{{_lastTutorProfileAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<tutoria-api-ajax>
  <iron-ajax id="update-tutor-profile-ajax"
    method="PUT"
    url$="[[apiRootPath]]tutors/me"
    content-type="application/json"
    handle-as="json"
    last-response="{{_lastUpdateTutorProfileAjaxResponse}}"
    last-error="{{_lastUpdateTutorProfileAjaxError}}">
  </iron-ajax>
</tutoria-api-ajax>

<section>
  <div class="section-content">
    <header>Account Profile</header>
    <iron-form id="user-iron-form" on-iron-form-presubmit="_onUserIronFormPresubmit">
      <form>
        <paper-input id="username-input" label="username" name="username" readonly value="[[_userProfile.username]]"></paper-input>
        <paper-input id="password-input" label="password" name="password" type="password" on-keypress="_onUserInputKeyPress"></paper-input>
        <paper-input id="email-input" label="email" name="email" required value="[[_userProfile.email]]" on-keypress="_onUserInputKeyPress"></paper-input>
        <paper-input id="given-name-input" label="given name" name="givenName" required value="[[_userProfile.givenName]]" on-keypress="_onUserInputKeyPress"></paper-input>
        <paper-input id="family-name-input" label="family name" name="familyName" required value="[[_userProfile.familyName]]" on-keypress="_onUserInputKeyPress"></paper-input>
        <paper-input id="phone-number-input" label="phone number" name="phoneNumber" required type="number" value="[[_userProfile.phoneNumber]]" on-keypress="_onUserInputKeyPress"></paper-input>
        
        <paper-button id="update-user-profile-button" class="submit-button" raised on-click="_onUpdateUserProfileButtonClick">Update</paper-button>
      </form>
    </iron-form>
  </div>
</section>

<section>
  <div class="section-content">
    <header>Tutor Profile</header>

    <paper-button id="register-tutor-button" on-click="_onRegisterTutorButtonClick">Register as tutor</paper-button>

    <iron-form id="tutor-iron-form" on-iron-form-presubmit="_onTutorIronFormPresubmit">
      <form>
        <div id="tutor-type-input">
          <label for="tutor-type-input_select">tutor type:</label>
          <select id="tutor-type-input_select" label="tutor type" name="type" required selected="[[_tutorProfile.type]]">
            <option value="contracted">Contracted</option>
            <option value="private">Private</option>
          </select>
        </div>
        <paper-checkbox name="activated" checked="[[_toBoolean(_tutorProfile.activated)]]">Activate tutor profile</paper-checkbox>
        <paper-input id="subject-tags-input" label="subject tags" name="subjectTags" value="[[_arrayToString(_tutorProfile.subjectTags)]]" on-keypress="_onTutorInputKeyPress"></paper-input>
        <paper-input id="university-input" label="university" name="university" required value="[[_tutorProfile.university]]" on-keypress="_onTutorInputKeyPress"></paper-input>
        <paper-input id="course-codes-input" label="course codes" name="courseCodes" required value="[[_arrayToString(_tutorProfile.courseCodes)]]" on-keypress="_onTutorInputKeyPress"></paper-input>
        <paper-input id="hourly-rate-input" label="hourly-rate" name="hourlyRate" required type="number" min="0" step="10" value="[[_toFloat(_tutorProfile.hourlyRate)]]" on-keypress="_onTutorInputKeyPress"></paper-input>
        <paper-textarea id="biography-input" label="biography" name="biography" value="[[_tutorProfile.biography]]" always-float-label></paper-textarea>
        <!-- always float-label to fix bug: label not auto floating when setting value until typing -->

        <paper-button id="update-user-profile-button" class="submit-button" raised on-click="_onUpdateTutorProfileButtonClick">[[_ifElse(_isTutor, 'Update', 'Register')]]</paper-button>
      </form>
    </iron-form>
  </div>

</section>
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

      _tutorProfile: {
        type: Object,
        computed: '_computeTutorProfile(_lastTutorProfileAjaxResponse)'
      },

      _isTutor: {
        type: Boolean,
        computed: '_computeIsTutor(_userProfile.roles.*)',
        observer: '_onIsTutorChanged'
      },
      _showTutorInput: {
        type: Boolean,
        value: false,
        observer: '_onShowTutorInputChanged',
        reflectToAttribute: true
      },


      _lastUpdateUserProfileAjaxResponse: {
        observer: '_onLastUpdateUserProfileAjaxResponseChanged'
      },
      _lastUpdateUserProfileAjaxError: {
        observer: '_onLastUpdateUserProfileAjaxErrorChanged'
      },

      _lastUpdateTutorProfileAjaxResponse: {
        observer: '_onLastUpdateTutorProfileAjaxResponseChanged'
      },
      _lastUpdateTutorProfileAjaxError: {
        observer: '_onLastUpdateTutorProfileAjaxErrorChanged'
      },
    };
  }


  _onVisibleChanged(visible) {
    
  }



  _toBoolean(value) {
    return Boolean(value);
  }

  _arrayToString(value) {
    if (Array.isArray(value)) {
      return value.join(', ');
    } else {
      return undefined;
    }
  }

  _toFloat(value) {
    if (value === undefined || value === null) {
      return undefined;
    }
    try {
      return Number.parseFloat(value);
    } catch (e) {
      return undefined;
    }
  }

  _ifElse(cond, truthy, falsy) {
    return cond ? truthy : falsy;
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
      params[key] = serializeForm[key] || '';
    }

    this.$['update-user-profile-ajax'].body = params;
    this.$['update-user-profile-ajax'].generateRequest();
  }

  _onLastUpdateUserProfileAjaxErrorChanged(errorResponse) {
    const error = errorResponse.response.error;

    if (!error) {
      return;
    }
    
    this._updateInput(this.$['username-input'], 'username', error);
    this._updateInput(this.$['password-input'], 'password', error);
    this._updateInput(this.$['email-input'], 'email', error);
    this._updateInput(this.$['given-name-input'], 'givenName', error);
    this._updateInput(this.$['family-name-input'], 'familyName', error);
    this._updateInput(this.$['phone-number-input'], 'phoneNumber', error);
  }

  _onLastUpdateUserProfileAjaxResponseChanged(response) {
    if (response) {
      this.$['auth-manager'].refreshUserProfile();
    }
  }



  _computeIsTutor(rolesRecord) {
    const roles = rolesRecord.base;
    return Boolean(roles && roles.includes('tutor'));
  }

  _onIsTutorChanged(isTutor) {
    if (isTutor) {
      this._showTutorInput = true;
    }
  }

  _onRegisterTutorButtonClick(evt) {
    this._showTutorInput = true;
  }

  _onShowTutorInputChanged(showTutorInput) {
    if (showTutorInput) {
      this.$['tutor-profile-ajax'].generateRequest();
    }
  }




  _computeTutorProfile(response) {
    return response && response.data;
  }

  _onTutorInputKeyPress(evt) {
    if (evt.key === 'Enter') {
      this.$['tutor-iron-form'].submit();
    }
  }

  _onUpdateTutorProfileButtonClick(evt) {
    this.$['tutor-iron-form'].submit();
  }

  _onTutorIronFormPresubmit(evt) {
    evt.preventDefault();
    const ironForm = evt.target;

    let serializeForm = ironForm.serializeForm();
    let params = {
      activated: false
    };
    for (let key in serializeForm) {
      switch (key) {
        case 'activated':
          params[key] = Boolean(serializeForm[key]);
          break;
        case 'subjectTags':
        case 'courseCodes':
          params[key] = serializeForm[key].split(',')
              .map(s => s.trim())
              .filter(s => Boolean(s));
          break;
        default:
          params[key] = serializeForm[key] || '';
      }
    }

    this.$['update-tutor-profile-ajax'].body = params;
    this.$['update-tutor-profile-ajax'].generateRequest();
  }

  _onLastUpdateTutorProfileAjaxErrorChanged(errorResponse) {
    const error = errorResponse && errorResponse.response && errorResponse.response.error;

    this._updateInput(this.$['subject-tags-input'], 'subjectTags', error);
    this._updateInput(this.$['university-input'], 'university', error);
    this._updateInput(this.$['course-codes-input'], 'courseCodes', error);
    this._updateInput(this.$['hourly-rate-input'], 'hourlyRate', error);
    this._updateInput(this.$['biography-input'], 'biography', error);
  }

  _onLastUpdateTutorProfileAjaxResponseChanged(response) {
    if (response) {
      this.$['auth-manager'].refreshUserProfile();
      this.$['tutor-profile-ajax'].generateRequest();
    }
  }




  _updateInput(input, propertyName, error) {
    let isError = error && propertyName in error;
    input.setProperties({
      invalid: isError,
      errorMessage: isError ? error[propertyName] : undefined
    });
  }

}

window.customElements.define('tutoria-profile-page', TutoriaProfilePage);
