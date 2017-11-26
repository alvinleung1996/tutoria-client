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
.span {
  grid-column: 1 / -1;
}
.form-message {
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--secondary_color);
}

paper-button {
  display: block;
  margin: 0px;
}

.select-input-label {
  @apply --tutoria-text--menu_font;
  color: var(--tutoria-text--secondary_color);
}
.select-input {
  @apply --tutoria-text--menu_font;
  color: var(--tutoria-text--primary_color);
}

#register-student-button,
#register-tutor-button {
  align-self: flex-start;
  color: dodgerblue;
}
:host([_show-student-input]) #register-student-button,
:host([_show-tutor-input]) #register-tutor-button {
  display: none;
}

:host(:not([_show-student-input])) #student-iron-form,
:host(:not([_show-tutor-input])) #tutor-iron-form {
  display: none;
}

#update-student-profile-button[disabled] {
  background-color: transparent;
  color: var(--tutoria-text--disabled_color);
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
  <iron-ajax id="student-profile-ajax"
    method="GET"
    url$="[[apiRootPath]]students/me"
    handle-as="json"
    last-response="{{_lastStudentProfileAjaxResponse}}"
    last-error="{{_lastStudentProfileAjaxError}}">
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
  <iron-ajax id="update-student-profile-ajax"
    method="PUT"
    url$="[[apiRootPath]]students/me"
    content-type="application/json"
    handle-as="json"
    last-response="{{_lastUpdateStudentProfileAjaxResponse}}"
    last-error="{{_lastUpdateStudentProfileAjaxError}}">
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
        <paper-input id="phone-number-input" label="phone number" name="phoneNumber" required type="tel" value="[[_userProfile.phoneNumber]]" on-keypress="_onUserInputKeyPress"></paper-input>
        
        <paper-button id="update-user-profile-button" class="submit-button" raised on-click="_onUpdateUserProfileButtonClick">Update</paper-button>
      </form>
    </iron-form>
  </div>
</section>

