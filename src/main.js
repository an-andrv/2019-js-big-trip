import {Event} from './event';
import {EventEdit} from './event-edit';
import {TripDay} from './trip-day';
import {Filter} from './filter';
import {RestService} from './rest-service';
import {ChartParam} from './chartParam';

import {filterDays, changeServiceMessage, getTimeDifference} from './utils';
import {SERVER_ADDRESS, AUTHORIZATION, SERVICE_MESSAGE_CONTAINER, Message} from './consts';

import moment from 'moment';
import Chart from 'chart.js';

const filterNames = [`everything`, `future`, `past`];
const filtersSection = document.querySelector(`.trip-filter`);
const tripPointsContainer = document.querySelector(`.trip-points`);

const restService = new RestService({endPoint: SERVER_ADDRESS, authorization: AUTHORIZATION});

// console.log(`getOffers :: `, restService.getPoints()); // 6
// console.log(`getOffers :: `, restService.getOffers()); // 6
// console.log(`getDestinations :: `, restService.getDestinations()); // 28

let daysData = [];
let destinationsData = [];
let offersData = [];

const serverData = [
  restService.getDestinations(),
  restService.getOffers(),
  restService.getPoints()
];

const handleServerData = Promise.all(serverData);

handleServerData
  .then((data) => {
    destinationsData = data[0];
    offersData = data[1];
    daysData = data[2];
    renderTripDay(daysData, tripPointsContainer);
    renderCharts(daysData);
  })
  .catch(() => {
    changeServiceMessage(SERVICE_MESSAGE_CONTAINER, Message.ERROR_MESSAGE);
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

  const blockFormEdit = () => {
    editEventComponent.element.querySelector(`.trip-form`).disabled = true;
    editEventComponent.element.querySelector(`.point__button--save`).disabled = true;
    editEventComponent.element.querySelector(`.point__button--delete`).disabled = true;
  };

  const unblockFormEdit = () => {
    editEventComponent.element.querySelector(`.trip-form`).disabled = false;
    editEventComponent.element.querySelector(`.point__button--save`).disabled = false;
    editEventComponent.element.querySelector(`.point__button--delete`).disabled = false;
  };

  editEventComponent.onSubmit = (newData) => {
    event.id = newData.id;
    event.type = newData.type;
    event.icon = newData.icon;
    event.title = newData.title;
    event.destination = newData.destination;
    event.time.from = newData.time.from;
    event.time.to = newData.time.to;
    event.price = newData.price;
    event.offers = newData.offers;
    event.isFavorite = newData.isFavorite;

    const saveButton = editEventComponent.element.querySelector(`.point__button--save`);

    blockFormEdit();
    changeServiceMessage(saveButton, Message.SAVING_MESSAGE);

    restService.updatePoint({id: event.id, data: event.toRAW()})
      .then((newEvent) => {
        unblockFormEdit();
        eventComponent.update(newEvent);
        eventComponent.render();
        dist.replaceChild(eventComponent.element, editEventComponent.element);
        editEventComponent.unrender();
        updateCharts();
      })
      .catch(() => {
        unblockFormEdit();
        editEventComponent.shake();
        changeServiceMessage(saveButton, Message.SAVE_MESSAGE);
      });

  };

  editEventComponent.onDelete = (id) => {

    const deleteButton = editEventComponent.element.querySelector(`.point__button--delete`);

    blockFormEdit();
    changeServiceMessage(deleteButton, Message.DELETING_MESSAGE);

    restService.deletePoint({id})
      .then(() => {
        unblockFormEdit();
        dist.removeChild(editEventComponent.element);
        editEventComponent.unrender();
        updateCharts();
      })
      .catch(() => {
        unblockFormEdit();
        editEventComponent.shake();
        changeServiceMessage(deleteButton, Message.DELETE_MESSAGE);
      });
  };

};

const renderTripDay = (points, dist) => {
  let currentDay = moment(points[0].time.from).format(`D`);
  let currentMonth = moment(points[0].time.from).format(`MMM`);

  let tripDayComponent = new TripDay(currentDay, currentMonth);
  dist.innerHTML = ``;
  dist.appendChild(tripDayComponent.render());
  let tripDay = dist.querySelector(`#day-${currentDay}-${currentMonth}`);

  for (let point of points) {

    const day = moment(point.time.from).format(`D`);
    const month = moment(point.time.from).format(`MMM`);

    if (currentMonth !== month || currentDay !== day) {
      tripDayComponent = new TripDay(day, month);
      dist.appendChild(tripDayComponent.render());
      tripDay = dist.querySelector(`#day-${day}-${month}`); // trip-day-${moment(date).format(`DD-MM-YYYY`)}__items
      currentMonth = month;
      currentDay = day;
    }

    renderEvent(tripDay, point);
  }
};

const mainContainer = document.querySelector(`.main`);
const statisticContainer = document.querySelector(`.statistic`);

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

const moneyCtx = document.querySelector(`.statistic__money`).getContext(`2d`);
const transportCtx = document.querySelector(`.statistic__transport`).getContext(`2d`);
const timeSpendCtx = document.querySelector(`.statistic__time-spend`).getContext(`2d`);

const moneyData = new Map();
const transportData = new Map();
const timeSpendData = new Map();

let moneyChart;
let transportChart;
let timeChart;

const renderCharts = (data) => {

  moneyData.clear();
  transportData.clear();
  timeSpendData.clear();

  data.forEach((event) => {
    const key = `${event.icon} ${event.title.toUpperCase()}`;
    if (moneyData.has(key)) {
      const currentValue = moneyData.get(key);
      moneyData.set(key, +currentValue + event.price);
    } else {
      moneyData.set(key, event.price);
    }
  });

  data.forEach((event) => {
    const key = `${event.icon} ${event.title.toUpperCase()}`;
    if (transportData.has(key)) {
      let currentValue = transportData.get(key);
      transportData.set(key, ++currentValue);
    } else {
      transportData.set(key, 1);
    }
  });

  data.forEach((event) => {
    const key = `${event.icon} ${event.title.toUpperCase()}`;
    if (timeSpendData.has(key)) {
      let currentDifference = timeSpendData.get(key);
      timeSpendData.set(key, currentDifference + getTimeDifference(event.time.from, event.time.to));
    } else {
      timeSpendData.set(key, getTimeDifference(event.time.from, event.time.to));
    }
  });

  moneyChart = new Chart(moneyCtx, new ChartParam(`MONEY`, moneyData).params);
  transportChart = new Chart(transportCtx, new ChartParam(`TRANSPORT`, transportData).params);
  timeChart = new Chart(timeSpendCtx, new ChartParam(`TIME`, timeSpendData).params);

};

const updateCharts = () => {
  moneyChart.destroy();
  transportChart.destroy();
  timeChart.destroy();
  renderCharts(daysData);
};
