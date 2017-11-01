import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';

import '../tutoria-dialog/tutoria-dialog.js';
import '../tutoria-timetable/tutoria-timetable.js';

import './tutoria-home-page-event-detail-dialog.js';

export const template = `
<style>
:host {
  display: block;
  height: 500px;
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

#timetable {
  height: 500px;
}
</style>

<iron-ajax id="ajax"
  auto
  method="GET"
  url="[[apiRootPath]]user/events"
  handle-as="json"
  last-response="{{_ajaxLastResponse}}"
  last-error="{{_ajaxLastError}}">
</iron-ajax>

<section>
  <header>Your Bookings</header>
  <tutoria-timetable id="timetable" class="content"
    events="[[_events]]"
    on-tutoria-timetable-event-selected="_onEventSelected">
  </tutoria-timetable>
</section>
`;

export default class TutoriaHome extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      pageTitle: {
        type: String,
        value: 'Home',
        readOnly: true,
        notify: true
      },
      // hideToolbar: {
      //   type: Boolean,
      //   value: true,
      //   readOnly: true,
      //   notify: true
      // },
      // showToolbarShadow: {
      //   type: Boolean,
      //   value: true,
      //   readOnly: true,
      //   notify: true
      // }

      _events: {
        type: Array,
        computed: '_computeEvents(_ajaxLastResponse, _ajaxLastError)'
      }
    };
  }

  _computeEvents(response, error) {
    if ((response && 'error' in response) || error) {
      return [];
    }
    let events = [];
    for (const entry of response.data) {
      let event = {
        id: entry.id,
        startDate: new Date(entry.startDate),
        endDate: new Date(entry.endDate),
        type: entry.type,
        description: entry.type === 'tutorial' ? `Tutorial` : 'Unavailable Period',
        student: {
          givenName: entry.student.givenName,
          familyName: entry.student.familyName
        }
      }
      if (event.type === 'tutorial') {
        event['tutor'] = {
          givenName: entry.tutor.givenName,
          familyName: entry.tutor.familyName
        }
      }
      events.push(event);
    }
    return events;
  }

  _onEventSelected(evt) {
    const event = evt.detail.selectedEvent.originalEvent;
    const dialog = document.createElement('tutoria-home-page-event-detail-dialog');
    dialog.event = event;
    dialog.showForResult()
    .then(() => {
      this.$.ajax.generateRequest();
    }, e => e && console.error(e));
  }

}

window.customElements.define('tutoria-home-page', TutoriaHome);
