import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';
import '../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-icon/iron-icon.js';
import '../../node_modules/@polymer/iron-image/iron-image.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';

import '../tutoria-api/tutoria-api-ajax.js';
import '../tutoria-icons/tutoria-icons.js';
import '../tutoria-rating-bar/tutoria-rating-bar.js';
import '../tutoria-styles/tutoria-styles.js';
import '../tutoria-timetable/tutoria-timetable.js';

import './tutoria-review.js';
import './tutoria-tutor-page-tutorial-bill-dialog.js';

export const template = `
<style>
:host {
  display: block;
}

section {
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
  box-sizing: border-box;
  padding: 16px;
}
section:not(:first-of-type) {
  border-top: var(--tutoria-divider_color) 1px solid;
}
header {
  @apply --tutoria-text--title_font;
  color: var(--tutoria-text--primary_color);
}
article, .content {
  margin-top: 16px;
}
article {
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--secondary_color);
}

#info {
  display: flex;
}

#avatar-div {
  flex: 0 0 auto;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#avatar {
  width: 128px;
  height: 128px;
  border-radius: 50%;
}

#fields-table {
  flex: 1 1 auto;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, auto 1fr);
  grid-gap: 16px;
}
.label,
.value {
  display: flex;
  align-items: center;
  @apply --tutoria-text--subheading_font;
  color: var(--tutoria-text--secondary_color);
  white-space: nowrap;
}
.value.span {
  grid-column: 1 / -1;
}

#full-name {
  @apply --tutoria-text--headline_font;
  color: var(--tutoria-text--primary_color);
}
#subject-tags {
  display: flex;
  align-items: center;
}
.subject-tag {
  border: green 1px solid;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 16px;
}

.info-button {
  margin: 0px;
  grid-column-end: span 2;
  justify-self: start;
  @apply --tutoria-text--button_font;
  color: var(--tutoria-text--secondary_color);
}
.info-button .icon {
  margin-right: 8px;
  color: var(--tutoria-accent_color);
}
#message-button {
  grid-column-start: 1;
}
#phone-number-button:not([show]) {
  display: none;
}

#timetable {
  margin-top: 16px;
  height: 500px;
}

.review {
  margin-top: 16px;
}
</style>

<tutoria-api-ajax>
  <iron-ajax id="ajax"
    method="GET"
    url="[[apiRootPath]]tutors/[[pathMatchResult.1]]"
    handle-as="json"
    last-response="{{_ajaxLastResponse}}"
    last-error="{{_ajaxLastError}}">
  </iron-ajax>
</tutoria-api-ajax>

<section id="info">
  <div id="avatar-div">
    <iron-image id="avatar" src="[[_tutor.avatar]]" sizing="contain" preload fade></iron-image>
  </div>
  <div id="fields-table">

    <div id="full-name" class="value span">[[_tutor.givenName]] [[_tutor.familyName]]</div>

    <div class="label">University:</div>
    <div id="university" class="value">[[_tutor.university]]</div>

    <div class="label">Course Code:</div>
    <div id="course-code" class="value">[[_tutor.courseCode]]</div>
    
    <div class="label">Subject Tags:</div>
    <div id="subject-tags" class="value">
      <template is="dom-repeat" items="[[_tutor.subjectTags]]" as="subjectTag">
        <div class="subject-tag">[[subjectTag]]</div>
      </template>
    </div>

    <div class="label">Hourly Rate:</div>
    <div id="price" class="value">$ [[_tutor.hourlyRate]]</div>

    <div class="label">Average review score:</div>
    <tutoria-rating-bar id="average-rating" rating="[[_tutor.averageReviewScore]]"></tutoria-rating-bar>

    <paper-button id="message-button" class="info-button"><iron-icon class="icon" icon="tutoria:message"></iron-icon>Send Message</paper-button>

    <paper-button id="phone-number-button" class="info-button" show$="[[_computeShowPhoneNumber(_tutor.phoneNumber)]]"><iron-icon class="icon" icon="tutoria:phone"></iron-icon>[[_tutor.phoneNumber]]</paper-button>

  </div>
</section>

<section id="introduction-section">
  <header id="introduction-header">Introduction</header>
  <article id="introduction-text">[[_tutor.biography]]</article>
</section>

<section id="timetable-section">
  <header id="timetable-header">Timeslot</header>
  <tutoria-timetable id="timetable" on-tutoria-timetable-time-selected="_onTimetableTimeSelected" events="[[_tutor.events]]"></tutoria-timetable>
</section>

<section id="reviews-section">
  <header id="header-section">Reviews</header>
  <template is="dom-repeat" items="[[_tutor.reviews]]" as="review">
    <tutoria-review class="review"
      avatar="[[review.student.avatar]]"
      full-name="[[review.student.fullName]]"
      score="[[review.score]]"
      time="[[review.time]]"
      comment="[[review.comment]]">
    </tutoria-review>
  </template>
</section>
`;

export default class TutoriaTutorPage extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      visible: Boolean,
      pathMatchResult: Object,
      pageTitle: {
        type: String,
        value: 'Tutor Page',
        readOnly: true,
        notify: true
      },

      _tutor: {
        type: Object,
        computed: '_computeTutor(_ajaxLastResponse)'
      }
    };
  }

  static get observers() {
    return [
      '_onTutorProfileUpdated(visible, pathMatchResult.1)'
    ];
  }

  _onTutorProfileUpdated(visible, tutorUsername) {
    if (visible && tutorUsername) {
      this.$.ajax.generateRequest();
    }
  }


  _computeTutor(response) {
    if (!response) {
      return {};
    }
    
    let tutor = response.data;

    tutor.hourlyRate = Number.parseFloat(tutor.hourlyRate);
    
    if (tutor.events) {
      tutor.events.forEach(event => {
        event.startTime = new Date(event.startTime);
        event.endTime = new Date(event.endTime);
      });
    }

    if (tutor.reviews) {
      tutor.events.forEach(review => {
        review.time = new Date(review.time);
      });
    }

    return tutor;
  }

  _computeShowPhoneNumber(phoneNumber) {
    return Boolean(phoneNumber);
  }



  _onTimetableTimeSelected(evt) {
    const tutor = this._tutor;
    let selectedStartTime = new Date(evt.detail.selectedTime.getTime());
    if (tutor.type === 'contracted') {
      selectedStartTime.setMinutes(selectedStartTime.getMinutes() < 30 ? 0 : 30);
    } else {
      selectedStartTime.setMinutes(0);
    }
    selectedStartTime.setSeconds(0);
    selectedStartTime.setMilliseconds(0);

    let selectedEndTime = new Date(selectedStartTime.getTime());
    if (tutor.type === 'contracted') {
      selectedEndTime.setMinutes(selectedEndTime.getMinutes() + 30);
    } else {
      selectedEndTime.setMinutes(selectedEndTime.getMinutes() + 60);
    }

    let dialog = document.createElement('tutoria-tutor-page-tutorial-bill-dialog');
    dialog.setProperties({
      tutor: tutor,
      startTime: selectedStartTime,
      endTime: selectedEndTime
    });

    dialog.showForResult()
    .then(() => {
      this.$.ajax.generateRequest();
    }, e => {
      console.info('Booking aborted');
      e && console.error(e);
    });
  }

}

window.customElements.define('tutoria-tutor-page', TutoriaTutorPage);
