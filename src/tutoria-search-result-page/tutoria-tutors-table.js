import TutoriaElement from '../tutoria-element/tutoria-element.js';

import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';
import '../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

import '../tutoria-rating-bar/tutoria-rating-bar.js';
import '../tutoria-styles/tutoria-styles.js';

const template = `
<style>
:host {
  display: block;
  overflow-y: auto;
  @apply --tutoria-shadow--elevation-2;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th {
  text-align: left; /* Edge does not support start */
}
th, td {
  white-space: nowrap;
}
th:nth-child(1), td:nth-child(1) {
  padding-left: 24px;
  padding-right: 24px;
}
th:nth-child(7), td:nth-child(7) {
  padding-right: 24px;
}
th:nth-child(n+3), td:nth-child(n+3) {
  padding-left: 32px;
}
#price-header, .hourly-rate {
  text-align: right;
}
#full-name-column {
  width: 100%;
}
thead {
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--secondary_color);
}
thead > tr {
  height: 56px;
}
tbody {
  @apply --tutoria-text--body2_font;
  color: var(--tutoria-text--primary_color);
}
tbody > tr {
  height: 48px;
  border-top: var(--tutoria-divider_color) 1px solid;
  transition: background-color 200ms ease-out;
}
tbody > tr:hover {
  background-color: rgba(var(--tutoria-text--base_color_r),
                         var(--tutoria-text--base_color_g),
                         var(--tutoria-text--base_color_b),
                         0.1);
  cursor: pointer;
}

#header {
  @apply --tutoria-text--title_font;
}
.avatar {
  display: block;
  width: 40px;
}

.average-review-cell[show-score] .average-review-score-na {
  display: none;
}
.average-review-cell:not([show-score]) .average-review-bar {
  display: none;
}
</style>

<table>
  <colgroup>
    <col id="avatar-column">
    <col id="full-name-column">
    <col id="university-column">
    <col id="course-code-column">
    <col id="subject-tags-column">
    <col id="price-column">
    <col id="average-rating-column">
  </colgroup>
  <thead>
    <tr>
      <th colspan="7" id="header">[[header]]</th>
    </tr>
    <tr>
      <th id="avatar-header" scope="col"></th>
      <th id="full-name-header" scope="col">Name</th>
      <th id="university-header" scope="col">University</th>
      <th id="course-code-header" scope="col">Course Code</th>
      <th id="subject-tags-header" scope="col">Subject Tags</th>
      <th id="price-header" scope="col">Price</th>
      <th id="average-rating-header" scope="col">Average Rating</th>
    </tr>
  </thead>
  <tbody>
    <template is="dom-repeat" items="[[items]]" as="tutor" sort="[[_itemSorter]]">
      <tr on-click="_onTutorRowClicked">
        <td class="avatar-cell">
          <img class="avatar" src$="[[tutor.avatarSrc]]">
        </td>
        <td class="full-name-cell">[[tutor.givenName]] [[tutor.familyName]]</td>
        <td class="university-cell">[[tutor.university]]</td>
        <td class="course-code-cell">[[tutor.courseCode]]</td>
        <td class="subject-tags-cell">
          <template is="dom-repeat" items="[[tutor.subjectTags]]" as="subjectTag">
            <span class="subject-tag">[[subjectTag]]</span>
          </template>
        </td>
        <td class="hourly-rate">$[[tutor.hourlyRate]]</td>
        <td class="average-review-cell" show-score$="[[_computeShowAverageScore(tutor.averageReviewScore)]]">
          <span class="average-review-score-na">N/A</span>
          <tutoria-rating-bar class="average-review-bar" rating="[[tutor.averageReviewScore]]"></tutoria-rating-bar>
        </td>
      </tr>
    </template>
  </tbody>
</table>
`;

export default class TutorsTable extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      header: String,
      items: {
        type: Array
      },
      sortBy: {
        type: String,
        value: 'name'
      },
      
      _itemSorter: {
        computed: '_computeItemSorter(sortBy)'
      }
    };
  }

  _computeItemSorter(sortBy) {
    switch (sortBy) {
      case 'price':
        return (a, b) => (a - b);
      case 'name':
      default:
        let options = {
          localeMatcher: 'best fit',
          usage: 'sort',
          sensitivity: 'base',
          ignorePunctuation: true,
          numeric: true,
          caseFirst: 'lower'
        };
        return (a, b) => {
          let nameA = `${a['given-name']} ${a['family-name']}`.trim();
          let nameB = `${b['given-name']} ${b['family-name']}`.trim();
          return nameA.localeCompare(nameB, undefined, options);
        };
    }
  }

  _computeShowAverageScore(score) {
    return score >= 0
  }

  _onTutorRowClicked(evt) {
    console.log(evt.model.tutor);
    window.history.pushState({}, '', this.rootPath + './tutor/' + evt.model.tutor.username);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

}

window.customElements.define('tutoria-tutors-table', TutorsTable);
