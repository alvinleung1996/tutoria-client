import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';

import '../tutoria-api/tutoria-api-ajax.js';
import '../tutoria-dialog/tutoria-dialog.js';
import '../tutoria-timetable/tutoria-timetable.js';

import './tutoria-home-page-tutorial-detail-dialog.js';

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

<tutoria-api-ajax>
  <iron-ajax id="ajax"
    method="GET"
    url$="[[apiRootPath]]users/me/events"
    handle-as="json"
    last-response="{{_ajaxLastResponse}}"
    last-error="{{_ajaxLastError}}">
  </iron-ajax>
</tutoria-api-ajax>

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
      visible: Boolean,

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
        computed: '_computeEvents(_ajaxLastResponse)'
      }
    };
  }

  static get observers() {
    return [
      '_onPageShouldUpdate(visible)'
    ];
  }

  _onPageShouldUpdate(visible) {
    if (visible) {
      this.$.ajax.generateRequest();
    }
  }
  

  _computeEvents(response) {
    if (!response) {
      return [];
    }

    let events = response.data;
    events.forEach(event => {
      event.startTime = new Date(event.startTime);
      event.endTime = new Date(event.endTime);
      event.description = event.type === 'tutorial' ? 'Tutorial' : 'Unavailable';
      event.selectable = true;
    });

    return events;
  }

  _onEventSelected(evt) {
    const event = evt.detail.selectedEvent.originalEvent;
    switch (event.type) {
      case 'tutorial':
        this._showTutorialDetailDialog(event);
        break;
    }
  }

  _showTutorialDetailDialog(event) {
    const dialog = document.createElement('tutoria-home-page-tutorial-detail-dialog');
    dialog.event = event;
    dialog.showForResult()
    .then(() => {
      this.$.ajax.generateRequest()
    }, e => e && console.error(e));
  }

}

window.customElements.define('tutoria-home-page', TutoriaHome);
