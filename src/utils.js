export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getFormatDate = (date) => {
  const dateOptions = {
    month: `short`,
    day: `numeric`,
  };

  return date.toLocaleDateString(`en-US`, dateOptions);
};

export const getFormatTime = (date) => {
  const timeOptions = {
    hour: `numeric`,
    minute: `numeric`
  };

  return date.toLocaleTimeString(`en-GB`, timeOptions);
};

export const getFormatTimeDifference = (firstDate, secondDate) => {

  const SECOND_MILLISECONDS = 1000;
  const SECONDS_IN_MINUTE = 60;
  const MINUTES_IN_HOUR = 60;

  const minuteMilliseconds = SECONDS_IN_MINUTE * SECOND_MILLISECONDS;
  const hourMilliseconds = minuteMilliseconds * MINUTES_IN_HOUR;

  const dateDifference = secondDate - firstDate;

  const hours = Math.floor(dateDifference / hourMilliseconds);
  const minutes = Math.floor((dateDifference / minuteMilliseconds) - hours * MINUTES_IN_HOUR);

  return hours + `h ` + minutes + `m`;
};
