import {getRandomNumber, getFormatDate, getFormatTime, getFormatTimeDifference} from './utils';

// константы времени
const SECOND_MILLISECONDS = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

// ограничения
// - даты
const MIN_DAY_VALUE = 1;
const MAX_DAY_VALUE = 14;
const MIN_HOUR_VALUE = 0;
const MAX_HOUR_VALUE = 23;
const MIN_MINUTES_VALUE = 0;
const MAX_MINUTES_VALUE = 59;
// - цены оффера
const MIN_PRICE = 20;
const MAX_PRICE = 100;
// - оффера
const MIN_OFFERS_COUNT = 0;
const MAX_OFFERS_COUNT = 2;
// - описания
const MIN_DESCRIPTION_COUNT = 1;
const MAX_DESCRIPTION_COUNT = 3;

// пункт назначения
const cities = [`Amsterdam`, `Geneva`, `Chamonix`];
const places = [`Airport`, `Bank`];
const sights = [`Museum`, `Gallery`];
const foodPlaces = [`Restaurant`, `Cafe`];
const hospitality = [`Hotel`, `Room`];

// типы точки маршрута
const eventNames = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
const eventsData = new Map([ // for..of
  [`Taxi`, {
    icon: `🚕`,
    title: `Taxi to`,
    destination: places,
    offers: [
      `Add luggage`,
      `Switch to comfort class`,
      `Order UBER`,
    ],
  }],
  [`Bus`, {
    icon: `🚌`,
    title: `Bus to`,
    destination: places.concat(cities).concat(sights),
    offers: [
      `Add luggage`,
      `Switch to comfort class`,
      `Choose seats`,
    ],
  }], 
  [`Train`, {
    icon: `🚂`,
    title: `Train to`,
    destination: cities,
    offers: [
      `Add luggage`, 
      `Switch to comfort class`, 
      `Add meal`, 
      `Choose seats`,
    ],
  }],
  [`Ship`, {
    icon: `🛳️`,
    title: `Ship to`,
    destination: cities,
    offers: [
      `Add luggage`,
      `Switch to comfort class`,
      `Choose seats`,
    ],
  }], 
  [`Transport`, {
    icon: `🚊`,
    title: `Other transport to`,
    destination: places.concat(cities).concat(sights),
    offers: [
      `Add luggage`,
      `Switch to comfort class`,
      `Choose seats`,
    ],
  }], 
  [`Drive`, {
    icon: `🚗`,
    title: `Drive to`,
    destination: places.concat(cities).concat(sights),
    offers: [
      `Rent a car`,
      `Switch to comfort class`,
      `Choose seats`,
    ],
  }], 
  [`Flight`, {
    icon: `✈️`,
    title: `Flight to`,
    destination: cities,
    offers: [
      `Add luggage`,
      `Add meal`,
      `Choose seats`,
    ],
  }],
  [`Check-in`, {
    icon: `🏨`,
    title: `Check into`,
    destination: hospitality,
    offers: [
      `Add breakfast`,
      `Early check-in`,
      `Wi-fi`,
    ],
  }], 
  [`Sightseeing`, {
    icon: `🏛️`,
    title: `Sightseeing to`,
    destination: sights,
    offers: [
      `Audio guide`,
      `Add a meal`,
      `Wi-fi`,
    ],
  }], 
  [`Restaurant`, {
    icon: `🍴`,
    title: `Eat in`,
    destination: foodPlaces,
    offers: [
      `Book a table`,
      `Vegetarian cuisine`,
      `Wi-fi`,
    ],
  }],
]);

// загрузка фотографий достопримечательностей
const chooseSights = () => `http://picsum.photos/300/150?r=${Math.random()}`;

// массив предложений. И случайным образом объединяйте от одного до трех предложений
const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

// дата
const makeRandomDate = () => {

  const dayMilliseconds = HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * SECOND_MILLISECONDS;
  const currentDateMilliseconds = Date.now();

  const randomDay = getRandomNumber(MIN_DAY_VALUE, MAX_DAY_VALUE);
  const randomHour = getRandomNumber(MIN_HOUR_VALUE, MAX_HOUR_VALUE);
  const randomMinutes = getRandomNumber(MIN_MINUTES_VALUE, MAX_MINUTES_VALUE);

  return new Date(currentDateMilliseconds + (randomDay * dayMilliseconds) + ((randomHour * MINUTES_IN_HOUR + randomMinutes) * SECONDS_IN_MINUTE * SECOND_MILLISECONDS));
};

const makeUniqueArray = (count, source) => {

  const collection = new Set();

  while (collection.size < count) {
    collection.add(source[getRandomNumber(0, source.length - 1)]);
  }
  const array = [];
  collection.forEach(element => array.push(element));

  return array;
};

const makeEventData = (date) => {

  const firstDate = date;
  const secondDate = new Date(firstDate.getTime() + MINUTES_IN_HOUR * SECONDS_IN_MINUTE * SECOND_MILLISECONDS);

  const eventNameChoosen = eventNames[getRandomNumber(0, eventNames.length - 1)];
  const eventDataChoosen = eventsData.get(eventNameChoosen);

  return {
    event: {
      icon: eventDataChoosen.icon,
      title: eventDataChoosen.title,
      location: eventDataChoosen.destination[getRandomNumber(0, eventDataChoosen.destination.length - 1)],
    },
    pictureAddress: chooseSights(),
    description: makeUniqueArray(getRandomNumber(MIN_DESCRIPTION_COUNT, MAX_DESCRIPTION_COUNT), descriptions).join(` `),
    time: {
      from: getFormatTime(firstDate),
      to: getFormatTime(secondDate),
      duration: getFormatTimeDifference(firstDate, secondDate),
    },
    price: getRandomNumber(MIN_PRICE, MAX_PRICE),
    offers: makeUniqueArray(getRandomNumber(MIN_OFFERS_COUNT, MAX_OFFERS_COUNT), eventDataChoosen.offers),
  };
};

export const makeDayData = (count) => {

  const date = makeRandomDate();

  const dayData = {
    date: getFormatDate(date),
    data: new Array(count).fill().map(_ => makeEventData(date))
  };

  return dayData;
};
