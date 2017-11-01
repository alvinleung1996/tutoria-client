import TutoriaElement from '../tutoria-element/tutoria-element.js';

import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

export const template = `
<style>
:host {
  --tutoria-timetable__day-column-header_height: 56px;
  --tutoria-timetable__day-column_width: 100px;
  --tutoria-timetable__day-column_height: 700px;
  --tutoria-timetable__timestamp-header_width: 56px;

  overflow: auto;
  display: block;
}

#table {
  display: grid;
  grid-template-columns: var(--tutoria-timetable__timestamp-header_width);
  grid-auto-columns: minmax(var(--tutoria-timetable__day-column_width), 1fr);
  grid-template-rows: var(--tutoria-timetable__day-column-header_height) var(--tutoria-timetable__day-column_height);
}

dom-repeat {
  display: none;
}

#table::before {
  display: block;
  content: '';
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 3;
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  background-color: var(--tutoria-background--primary_color);
  border-right: var(--tutoria-divider_color) 1px solid;
  border-bottom: var(--tutoria-divider_color) 1px solid;
}

#timestamp-headers {
  position: -webkit-sticky;
  position: sticky;
  left: 0px;
  z-index: 1;
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  overflow-y: hidden;
  border-right: var(--tutoria-divider_color) 1px solid;
  background-color: var(--tutoria-background--primary_color);
}
.timestamp-header {
  position: absolute;
  left: 0px;
  right: 0px;
  transform: translateY(-50%);
  padding-right: 8px;
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--secondary_color);
  text-align: right;
}

#timestamp-markers {
  grid-row: 2 / 3;
  grid-column-start: 2;
  position: relative;
}
.timestamp-marker {
  position: absolute;
  left: 0px;
  right: 0px;
  border-top: var(--tutoria-divider_color) 1px dashed;
  transform: translateY(-50%);
}

.day-column-header {
  position: -webkit-sticky; /* for Safari */
  position: sticky;
  top: 0px;
  z-index: 2;
  grid-row: 1 / 2;
  grid-column-end: span 1;
  background-color: var(--tutoria-background--primary_color);
  border-bottom: var(--tutoria-divider_color) 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
  @apply --tutoria-text--body1_font;
  color: var(--tutoria-text--secondary_color);
}
.day-column-header:not(.last-day-column) {
  border-right: var(--tutoria-divider_color) 1px solid;
}

.day-column {
  grid-row: 2 / 3;
  grid-column-end: span 1;
  position: relative;
}
.day-column:not(.last-day-column) {
  border-right: var(--tutoria-divider_color) 1px solid;
}

.event {
  position: absolute;
  left: 0px;
  right: 0px;
  background-color: yellow;
}
</style>

<div id="table">

    <div id="timestamp-headers">
      <template is="dom-repeat" items="[[_timestamps]]" as="timestamp">
        <div class="timestamp-header" style$="[[_computeTimestampPositionStyle(dayStartTimeOffset, dayEndTimeOffset, timestamp.timeOffset)]]">[[timestamp.text]]</div>
      </template>
    </div>

    <div id="timestamp-markers" style$="grid-column-end: span [[_days.length]];">
      <template is="dom-repeat" items="[[_timestamps]]" as="timestamp">
        <div class="timestamp-marker" style$="[[_computeTimestampPositionStyle(dayStartTimeOffset, dayEndTimeOffset, timestamp.timeOffset)]]"></div>
      </template>
    </div>

    <template is="dom-repeat" items="[[_days]]" as="day">
      <div class$="day-column-header [[_computeDayColumnClass(index, _days.length)]]" style$="[[_computeDayColumnStartStyle(index)]]">[[day.displayText]]</div>
    </template>

    <template is="dom-repeat" items="[[_days]]" as="day">
      <div class$="day-column [[_computeDayColumnClass(index, _days.length)]]" style$="[[_computeDayColumnStartStyle(index)]]"
        on-click="_onDayColumnClicked">
        <template is="dom-repeat" items="[[day.events]]" as="event">
          <div class="event" style$="[[_computeEventPositionStyles(dayStartTimeOffset, dayEndTimeOffset, event.startDate, event.endDate)]]" on-click="_onEventClicked">[[event.description]]</div>
        </template>
      </div>
    </template>

  </div>
</div>
`;

