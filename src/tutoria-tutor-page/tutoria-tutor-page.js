import TutoriaElement from '../tutoria-element/tutoria-element.js';

import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';
import '../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';

import '../tutoria-rating-bar/tutoria-rating-bar.js';
import '../tutoria-styles/tutoria-styles.js';
import '../tutoria-timetable/tutoria-timetable.js';

import './tutoria-review.js';
import './tutoria-select-tutorial-time-dialog.js';
import './tutoria-tutorial-bill-dialog.js';
import './tutoria-tutorial-confirmed-dialog.js';

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
  last-response="{{_tutorResponse}}"
  last-error="{{_tutorError}}">
</iron-ajax>

<iron-ajax id="ajax"
  auto
  method="GET"
  url="[[apiRootPath]]tutor/[[pathMatchResult.1]]/reviews"
  handle-as="json"
  last-response="{{_reviewsResponse}}"
  last-error="{{_reviewsError}}">
</iron-ajax>

<section id="info">
  <div id="avatar-div">
    <img id="avatar" src$="[[_tutorResponse.avatarSrc]]">
  </div>
  <div id="value-table">
    <div id="full-name" class="value span">[[_tutorResponse.givenName]] [[_tutorResponse.familyName]]</div>
    <div class="label">University:</div>
    <div id="university" class="value">[[_tutorResponse.university]]</div>
    <div class="label">Course Code:</div>
    <div id="course-code" class="value">[[_tutorResponse.courseCode]]</div>
    <div class="label">Subject Tags:</div>
    <div id="subject-tags" class="value">
      <template is="dom-repeat" items="[[_tutorResponse.subjectTags]]" as="subjectTag">
        <div class="subject-tag">[[subjectTag]]</div>
      </template>
    </div>
    <div class="label">Price:</div>
    <div id="price" class="value">$[[_tutorResponse.price]]</div>
    <div class="label">Average rating:</div>
    <tutoria-rating-bar id="average-rating" rating="[[_tutorResponse.averageRating]]"></tutoria-rating-bar>
  </div>
</section>

<section id="introduction-section">
  <header id="introduction-header">Introduction</header>
  <article id="introduction-text">[[_tutorResponse.introduction]]</article>
</section>

<section id="timeslots-section">
  <header id="timeslots-header">Timeslot</header>
  <tutoria-timetable id="timeslots" on-tutoria-timetable-date-selected="_onTimetableDateSelected"></tutoria-timetable>
</section>

<section id="reviews-section">
  <header id="header-section">Reviews</header>
  <template is="dom-repeat" items="[[_reviewsResponse]]" as="review">
    <tutoria-review class="review"
      reviewer-avatar-src="[[review.reviewer.avatarSrc]]"
      reviewer-given-name="[[review.reviewer.givenName]]"
      reviewer-family-name="[[review.reviewer.familyName]]"
      rating="[[review.rating]]"
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
      pathMatchResult: Object,
      pageTitle: {
        type: String,
        value: 'Tutor Page',
        readOnly: true,
        notify: true
      }
    };
  }

  _onTimetableDateSelected(evt) {
    let selectedStartDate = new Date(evt.detail.selectedDate.getTime());
    selectedStartDate.setMinutes(selectedStartDate.getMinutes() < 30 ? 0 : 30);
    selectedStartDate.setSeconds(0);
    selectedStartDate.setMilliseconds(0);
    let selectedEndDate = new Date(selectedStartDate.getTime());
    let timeStep = 30 * 60 * 1000;
    selectedEndDate.setMilliseconds(selectedEndDate.getMilliseconds() + timeStep);

    let dialog = document.createElement('tutoria-select-tutorial-time-dialog');
    dialog.startDate = selectedStartDate;
    dialog.endDate = selectedEndDate;
    dialog.timeStep = timeStep;

    dialog.show();
    dialog.cancelCallback = d => {
      d.hide();
    }
    dialog.okCallback = d => {
      d.hide().then(() => {
        this._onTutorialTimeSelected(d.startDate, d.endDate);
      });
    };
  }

  _onTutorialTimeSelected(startDate, endDate) {
    let dialog = document.createElement('tutoria-tutorial-bill-dialog');
    dialog.startDate = startDate;
    dialog.endDate = endDate;

    dialog.show();
    dialog.cancelCallback = d => {
      d.hide();
    }
    dialog.confirmCallback = d => {
      d.hide()
      .then(() => this._onTutorialConfirmed(startDate, endDate));
    };
  }

  _onTutorialConfirmed(startDate, endDate) {
    let dialog = document.createElement('tutoria-tutorial-confirmed-dialog');
    dialog.startDate = startDate;
    dialog.endDate = endDate;

    dialog.show();
    dialog.okCallback = d => {
      d.hide();
    };
  }

}

window.customElements.define('tutoria-tutor-page', TutoriaTutorPage);
