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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};
