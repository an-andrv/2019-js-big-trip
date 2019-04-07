export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
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
      filteredDays = days.filter((dayData) => dayData.time.from > Date.now());
      break;

    case `past`:
      filteredDays = days.filter((dayData) => dayData.time.from < Date.now());
      break;
  }
  return filteredDays;
};

export const sortDays = (days, sortName) => {
  let sortingDays = [];

  switch (sortName) {
    case `event`:
      sortingDays = days;
      break;

    case `time`:
      sortingDays = days.slice().sort((a, b) => {
        return a.time.duration - b.time.duration;
      });
      break;

    case `price`:
      sortingDays = days.slice().sort((a, b) => {
        return a.price - b.price;
      });
      break;
  }
  return sortingDays;
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

export const changeServiceMessage = (element, message) => {
  element.innerHTML = message;
};

export const getTimeDifference = (timeFrom, timeTo) => {
  return timeTo - timeFrom;
};

export const convertToHours = (milliseconds) => {
  return Math.floor(milliseconds / (60 * 60 * 1000));
};
