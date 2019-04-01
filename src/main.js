import {Event} from './event';
import {EventEdit} from './event-edit';
import {TripDay} from './trip-day';
import {Filter} from './filter';
import moment from 'moment';
import {moneyParams, transportParams, timeSpendParams} from './chart';
import Chart from 'chart.js';
import {getTimeDifferenceSumm, filterDays} from './utils';
import {SERVER_ADDRESS, AUTHORIZATION} from './consts';
import {RestService} from './rest-service';

const filterNames = [`everything`, `future`, `past`];
const filtersSection = document.querySelector(`.trip-filter`);
const tripPointsContainer = document.querySelector(`.trip-points`);

const restService = new RestService({endPoint: SERVER_ADDRESS, authorization: AUTHORIZATION});

console.log(`getOffers :: `, restService.getPoints()); // 6
console.log(`getOffers :: `, restService.getOffers()); // 6
console.log(`getDestinations :: `, restService.getDestinations()); // 28

let daysData = [];
let destinationsData = [];
let offersData = [];

const promiseArray = [
  restService.getDestinations(),
  restService.getOffers(),
  restService.getPoints()
];

const handleAllPromises = Promise.all(promiseArray);

handleAllPromises
  .then((data) => {
    destinationsData = data[0];
    offersData = data[1];
    daysData = data[2];
    renderTripDay(daysData, tripPointsContainer);
  });

filterNames.forEach((name) => {
  const filterComponent = new Filter(name);
  filtersSection.appendChild(filterComponent.render());

  filterComponent.onFilter = (filterName) => {
    const filteredDaysData = filterDays(daysData, filterName);
    tripPointsContainer.innerHTML = ``;
    renderTripDay(filteredDaysData, tripPointsContainer);
  };
});

const renderEvent = (dist, event) => {

  const eventComponent = new Event(event);
  const editEventComponent = new EventEdit(event, offersData, destinationsData);

  dist.appendChild(eventComponent.render());

  eventComponent.onEdit = () => {
    editEventComponent.render();
    dist.replaceChild(editEventComponent.element, eventComponent.element);
    eventComponent.unrender();
  };

  editEventComponent.onSubmit = (newData) => {
      event.id = newData.id;
      event.icon = newData.icon;
      event.title = newData.title;
      event.destination = newData.destination;
      event.time.from = newData.time.from;
      event.time.to = newData.time.to;
      event.price = newData.price;
      event.offers = newData.offers;

    restService.updateTask({id: event.id, data: event.toRAW()})
      .then((newEvent) => {
        eventComponent.update(newEvent),
        eventComponent.render(),
        dist.replaceChild(eventComponent.element, editEventComponent.element),
        editEventComponent.unrender()
      });

  };

  editEventComponent.onDelete = (isDeletedValue) => {
    // event.isDeleted = isDeletedValue;

    dist.removeChild(editEventComponent.element);
    editEventComponent.unrender();
  };
  
};

const renderTripDay = (points, dist) => {
  let currentDay = moment(points[0].time.from).format(`D`);
  let currentMonth = moment(points[0].time.from).format(`MMM`);

  let tripDayComponent = new TripDay(currentDay, currentMonth);
  dist.appendChild(tripDayComponent.render());
  let tripDay = dist.querySelector(`#day-${currentDay}-${currentMonth}`);

  for (let point of points) {

    const day = moment(point.time.from).format(`D`);
    const month = moment(point.time.from).format(`MMM`);

    if (currentMonth !== month || currentDay !== day) {
      tripDayComponent = new TripDay(day, month);
      dist.appendChild(tripDayComponent.render());
      tripDay = dist.querySelector(`#day-${day}-${month}`); // // trip-day-${moment(date).format(`DD-MM-YYYY`)}__items
      currentMonth = month;
      currentDay = day;
    }

    renderEvent(tripDay, point);
  }
};

const mainContainer = document.querySelector(`.main`);
const statisticContainer = document.querySelector(`.statistic`);
const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const timeSpendCtx = document.querySelector(`.statistic__time-spend`);

document.querySelector(`.view-switch`).addEventListener(`click`, (evt) => {
  const choosenSwicth = evt.target.innerHTML.toLowerCase();
  switch (choosenSwicth) {
    case `stats`:
      mainContainer.classList.add(`visually-hidden`);
      statisticContainer.classList.remove(`visually-hidden`);
      break;

    case `table`:
      mainContainer.classList.remove(`visually-hidden`);
      statisticContainer.classList.add(`visually-hidden`);
      break;
  }
});

const renderCharts = (data) => {

  const moneyData = new Map();
  const transportData = new Map();
  const timeSpendData = new Map();

  data.forEach((dayData) => {
    dayData.data.forEach((event) => {
      const key = `${event.icon} ${event.title.toUpperCase()}`;
      if (moneyData.has(key)) {
        const currentValue = moneyData.get(key);
        moneyData.set(key, currentValue + event.price);
      } else {
        moneyData.set(key, event.price);
      }
    });
  });

  data.forEach((dayData) => {
    dayData.data.forEach((event) => {
      const key = `${event.icon} ${event.title.toUpperCase()}`;
      if (transportData.has(key)) {
        let currentValue = transportData.get(key);
        transportData.set(key, ++currentValue);
      } else {
        transportData.set(key, 1);
      }
    });
  });

  data.forEach((dayData) => {
    dayData.data.forEach((event) => {
      const key = `${event.icon} ${event.title.toUpperCase()}`;
      if (timeSpendData.has(key)) {
        let currentValue = timeSpendData.get(key);
        timeSpendData.set(key, currentValue + getTimeDifferenceSumm(event.time.duration));
      } else {
        timeSpendData.set(key, getTimeDifferenceSumm(event.time.duration));
      }
    });
  });

  const updateParams = (paramName, paramData) => {
    for (let item of paramData) {
      paramName.data.labels.push(item[0]);
      paramName.data.datasets[0].data.push(item[1]);
    }
  };

  updateParams(moneyParams, moneyData);
  updateParams(transportParams, transportData);
  updateParams(timeSpendParams, timeSpendData);

};

// renderCharts(daysData);

// eslint-disable-next-line no-unused-vars
const moneyChart = new Chart(moneyCtx, moneyParams);
// eslint-disable-next-line no-unused-vars
const transportChart = new Chart(transportCtx, transportParams);
// eslint-disable-next-line no-unused-vars
const timeSpendChart = new Chart(timeSpendCtx, timeSpendParams);
