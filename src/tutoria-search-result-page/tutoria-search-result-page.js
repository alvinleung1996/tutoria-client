import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-image/iron-image.js';

import '../tutoria-api/tutoria-api-ajax.js';
import { redirectTo } from '../tutoria-api/tutoria-redirect-utils.js';
import '../tutoria-rating-bar/tutoria-rating-bar.js';
import '../tutoria-styles/tutoria-styles.js';
import '../tutoria-table/tutoria-table.js';

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
  max-width: 1000px;
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

#table {
  @apply --tutoria-shadow--elevation-2;
  border-radius: 4px;
  background-color: var(--tutoria-background--primary_color);
}
</style>

<tutoria-api-ajax>
  <iron-ajax id="ajax"
    method="GET"
    url="[[apiRootPath]]tutors"
    params="[[_ajaxParams]]"
    handle-as="json"
    last-response="{{_ajaxLastResponse}}"
    last-error="{{_ajaxLastError}}">
  </iron-ajax>
</tutoria-api-ajax>

<section>
  <div class="section-content">
    <header>Search Result</header>
    <tutoria-table
      id="table"
      columns="[[_tableColumns]]"
      data="[[_tableData]]"
      clickable
      on-tutoria-table-row-click="_onTableRowClick">
    </tutoria-table>
  </div>
</section>
`;

export default class SearchResultPage extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      visible: Boolean,
      queryParams: Object,

      pageTitle: {
        type: String,
        value: 'Search Result',
        readOnly: true,
        notify: true
      },

      _ajaxParams: {
        type: Object,
        computed: '_computeAjaxParams(queryParams.*)'
      },

      _tableColumns: {
        type: Array,
        value: () => [{
          onBindCallback: (cell, item, column) => {
            let image = cell.querySelector('iron-image');
            if (!image) {
              image = document.createElement('iron-image');
              image.style.setProperty('width', '48px');
              image.style.setProperty('height', '48px');
              image.style.setProperty('border-radius', '50%');
              image.setProperties({
                sizing: 'contain',
                preload: true,
                fade: true
              });
              cell.appendChild(image);
            }
            image.src = item.avatar;
          }
        }, {
          headerText: 'Name',
          propertyName: 'fullName',
          width: '1fr'
        }, {
          headerText: 'University',
          propertyName: 'university'
        }, {
          headerText: 'Course Code',
          propertyName: 'courseCodes'
        }, {
          headerText: 'Subject Tags',
          propertyName: 'subjectTags'
        }, {
          headerText: 'Hourly Rate',
          alignRight: true,
          propertyName: 'hourlyRate',
          cellPrefix: '$ ',
          sortingFunction: (a, b, descending) => descending ? (b.hourlyRate - a.hourlyRate) : (a.hourlyRate - b.hourlyRate)
        }, {
          headerText: 'Average Review Score',
          alignRight: true,
          propertyName: 'averageReviewScore',
          sortingFunction: (a, b, descending) => descending ? (b.averageReviewScore - a.averageReviewScore) : (a.averageReviewScore - b.averageReviewScore),
          onBindCallback: (cell, item, column) => {
            let bar = cell.querySelector('tutoria-rating-bar');
            if (!bar) {
              bar = document.createElement('tutoria-rating-bar');
              cell.appendChild(bar);
            }
            bar.setProperties({
              rating: item.averageReviewScore,
              maxRating: 5,
              reverse: true
            });
          }
        }]
      },
      _tableData: {
        type: Array,
        computed: '_computeTableData(_ajaxLastResponse, _ajaxLastError)'
      }
    };
  }

  static get observers() {
    return [
      '_onSearchResultUpdated(visible, _ajaxParams)'
    ];
  }

  _onSearchResultUpdated(visible, ajaxParams) {
    if (visible && ajaxParams) {
      this.$.ajax.generateRequest();
    }
  }

  _computeAjaxParams(record) {
    let queryParams = record && record.base;
    if (!queryParams) {
      return undefined;
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
          case 'type':
            params[key] = value.trim(); break;
          case 'subject-tags':
            params[key] = value.split(',').map(n => n.trim()).join(','); break;
          case 'hourly-rate-min':
          case 'hourly-rate-max':
            isFinite(value) && (params[key] = Number.parseFloat(value)); break;
          case 'free-only':
            params[key] = Boolean(value); break;
        }
      }
    }
    return params;
  }

  _computeTableData(response, error) {
    if (error) {
      return [];
    }

    let tutors = response.data;
    tutors.forEach(tutor => {
      tutor.hourlyRate = Number.parseFloat(tutor.hourlyRate);
    });

    return tutors;
  }

  _onTableRowClick(evt) {
    const tutor = evt.detail.item;
    redirectTo(this.rootPath + 'tutors/' + tutor.username);
  }

}

window.customElements.define('tutoria-search-result-page', SearchResultPage);