<section>
  <div class="section-content">
    <header>Student Profile</header>

    <paper-button id="register-student-button" on-click="_onRegisterStudentButtonClick">Register as Student</paper-button>

    <iron-form id="student-iron-form" on-iron-form-presubmit="_onStudentIronFormPresubmit">
      <form>
        <p class="form-message span">No additional information</p>
        <paper-button id="update-student-profile-button" class="submit-button" on-click="_onUpdateStudentProfileButtonClick" raised="[[!_isIncludes(_userProfile.roles.*, 'student')]]" disabled="[[_isIncludes(_userProfile.roles.*, 'student')]]">[[_ifIncludesThen(_userProfile.roles.*, 'student', 'Update', 'Register')]]</paper-button>
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
        <div id="tutor-type-input" class="select-input-layout">
          <label class="select-input-label" for="tutor-type-input_select">tutor type:</label>
          <select id="tutor-type-input_select" class="select-input" label="tutor type" name="type" required>
            <option value="contracted" selected$="[[_isEquals(_tutorProfile.type, 'contracted')]]">Contracted</option>
            <option value="private" selected$="[[_isEquals(_tutorProfile.type, 'private')]]">Private</option>
          </select>
        </div>
        <paper-checkbox id="activated-input" name="activated" checked="[[_toBoolean(_tutorProfile.activated)]]">Activate tutor profile</paper-checkbox>
        <paper-input id="subject-tags-input" label="subject tags" name="subjectTags" value="[[_arrayToString(_tutorProfile.subjectTags)]]" on-keypress="_onTutorInputKeyPress"></paper-input>
        <paper-input id="university-input" label="university" name="university" required value="[[_tutorProfile.university]]" on-keypress="_onTutorInputKeyPress"></paper-input>
        <paper-input id="course-codes-input" label="course codes" name="courseCodes" value="[[_arrayToString(_tutorProfile.courseCodes)]]" on-keypress="_onTutorInputKeyPress"></paper-input>
        <paper-input id="hourly-rate-input" label="hourly rate" name="hourlyRate" required type="number" min="0" step="10" value="[[_toString(_tutorProfile.hourlyRate)]]" on-keypress="_onTutorInputKeyPress"></paper-input>
        <paper-textarea id="biography-input" class="span" label="biography" name="biography" value="[[_tutorProfile.biography]]" always-float-label></paper-textarea>
        <!-- always float-label to fix bug: label not auto floating when setting value until typing -->

        <paper-button id="update-tutor-profile-button" class="submit-button" raised on-click="_onUpdateTutorProfileButtonClick">[[_ifIncludesThen(_userProfile.roles.*, 'tutor', 'Update', 'Register')]]</paper-button>
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
      },

      pageTitle: {
        type: String,
        value: 'Profile',
        readOnly: true,
        notify: true
      },
      
      _showStudentInput: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      _showTutorInput: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      _studentProfile: {
        type: Object
      },
      _tutorProfile: {
        type: Object
      },

      _lastUpdateUserProfileAjaxResponse: {
        observer: '_onLastUpdateUserProfileAjaxResponseChanged'
      },
      _lastUpdateUserProfileAjaxError: {
        observer: '_onLastUpdateUserProfileAjaxErrorChanged'
      },

      _lastStudentProfileAjaxResponse: {
        observer: '_onLastStudentProfileAjaxResponse'
      },
      _lastTutorProfileAjaxResponse: {
        observer: '_onLastTutorProfileAjaxResponse'
      },

      _lastUpdateStudentProfileAjaxResponse: {
        observer: '_onLastUpdateStudentProfileAjaxResponseChanged'
      },
      _lastUpdateStudentProfileAjaxError: {
        observer: '_onLastUpdateStudentProfileAjaxErrorChanged'
      },

      _lastUpdateTutorProfileAjaxResponse: {
        observer: '_onLastUpdateTutorProfileAjaxResponseChanged'
      },
      _lastUpdateTutorProfileAjaxError: {
        observer: '_onLastUpdateTutorProfileAjaxErrorChanged'
      },
    };
  }

  static get observers() {
    return [
      '_onUserProfileChanged(_userProfile.*, visible)',
    ];
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

  _toString(value) {
    return (value !== undefined && value != null) ? value.toString() : undefined;
  }

  _isIncludes(record, value) {
    return record && Array.isArray(record.base) && record.base.includes(value);
  }

  _ifIncludesThen(record, value, truthy, falsy) {
    return (record && Array.isArray(record.base) && record.base.includes(value)) ? truthy : falsy;
  }

  _isEquals(a, b) {
    return a === b;
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
      switch (key) {
        case 'password':
          if (serializeForm[key]) params[key] = serializeForm[key];
          break;
        default:
          params[key] = serializeForm[key] || '';
      }
    }

    this.$['update-user-profile-ajax'].body = params;
    this.$['update-user-profile-ajax'].generateRequest();
  }

  _onLastUpdateUserProfileAjaxErrorChanged(errorResponse) {
    const error = errorResponse && errorResponse.response && errorResponse.response.error;

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
  
  
  
  _onUserProfileChanged(profileRecord, visible) {
    const profile = profileRecord && profileRecord.base;
    if (profile && visible) {

      if (profile.roles.includes('student')) {
        this._showStudentInput = true;
        this.$['student-profile-ajax'].generateRequest();
      } else {
        this._showStudentInput = false;
        this._studentProfile = undefined;
      }

      if (profile.roles.includes('tutor')) {
        this._showTutorInput = true;
        this.$['tutor-profile-ajax'].generateRequest();
      } else {
        this._showTutorInput = false;
        this._tutorProfile = undefined;
      }
      
    } else {
      this._showStudentInput = false;
      this._showTutorInput = false;
      this._studentProfile = undefined;
      this._tutorProfile = undefined;
    }
  }



  _onLastStudentProfileAjaxResponse(response) {
    this._studentProfile = response && response.data;
  }

  _onLastTutorProfileAjaxResponse(response) {
    let tutor = response && response.data;
    if (tutor) {
      tutor.hourlyRate = Number.parseFloat(tutor.hourlyRate);
    }
    this._tutorProfile = tutor;
  }



  _onRegisterStudentButtonClick(evt) {
    this._showStudentInput = true;
  }

  _onStudentInputKeyPress(evt) {
    if (evt.key === 'Enter') {
      this.$['student-iron-form'].submit();
    }
  }

  _onUpdateStudentProfileButtonClick(evt) {
    this.$['student-iron-form'].submit();
  }

  _onStudentIronFormPresubmit(evt) {
    evt.preventDefault();
    const ironForm = evt.target;

    let serializeForm = ironForm.serializeForm();
    let params = {};
    for (let key in serializeForm) {
      switch (key) {
        default:
          params[key] = serializeForm[key] || '';
      }
    }

    this.$['update-student-profile-ajax'].body = params;
    this.$['update-student-profile-ajax'].generateRequest();
  }

  _onLastUpdateStudentProfileAjaxErrorChanged(errorResponse) {
    const error = errorResponse && errorResponse.response && errorResponse.response.error;
  }

  _onLastUpdateStudentProfileAjaxResponseChanged(response) {
    if (response) {
      this.$['auth-manager'].refreshUserProfile();
    }
  }



  _onRegisterTutorButtonClick(evt) {
    this._showTutorInput = true;
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
          params[key] = typeof serializeForm[key] !== 'string' ? [] :
              serializeForm[key].split(',')
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
