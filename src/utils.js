'use strict';

const order = (direction, propName) =>
  (a,b) => {
    switch (direction){
      case 'asc':
        return a[propName] - b[propName];
      case 'desc':
        return b[propName] - a[propName];
      default:
        return;
    }
  };

function convertDateToUTC(date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function isGreaterThanXMinutesApart(time1, time2, x) {
  const diff = Math.abs(time1 - time2);
  console.log(diff)
  console.log((x * 60 * 1000))
  return diff > (x * 60 * 1000);
}



module.exports = { order, convertDateToUTC, addMinutes, isGreaterThanXMinutesApart };
