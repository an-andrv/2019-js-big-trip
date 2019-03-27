export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getFormatTimeDifference = (firstDate, secondDate) => {

  const firstDateParse = firstDate.split(`:`);
  const secondDateParse = secondDate.split(`:`);

  let hours = firstDateParse[0] - secondDateParse[0];
  let minutes = firstDateParse[1] - secondDateParse[1];

  if (minutes < 0) {
    minutes = 60 + minutes;
    hours--;
  }

  return hours + `h ` + minutes + `m`;
};

export const getTimeDifferenceSumm = (stringDate) => {

  const stringDateParse = stringDate.split(` `);
  let [stringHours, stringMinutes] = stringDateParse;

  let hours = 0;
  let minutes = 0;

  const transformToNumberDate = (time) => {
    let timeTransform = time.split(``);
    timeTransform.pop();
    timeTransform = timeTransform.length > 1 ? timeTransform[0] + timeTransform[1] : timeTransform[0];
    return +timeTransform;
  };

  minutes += transformToNumberDate(stringMinutes);
  hours += transformToNumberDate(stringHours);
  hours += Math.round(minutes / 60);
  return hours;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const filterDays = (days, filterName) => {
  let filteredDays = [];

  switch (filterName) {
    case `everything`:
      filteredDays = days;
      break;

    case `future`:
      filteredDays = days.filter((dayData) => dayData.date.getTime() > Date.now());
      break;

    case `past`:
      filteredDays = days.filter((dayData) => dayData.date.getTime() < Date.now());
      break;
  }
  return filteredDays;
};

export const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export const toJSON = (response) => {
  return response.json();
};
