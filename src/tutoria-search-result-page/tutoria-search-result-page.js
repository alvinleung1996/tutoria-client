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
  items="[[_ajaxLastResponse]]">
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

      _ajaxLastResponse: {
        observer: '_onAjaxLastResponseChanged'
      },
      _ajaxLastError: {
        observer: '_onAjaxLastErrorChanged'
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

  _onAjaxLastResponseChanged(response) {
    if (!response) {
      return;
    }
    console.log('ajax response', response);
  }

  _onAjaxLastErrorChanged(error) {
    if (!error) {
      return;
    }
    console.warn('ajax error', error);
  }

}

window.customElements.define('tutoria-search-result-page', SearchResultPage);
