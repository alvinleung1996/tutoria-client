import TutoriaElement from '../tutoria-element/tutoria-element.js';

import '../../node_modules/@webcomponents/shadycss/apply-shim.min.js';

import '../../node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

export const template = `
<style>
:host {
  --tutoria-timetable__day-column-header_height: 56px;
  --tutoria-timetable__day-column_width: 100px;
  --tutoria-timetable__day-column_height: 1000px;
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
  overflow-y: hidden;
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
  border: 1px solid var(--tutoria-accent_color);
  border-radius: 2px;
  background-color: lightgrey;
}
.event[selectable] {
  cursor: pointer;
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
        <div class="event" style$="[[_computeEventPositionStyles(dayStartTimeOffset, dayEndTimeOffset, event.startTime, event.endTime)]]" selectable$="[[event.selectable]]" on-click="_onEventClicked">[[event.description]]</div>
      </template>
    </div>
  </template>

</div>
`;

function getTime(dayOffset, hour, minute) {
  let time = new Date();
  time.setDate(time.getDate() + dayOffset);
  time.setHours(hour);
  time.setMinutes(minute);
  time.setSeconds(0);
  time.setMilliseconds(0);
  return time;
}

function getTimeDelta(hour, minute) {
  let time0 = new Date();
  time0.setSeconds(0);
  time0.setMilliseconds(0);
  let time1 = new Date(time0.getTime());
  time1.setHours(time1.getHours() + hour);
  time1.setMinutes(time1.getMinutes() + minute);
  return time1.getTime() - time0.getTime();
}

export default class TutoriaTimetable extends TutoriaElement {

  static get template() {
    return template;
  }

  static get properties() {
    return {
      periodStartTime: { // include
        type: Date,
        value: getTime(0, 0, 0)
      },
      periodEndTime: { // exclude
        type: Date,
        value: getTime(7, 0, 0)
      },
      dayStartTimeOffset: { // include
        type: Number,
        value: getTimeDelta(0, 0)
      },
      dayEndTimeOffset: { // exclude
        type: Number,
        value: getTimeDelta(24, 0)
      },
      timestampTimeOffset: {
        type: Number,
        value: getTimeDelta(0, 0)
      },
      timestampTimeInterval: {
        type: Number,
        value: getTimeDelta(1, 0)
      },
      events: {
        type: Array,
        value: () => []
      },

      _timestamps: {
        type: Array,
        computed: '_computeTimeStamps(dayStartTimeOffset, dayEndTimeOffset, timestampTimeOffset, timestampTimeInterval)'
      },
      _days: {
        type: Array,
        computed: '_computeDays(periodStartTime, periodEndTime, dayStartTimeOffset, dayEndTimeOffset, events.*)'
      },
    };
  }

  _computeTimeStamps(dayStartTimeOffset, dayEndTimeOffset, timestampTimeOffset, timestampTimeInterval) {
    let timestamps = [];

    let baseTime = new Date();
    baseTime.setHours(0); baseTime.setMinutes(0); baseTime.setSeconds(0); baseTime.setMilliseconds(0);

    let startTime = new Date(baseTime.getTime() + dayStartTimeOffset);
    let endTime = new Date(baseTime.getTime() + dayEndTimeOffset);
    
    for (let timestampTime = new Date(startTime.getTime() + timestampTimeOffset);
         timestampTime.getTime() <= endTime.getTime(); // Use equal sign here to show the last timestamp
         timestampTime.setTime(timestampTime.getTime() + timestampTimeInterval))
    {
      timestamps.push({
        timeOffset: timestampTime.getTime() - startTime.getTime(),
        text: `${timestampTime.getHours().toString().padStart(2,'0')}`
      });
    }

    return timestamps;
  }

  _computeDays(periodStartTime, periodEndTime, dayStartTimeOffset, dayEndTimeOffset, eventsRecord) {
    const events = eventsRecord && eventsRecord.base;

    let days = [];
    for (let day = new Date(periodStartTime.getTime()); day.getTime() < periodEndTime.getTime(); day.setDate(day.getDate()+1)) {
      days.push({
        startTime: new Date(day.getTime() + dayStartTimeOffset),
        endTime: new Date(day.getTime() + dayEndTimeOffset),
        displayText: `${day.getDate()} / ${day.getMonth()+1}`,
        events: []
      });
    }

    let computedEvents = [];
    if (events) {
      for (const event of events) {
        let startTime = new Date(event.startTime.getTime());
        let endTime = new Date(event.endTime.getTime());
        while (startTime.getTime() < endTime.getTime()) {
          let nextTime = new Date(startTime.getTime());
          nextTime.setDate(nextTime.getDate()+1); nextTime.setHours(0); nextTime.setMinutes(0); nextTime.setSeconds(0); nextTime.setMilliseconds(0);
          computedEvents.push({
            startTime: new Date(startTime.getTime()),
            endTime: new Date(Math.min(endTime.getTime(), nextTime.getTime())),
            description: event.description,
            selectable: event.selectable,
            originalEvent: event
          });
          startTime = nextTime;
        }
      }
    }

    let dayLength = dayEndTimeOffset - dayStartTimeOffset;
    for (const event of computedEvents) {
      for (const day of days) {
        if (event.startTime.getTime() < day.endTime.getTime() && day.startTime.getTime() < event.endTime.getTime()) {
          event.startTime = new Date(Math.max(event.startTime.getTime(), day.startTime.getTime()));
          event.endTime = new Date(Math.min(event.endTime.getTime(), day.endTime.getTime()));
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
    let baseTime = new Date(eventStartDate.getTime());
    baseTime.setHours(0); baseTime.setMinutes(0); baseTime.setSeconds(0); baseTime.setMilliseconds(0);

    let dayLength = dayEndTimeOffset - dayStartTimeOffset;

    let top = (eventStartDate.getTime() - baseTime.getTime() - dayStartTimeOffset) / dayLength * 100;
    let bottom = (baseTime.getTime() + dayEndTimeOffset - eventEndDate.getTime()) / dayLength * 100;
    // Percentage is OK since the div is absolute positioned.
    return `top:${top}%;bottom:${bottom}%;`;
  }



  _onDayColumnClicked(evt) {
    if (evt.target !== evt.currentTarget) {
      return;
    }
    
    const mouseY = evt.offsetY;
    const dayStartTime = evt.model.day.startTime;
    const dayEndTime = evt.model.day.endTime;

    let selectedTime = new Date(dayStartTime.getTime() + evt.offsetY * (dayEndTime.getTime() - dayStartTime.getTime()) / evt.target.clientHeight);

    this.dispatchEvent(new CustomEvent('tutoria-timetable-time-selected', {
      detail: {
        selectedTime: selectedTime
      }
    }));
  }

  _onEventClicked(evt) {
    const selectedEvent = evt.model.event;
    if (!selectedEvent.selectable) {
      return;
    }
    this.dispatchEvent(new CustomEvent('tutoria-timetable-event-selected', {
      detail: {
        selectedEvent: selectedEvent
      }
    }))
  }

}

window.customElements.define('tutoria-timetable', TutoriaTimetable);
