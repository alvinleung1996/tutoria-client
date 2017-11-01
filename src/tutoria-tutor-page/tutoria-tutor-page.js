import TutoriaElement from '../tutoria-element/tutoria-element.js';

import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';
import '../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';

import '../tutoria-rating-bar/tutoria-rating-bar.js';
import '../tutoria-styles/tutoria-styles.js';
import '../tutoria-timetable/tutoria-timetable.js';

import './tutoria-review.js';
import './tutoria-tutor-page-time-picker-dialog.js';

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
}

#value-table {
  flex: 1 1 auto;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, min-content 1fr);
  grid-gap: 16px;
}
.label, .value {
  display: flex;
  align-items: center;
  @apply --tutoria-text--subheading_font;
  color: var(--tutoria-text--secondary_color);
  white-space: nowrap;
}
.label {
  justify-content: flex-end;
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

#timeslots {
  margin-top: 16px;
  max-height: 500px;
  height: 1000px;
}

.review {
  margin-top: 16px;
}
</style>

<iron-ajax id="ajax"
  auto
  method="GET"
  url="[[apiRootPath]]tutor/[[pathMatchResult.1]]"
  handle-as="json"
  last-response="{{_ajaxLastResponse}}"
  last-error="{{_ajaxLastError}}">
</iron-ajax>

<section id="info">
  <div id="avatar-div">
    <img id="avatar" src$="[[_ajaxLastResponse.avatarSrc]]">
  </div>
  <div id="value-table">
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
    <div id="price" class="value">$[[_tutor.hourlyRate]]</div>
    <div class="label">Average review score:</div>
    <tutoria-rating-bar id="average-rating" rating="[[_tutor.averageReviewScore]]"></tutoria-rating-bar>
  </div>
</section>

<section id="introduction-section">
  <header id="introduction-header">Introduction</header>
  <article id="introduction-text">[[_tutor.biography]]</article>
</section>

<section id="timeslots-section">
  <header id="timeslots-header">Timeslot</header>
  <tutoria-timetable id="timeslots" on-tutoria-timetable-date-selected="_onTimetableDateSelected" events="[[_tutor.events]]"></tutoria-timetable>
</section>

<section id="reviews-section">
  <header id="header-section">Reviews</header>
  <template is="dom-repeat" items="[[_tutor.reviews]]" as="review">
    <tutoria-review class="review"
      reviewer-avatar-src="[[review.reviewer.avatar]]"
      reviewer-given-name="[[review.student.givenName]]"
      reviewer-family-name="[[review.student.familyName]]"
      rating="[[review.score]]"
      time="[[review.creationDate]]"
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
      pathMatchResult: Object,
      pageTitle: {
        type: String,
        value: 'Tutor Page',
        readOnly: true,
        notify: true
      },

      _tutor: {
        type: Object,
        computed: '_computeTutor(_ajaxLastResponse, _ajaxLastError)'
      }
    };
  }

  _computeTutor(response, error) {
    if ((response && 'error' in response) || error) {
      return {};
    }
    const result = response.data;

    let tutor = {
      username: result.username,
      givenName: result.givenName,
      familyName: result.familyName,
      avatar: result.avatar,
      hourlyRate: Number.parseFloat(result.hourlyRate),
      university: result.university,
      courseCode: result.courseCode,
      subjectTags: result.subjectTags,
      averageReviewScore: result.averageReviewScore,
      biography: result.biography,
      reviews: result.reviews,
      events: []
    };
    for (const entry of result.events) {
      tutor.events.push({
        startDate: new Date(entry.startDate),
        endDate: new Date(entry.endDate)
      });
    }
    for (const review of tutor.reviews) {
      review.creationDate = new Date(review.creationDate);
    }

    return tutor;
  }



  _onTimetableDateSelected(evt) {
    let selectedStartDate = new Date(evt.detail.selectedDate.getTime());
    selectedStartDate.setMinutes(selectedStartDate.getMinutes() < 30 ? 0 : 30);
    selectedStartDate.setSeconds(0);
    selectedStartDate.setMilliseconds(0);
    let selectedEndDate = new Date(selectedStartDate.getTime());
    let timeStep = 30 * 60 * 1000;
    selectedEndDate.setMilliseconds(selectedEndDate.getMilliseconds() + timeStep);

    let dialog = document.createElement('tutoria-tutor-page-time-picker-dialog');
    dialog.setProperties({
      tutor: this._tutor,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      timeStep: timeStep
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