function _mock_date(dayOffset, hour, minute) {
  let d = new Date();
  d.setDate(d.getDate()+dayOffset);
  d.setHours(hour);
  d.setMinutes(minute);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

function _mock_deltaTime(hour, minute) {
  let d0 = new Date();
  d0.setSeconds(0);
  d0.setMilliseconds(0);
  let d1 = new Date(d0.getTime());
  d1.setHours(d1.getHours()+hour);
  d1.setMinutes(d1.getMinutes()+minute);
  return d1.getTime() - d0.getTime();
}

export default class TutoriaTimetable extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      periodStartDate: { // include
        type: Date,
        value: _mock_date(0, 0, 0)
      },
      periodEndDate: { // exclude
        type: Date,
        value: _mock_date(7, 0, 0)
      },
      dayStartTimeOffset: { // include
        type: Number,
        value: _mock_deltaTime(0, 0)
      },
      dayEndTimeOffset: { // exclude
        type: Number,
        value: _mock_deltaTime(24, 0)
      },
      timestampTimeOffset: {
        type: Number,
        value: _mock_deltaTime(0, 0)
      },
      timestampTimeInterval: {
        type: Number,
        value: _mock_deltaTime(1, 0)
      },
      events: {
        type: Array,
        value: () => []
        // value: () => [
        //   {
        //     startDate: _mock_date(2, 0, 0),
        //     endDate: _mock_date(2, 2, 30),
        //     name: 'Meeting with god'
        //   },
        //   {
        //     startDate: _mock_date(3, 2, 30),
        //     endDate: _mock_date(3, 6, 0),
        //     name: 'Meeting with hell'
        //   }
        // ]
      },

      _timestamps: {
        type: Array,
        computed: '_computeTimeStamps(dayStartTimeOffset, dayEndTimeOffset, timestampTimeOffset, timestampTimeInterval)'
      },
      _days: {
        type: Array,
        computed: '_computeDays(periodStartDate, periodEndDate, dayStartTimeOffset, dayEndTimeOffset, events.*)'
      },
    };
  }

  static get observers() {
    return [
    ];
  }

  _computeTimeStamps(dayStartTimeOffset, dayEndTimeOffset, timestampTimeOffset, timestampTimeInterval) {
    let timestamps = [];

    let baseDate = new Date();
    baseDate.setHours(0); baseDate.setMinutes(0); baseDate.setSeconds(0); baseDate.setMilliseconds(0);

    let startDate = new Date(baseDate.getTime() + dayStartTimeOffset);
    let endDate = new Date(baseDate.getTime() + dayEndTimeOffset);
    
    for (let timestampDate = new Date(startDate.getTime() + timestampTimeOffset);
         timestampDate.getTime() <= endDate.getTime(); // Use equal sign here to show the last timestamp
         timestampDate.setTime(timestampDate.getTime() + timestampTimeInterval))
    {
      timestamps.push({
        timeOffset: timestampDate.getTime() - startDate.getTime(),
        text: `${timestampDate.getHours().toString().padStart(2,'0')}`
      });
    }

    return timestamps;
  }

  _computeDays(periodStartDate, periodEndDate, dayStartTimeOffset, dayEndTimeOffset, eventsRecord) {
    const events = eventsRecord && eventsRecord.base;

    let days = [];
    for (let day = new Date(periodStartDate.getTime()); day.getTime() < periodEndDate.getTime(); day.setDate(day.getDate()+1)) {
      days.push({
        startDate: new Date(day.getTime() + dayStartTimeOffset),
        endDate: new Date(day.getTime() + dayEndTimeOffset),
        displayText: `${day.getDate()} / ${day.getMonth()+1}`,
        events: []
      });
    }

    let computedEvents = [];
    for (const event of events) {
      let startDate = new Date(event.startDate.getTime());
      let endDate = new Date(event.endDate.getTime());
      while (startDate.getTime() < endDate.getTime()) {
        let nextDate = new Date(startDate.getTime());
        nextDate.setDate(nextDate.getDate()+1); nextDate.setHours(0); nextDate.setMinutes(0); nextDate.setSeconds(0); nextDate.setMilliseconds(0);
        computedEvents.push({
          startDate: new Date(startDate.getTime()),
          endDate: new Date(Math.min(endDate.getTime(), nextDate.getTime())),
          description: event.description,
          originalEvent: event
        });
        startDate = nextDate;
      }
    }

    let dayLength = dayEndTimeOffset - dayStartTimeOffset;
    for (const event of computedEvents) {
      for (const day of days) {
        if (event.startDate.getTime() < day.endDate.getTime() && day.startDate.getTime() < event.endDate.getTime()) {
          event.startDate = new Date(Math.max(event.startDate.getTime(), day.startDate.getTime()));
          event.endDate = new Date(Math.min(event.endDate.getTime(), day.endDate.getTime()));
          day.events.push(event);
          break;
        }
      }
    }

    return days;
  }



  _computeDayColumnClass(index, numOfDay) {
    return (index === (numOfDay - 1)) ? 'last-day-column' : '';
  }

  _computeDayColumnStartStyle(index) {
    return `grid-column-start:${index+2};`;
  }

  _computeTimestampPositionStyle(dayStartTimeOffset, dayEndTimeOffset, timestampTimeOffset) {
    let dayLength = dayEndTimeOffset - dayStartTimeOffset;
    let top = (timestampTimeOffset - dayStartTimeOffset) / dayLength * 100;
    return `top:${top}%;`;
  }

  _computeEventPositionStyles(dayStartTimeOffset, dayEndTimeOffset, eventStartDate, eventEndDate) {
    let baseDate = new Date(eventStartDate.getTime());
    baseDate.setHours(0); baseDate.setMinutes(0); baseDate.setSeconds(0); baseDate.setMilliseconds(0);

    let dayLength = dayEndTimeOffset - dayStartTimeOffset;

    let top = (eventStartDate.getTime() - baseDate.getTime() - dayStartTimeOffset) / dayLength * 100;
    let bottom = (baseDate.getTime() + dayEndTimeOffset - eventEndDate.getTime()) / dayLength * 100;
    // Percentage is OK since the div is absolute positioned.
    return `top:${top}%;bottom:${bottom}%;`;
  }



  _onDayColumnClicked(evt) {
    if (evt.target !== evt.currentTarget) {
      return;
    }
    
    const mouseY = evt.offsetY;
    const dayStartDate = evt.model.day.startDate;
    const dayEndDate = evt.model.day.endDate;

    let selectedDate = new Date(dayStartDate.getTime() + evt.offsetY * (dayEndDate.getTime() - dayStartDate.getTime()) / evt.target.clientHeight);

    this.dispatchEvent(new CustomEvent('tutoria-timetable-date-selected', {
      detail: {
        selectedDate: selectedDate
      }
    }));
  }

  _onEventClicked(evt) {
    const selectedEvent = evt.model.event;

    this.dispatchEvent(new CustomEvent('tutoria-timetable-event-selected', {
      detail: {
        selectedEvent: selectedEvent
      }
    }))
  }

}

window.customElements.define('tutoria-timetable', TutoriaTimetable);
