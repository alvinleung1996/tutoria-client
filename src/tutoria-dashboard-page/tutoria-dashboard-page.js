import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/iron-ajax/iron-ajax.js';
import '../../node_modules/@polymer/iron-icon/iron-icon.js';
import '../../node_modules/@polymer/paper-button/paper-button.js';

import '../tutoria-api/tutoria-api-ajax.js';
import '../tutoria-dialog/tutoria-dialog.js';
import '../tutoria-icons/tutoria-icons.js';
import '../tutoria-timetable/tutoria-timetable.js';

import './tutoria-add-unavailable-period-dialog.js';
import './tutoria-tutorial-detail-dialog.js';
import './tutoria-unavailable-period-detail-dialog.js';

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

article {
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--secondary_color);
}

#timetable-topping {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#timetable {
  min-height: 300px;
  max-height: calc(100vh - 256px);
  @apply --tutoria-shadow--elevation-2;
  border-radius: 4px;
  background-color: var(--tutoria-background--primary_color);
}
#add-unavailable-period-button {
  @apply --tutoria-text--button_font;
  color: var(--tutoria-text--secondary_color);
  text-transform: none;
  transition: color 200ms ease-out;
}
#add-unavailable-period-button:hover,
#add-unavailable-period-button:active {
  color: green;
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
  <div class="section-content">
    <div id="timetable-topping">
      <header>Your Bookings</header>
      <paper-button id="add-unavailable-period-button" on-click="_onAddUnavailablePeriodButtonClick"><iron-icon icon="tutoria:add"></iron-icon>Unavailable Period</paper-button>
    </div>
    <tutoria-timetable id="timetable" class="content"
      events="[[_events]]"
      on-tutoria-timetable-event-selected="_onEventSelected">
    </tutoria-timetable>
  </div>
</section>
`;

export default class TutoriaDashboard extends TutoriaElement {

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
      case 'unavailablePeriod':
        this._showUnavailablePeriodDetailDialog(event);
        break;
    }
  }

  _showTutorialDetailDialog(event) {
    const dialog = document.createElement('tutoria-tutorial-detail-dialog');
    dialog.event = event;
    dialog.showForResult()
    .then(() => {
      this.$.ajax.generateRequest()
    }, e => e && console.error(e));
  }

  _showUnavailablePeriodDetailDialog(unavailablePeriod) {
    const dialog = document.createElement('tutoria-unavailable-period-detail-dialog');
    dialog.unavailablePeriod = unavailablePeriod;
    dialog.show()
    dialog.addEventListener('tutoria-unavailable-period-detail-dialog-dialog-cancelled', e => {
      this.$.ajax.generateRequest()
    });
  }




  _onAddUnavailablePeriodButtonClick(evt) {
    const dialog = document.createElement('tutoria-add-unavailable-period-dialog');
    dialog.addEventListener('tutoria-add-unavailable-period-dialog-added', e => {
      this.$.ajax.generateRequest();
    });
    dialog.show();
  }

}

window.customElements.define('tutoria-dashboard-page', TutoriaDashboard);
