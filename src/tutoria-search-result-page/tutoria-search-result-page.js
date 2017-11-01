import TutoriaElement from '../tutoria-element/tutoria-element.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';

import './tutoria-tutors-table.js';

export const template = `

<style>
:host {
  display: block;
}
#table {
  margin-top: 32px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
}
</style>

<iron-ajax id="ajax"
  auto
  method="GET"
  url="[[apiRootPath]]tutors"
  handle-as="json"
  last-response="{{_ajaxLastResponse}}"
  last-error="{{_ajaxLastError}}">
</iron-ajax>

<tutoria-tutors-table id="table"
  header="Search Result"
  items="[[_tutors]]">
</tutoria-tutors-table>
`;

export default class SearchResultPage extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      pathMatchResult: {
        type: Object
      },
      queryParams: Object,

      pageTitle: {
        type: String,
        value: 'Search Result',
        readOnly: true,
        notify: true
      },

      _tutors: {
        type: Array,
        computed: '_computeTutors(_ajaxLastResponse, _ajaxLastError)'
      }
    };
  }

  static get observers() {
    return [
      '_onQueryParamsChanged(queryParams.*)'
    ];
  }

  _onQueryParamsChanged(record) {
    let queryParams = record && record.base;
    if (!queryParams) {
      return;
    }

    let params = {};
    for (let key in queryParams) {
      let value = queryParams[key];
      if (queryParams.hasOwnProperty(key)) {
        switch (key) {
          case 'given-name':
          case 'family-name':
          case 'university':
          case 'course-code':
            params[key] = value.trim(); break;
          case 'subject-tags':
          case 'type':
            params[key] = value.split(',').map(n => n.trim()); break;
          case 'price-min':
          case 'price-max':
            isFinite(value) && (params[key] = Number.parseFloat(value)); break;
          case 'show-all':
            params[key] = Boolean(value); break;
        }
      }
    }
    console.log(params);
    this.$.ajax.params = params;
  }

  _computeTutors(response, error) {
    if ((response && 'error' in response) || error) {
      return [];
    }
    let tutors = [];
    for (const entry of response.data) {
      tutors.push({
        username: entry.username,
        givenName: entry.givenName,
        familyName: entry.familyName,
        hourlyRate: Number.parseFloat(entry.hourlyRate),
        university: entry.university,
        courseCode: entry.courseCode,
        subjectTags: entry.subjectTags,
        averageReviewScore: entry.averageReviewScore
      });
    }
    return tutors;
  }

}

window.customElements.define('tutoria-search-result-page', SearchResultPage);
