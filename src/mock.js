import {getRandomNumber} from './utils';

// константы времени
const SECOND_MILLISECONDS = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_TWO_WEEKS = 14;

// ограничения
// - даты
const MIN_DAY_VALUE = 1;
const MAX_DAY_VALUE = 28;
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
const eventNames = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
export const eventsData = new Map([ // for..of
  [`taxi`, {
    icon: `🚕`,
    title: `Taxi to`,
    category: `transport`,
    destination: places,
    offers: [
      `Add luggage`,
      `Switch to comfort class`,
      `Order UBER`,
    ],
  }],
  [`bus`, {
    icon: `🚌`,
    title: `Bus to`,
    category: `transport`,
    destination: places.concat(cities).concat(sights),
    offers: [
      `Add luggage`,
      `Switch to comfort class`,
      `Choose seats`,
    ],
  }],
  [`train`, {
    icon: `🚂`,
    title: `Train to`,
    category: `transport`,
    destination: cities,
    offers: [
      `Add luggage`,
      `Switch to comfort class`,
      `Add meal`,
      `Choose seats`,
    ],
  }],
  [`ship`, {
    icon: `🛳️`,
    title: `Ship to`,
    category: `transport`,
    destination: cities,
    offers: [
      `Add luggage`,
      `Switch to comfort class`,
      `Choose seats`,
    ],
  }],
  [`transport`, {
    icon: `🚊`,
    title: `Other transport to`,
    category: `transport`,
    destination: places.concat(cities).concat(sights),
    offers: [
      `Add luggage`,
      `Switch to comfort class`,
      `Choose seats`,
    ],
  }],
  [`drive`, {
    icon: `🚗`,
    title: `Drive to`,
    category: `transport`,
    destination: places.concat(cities).concat(sights),
    offers: [
      `Rent a car`,
      `Switch to comfort class`,
      `Choose seats`,
    ],
  }],
  [`flight`, {
    icon: `✈️`,
    title: `Flight to`,
    category: `transport`,
    destination: cities,
    offers: [
      `Add luggage`,
      `Add meal`,
      `Choose seats`,
    ],
  }],
  [`check-in`, {
    icon: `🏨`,
    title: `Check into`,
    category: `events`,
    destination: hospitality,
    offers: [
      `Add breakfast`,
      `Early check-in`,
      `Wi-fi`,
    ],
  }],
  [`sightseeing`, {
    icon: `🏛️`,
    title: `Sightseeing to`,
    category: `events`,
    destination: sights,
    offers: [
      `Audio guide`,
      `Add a meal`,
      `Wi-fi`,
    ],
  }],
  [`restaurant`, {
    icon: `🍴`,
    title: `Eat in`,
    category: `events`,
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

  return new Date(currentDateMilliseconds - DAYS_IN_TWO_WEEKS * dayMilliseconds + (randomDay * dayMilliseconds) + ((randomHour * MINUTES_IN_HOUR + randomMinutes) * SECONDS_IN_MINUTE * SECOND_MILLISECONDS));
};

const makeUniqueArray = (count, source) => {

  const collection = new Set();

  while (collection.size < count) {
    collection.add(source[getRandomNumber(0, source.length - 1)]);
  }
  const array = [];
  collection.forEach((element) => array.push(element));

  return array;
};

const makeEventData = () => {


  const eventNameChoosen = eventNames[getRandomNumber(0, eventNames.length - 1)];
  const eventDataChoosen = eventsData.get(eventNameChoosen);

  return {
    mapElement: eventDataChoosen,
    icon: eventDataChoosen.icon,
    title: eventDataChoosen.title,
    destination: eventDataChoosen.destination[getRandomNumber(0, eventDataChoosen.destination.length - 1)],
    picture: chooseSights(),
    description: makeUniqueArray(getRandomNumber(MIN_DESCRIPTION_COUNT, MAX_DESCRIPTION_COUNT), descriptions).join(` `),
    time: {
      from: `12:00`,
      to: `13:00`,
      duration: `10H 50M`,
    },
    price: getRandomNumber(MIN_PRICE, MAX_PRICE),
    offers: makeUniqueArray(getRandomNumber(MIN_OFFERS_COUNT, MAX_OFFERS_COUNT), eventDataChoosen.offers),
    isDeleted: false,
  };
};

export const makeDayData = (count) => {

  return {
    date: makeRandomDate(),
    data: new Array(count).fill().map(() => makeEventData())
  };
};
