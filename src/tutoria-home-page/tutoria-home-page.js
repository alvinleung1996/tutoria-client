import TutoriaElement from '../tutoria-element/tutoria-element.js';
import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../tutoria-dialog/tutoria-dialog.js';
import '../tutoria-timetable/tutoria-timetable.js';

import './tutoria-tutorial-detail-dialog.js';

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

<section>
  <header>Your Bookings</header>
  <tutoria-timetable id="timetable" class="content" on-tutoria-timetable-event-selected="_onEventSelected"></tutoria-timetable>
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
    };
  }

  _onEventSelected(evt) {
    console.log(evt.detail.selectedEvent);
    const tutorial = evt.detail.selectedEvent.originalEvent;
    let dialog = document.createElement('tutoria-tutorial-detail-dialog');
    dialog.startDate = tutorial.startDate;
    dialog.endDate = tutorial.endDate;
    dialog.show();
    dialog.cancelBookingCallback = d => {
      this._comfirmCancelTutorial()
      .then(
        cd => Promise.all([
          d.hide(),
          cd.hide()
        ])
        .then(
          () => this._informTutorialCancelled()
        ),
        cd => cd.hide()
      );
    }
    dialog.closeCallback = d => {
      d.hide();
    }
  }

  _comfirmCancelTutorial() {
    return new Promise((resolve, reject) => {
      let dialog = document.createElement('tutoria-dialog');
      dialog.header = 'Cancel Booking?';
      dialog.content = 'Cancelling the booking will also refund the tutorial fee.';
      dialog.actions = [
        {
          text: 'Keep Booking',
          callback: (d, a) => reject(d) 
        },
        {
          text: 'Cancel Booking',
          callback: (d, a) => resolve(d)
        }
      ];
      dialog.show();
    });
  }

  _informTutorialCancelled() {
    let dialog = document.createElement('tutoria-dialog');
    dialog.header = 'Tutorial Cancelled';
    dialog.content = 'Your booking has been cancelled and your fee has been refunded.';
    dialog.actions = [
      {
        text: 'OK',
        callback: (d, a) => d.hide() 
      },
    ];
    dialog.show();
  }

}

window.customElements.define('tutoria-home-page', TutoriaHome);
