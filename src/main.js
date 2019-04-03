import {Event} from './event';
import {EventEdit} from './event-edit';
import {TripDay} from './trip-day';
import {Filter} from './filter';
import {RestService} from './rest-service';
import {ChartParam} from './chartParam';

import {filterDays, changeServiceMessage, getTimeDifference} from './utils';
import * as consts from './consts';

import moment from 'moment';
import Chart from 'chart.js';

const restService = new RestService({endPoint: consts.SERVER_ADDRESS, authorization: consts.AUTHORIZATION});

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
    renderTripDay(daysData, consts.TRIP_DAY_CONTAINER);
    renderCharts(daysData);
  })
  .catch(() => {
    changeServiceMessage(consts.SERVICE_MESSAGE_CONTAINER, consts.Message.ERROR_MESSAGE);
  });

consts.FILTER_NAMES.forEach((name) => {
  const filterComponent = new Filter(name);
  consts.FILTERS_CONTAINER.appendChild(filterComponent.render());

  filterComponent.onFilter = (filterName) => {
    const filteredDaysData = filterDays(daysData, filterName);
    consts.TRIP_DAY_CONTAINER.innerHTML = ``;
    renderTripDay(filteredDaysData, consts.TRIP_DAY_CONTAINER);
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
    changeServiceMessage(saveButton, consts.Message.SAVING_MESSAGE);

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
        changeServiceMessage(saveButton, consts.Message.SAVE_MESSAGE);
      });

  };

  editEventComponent.onDelete = (id) => {

    const deleteButton = editEventComponent.element.querySelector(`.point__button--delete`);

    blockFormEdit();
    changeServiceMessage(deleteButton, consts.Message.DELETING_MESSAGE);

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
        changeServiceMessage(deleteButton, consts.Message.DELETE_MESSAGE);
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
      tripDay = dist.querySelector(`#day-${day}-${month}`);
      currentMonth = month;
      currentDay = day;
    }

    renderEvent(tripDay, point);
  }
};


consts.VIEW_SWICTHER.addEventListener(`click`, (evt) => {
  const choosenSwicth = evt.target.innerHTML.toLowerCase();
  switch (choosenSwicth) {
    case `stats`:
      consts.MAIN_CONTAINER.classList.add(`visually-hidden`);
      consts.STATISTICS_CONTAINER.classList.remove(`visually-hidden`);
      break;

    case `table`:
      consts.MAIN_CONTAINER.classList.remove(`visually-hidden`);
      consts.STATISTICS_CONTAINER.classList.add(`visually-hidden`);
      break;
  }
});

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

  moneyChart = new Chart(consts.MONEY_STATISTICS_CONTAINER, new ChartParam(`MONEY`, moneyData).params);
  transportChart = new Chart(consts.TRANSPORT_STATISTICS_CONTAINER, new ChartParam(`TRANSPORT`, transportData).params);
  timeChart = new Chart(consts.TIME_STATISTICS_CONTAINER, new ChartParam(`TIME`, timeSpendData).params);

};

const updateCharts = () => {
  moneyChart.destroy();
  transportChart.destroy();
  timeChart.destroy();
  renderCharts(daysData);
};
