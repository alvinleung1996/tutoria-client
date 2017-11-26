const getTime = require('./time.js').getTime;

const events = [
  {
    startTime: getTime(1, 13, 0).toISOString(),
    endTime: getTime(1, 13, 30).toISOString(),
    type: 'tutorial',
    studentId: 0,
    tutorId: 1
  },
  {
    startTime: getTime(3, 15, 30).toISOString(),
    endTime: getTime(3, 16, 30).toISOString(),
    tutorId: 1,
    type: 'unavailablePeriod'
  }
];
events.forEach((t, i) => t.id = i);

module.exports = class Events {

  static getEvents(id) {
    let event = event[id];
    return !event.cancelled && event;
  }

  static getEventsOfUser(user) {
    return events.filter(e => !e.cancelled && (e.studentId === user.id || e.tutorId === user.id));
  }

  static addEvent(event) {
    event.id = events.length;
    events.push(event);
  }

}
