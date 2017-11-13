function getTime(dayOffset, hours, minutes) {
  let time = new Date();
  time.setDate(time.getDate()+dayOffset);
  time.setHours(hours);
  time.setMinutes(minutes);
  time.setSeconds(0);
  time.setMilliseconds(0);
  return time;
}

function getTimeDelta(hours, minutes) {
  let time0 = new Date();
  let time1 = new Date(time0.getTime());
  time1.setHours(time0.getHours() + hours);
  time1.setMinutes(time0.getMinutes() + minutes);
  return time1 - time0;
}

module.exports = {
  getTime: getTime,
  getTimeDelta: getTimeDelta
};
