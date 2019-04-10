import moment from 'moment';
import Chart from 'chart.js';

import {Event} from './event';
import {EventEdit} from './event-edit';
import {TripDay} from './trip-day';
import {Filter} from './filter';
import {Sort} from './sort';
import {TotalCost} from './total-cost';
import {RestService} from './rest-service';
import {ChartParam} from './chart-param';
import {PointStore} from './point-store';
import {PointProvider} from './point-provider';

import {filterDays, changeServiceMessage, getTimeDifference, sortDays} from './utils';
import {
  SERVER_ADDRESS, AUTHORIZATION, Message,
  FILTER_NAMES, SORT_NAMES, POINTS_LIST,
  POINTS_STORE_KEY, OFFERS_HANDBOOK_STORE_KEY, DESTINATIONS_HANDBOOK_STORE_KEY,
} from './consts';

const restService = new RestService({endPoint: SERVER_ADDRESS, authorization: AUTHORIZATION});

const localStorage = window.localStorage;

const pointsStore = new PointStore({key: POINTS_STORE_KEY, storage: localStorage});
const pointsProvider = new PointProvider({restService, store: pointsStore, generateId: () => String(Date.now())});
const offersStore = new PointStore({key: OFFERS_HANDBOOK_STORE_KEY, storage: localStorage});
const offersProvider = new PointProvider({restService, store: offersStore, generateId: () => String(Date.now())});
const destinationsStore = new PointStore({key: DESTINATIONS_HANDBOOK_STORE_KEY, storage: localStorage});
const destinationsProvider = new PointProvider({restService, store: destinationsStore, generateId: () => String(Date.now())});

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  pointsProvider.syncPoints();
});

const tripDayContainer = document.querySelector(`.trip-points`);
const serviceMessageContainer = document.querySelector(`.service-message`);

let daysData = [];
let destinationsData = [];
let offersData = [];

const createdProviders = Promise.all([
  destinationsProvider.getDestinations(),
  offersProvider.getOffers(),
  pointsProvider.getPoints()
]);

const getDataAndRender = () => {
  createdProviders
  .then((data) => {
    destinationsData = data[0];
    offersData = data[1];
    daysData = data[2];
    renderTrip(daysData, tripDayContainer);
    renderCharts(daysData);
    countTotalCost(daysData);
  })
  .catch(() => {
    changeServiceMessage(serviceMessageContainer, Message.ERROR);
  });
};

getDataAndRender();

const countTotalCost = (data) => {
  const totalCostContainer = document.querySelector(`.trip`);
  const totalCost = new TotalCost(data);
  totalCostContainer.appendChild(totalCost.render());
};

const filterContainer = document.querySelector(`.trip-filter`);
for (const name of FILTER_NAMES) {
  const filterComponent = new Filter(name);
  filterContainer.appendChild(filterComponent.render());

  filterComponent.onFilter = (filterName) => {
    const filteredDaysData = filterDays(daysData, filterName);
    tripDayContainer.innerHTML = ``;
    renderTrip(filteredDaysData, tripDayContainer);
  };
}

const sortContainer = document.querySelector(`.trip-sorting`);
const offerSort = sortContainer.querySelector(`.trip-sorting__item--offers`);
for (const name of SORT_NAMES) {
  const sortComponent = new Sort(name);
  sortContainer.insertBefore(sortComponent.render(), offerSort);

  sortComponent.onSort = (sortName) => {
    const sortingDaysData = sortDays(daysData, sortName);
    tripDayContainer.innerHTML = ``;
    renderTrip(sortingDaysData, tripDayContainer);
  };
}

const newEventButton = document.querySelector(`.trip-controls__new-event`);
newEventButton.addEventListener(`click`, () => {

  const newEvent = {
    id: ``,
    type: `taxi`,
    destination: `Chamonix`,
    time: {
      from: ``,
      to: ``,
    },
    price: ``,
    offers: [],
    isFavorite: ``
  };

  const editComponent = new EventEdit(newEvent, offersData, destinationsData);
  tripDayContainer.insertBefore(editComponent.render(), tripDayContainer.querySelector(`.trip-day`));
  editComponent.element.querySelector(`.point__button--delete`).remove();
  newEventButton.disabled = true;

  editComponent.onSubmit = (newData) => {
    const choosenDestination = destinationsData.find((descriptionData) => descriptionData.name === newData.destination);

    newEvent.id = newData.id;
    newEvent.type = newData.type;
    newEvent.destination = {
      name: newData.destination,
      description: choosenDestination ? choosenDestination.description : ``,
      pictures: choosenDestination ? choosenDestination.pictures : [],
    };
    newEvent[`date_from`] = newData.time.from;
    newEvent[`date_to`] = newData.time.to;
    newEvent[`base_price`] = newData.price;
    newEvent.offers = newData.offers;
    newEvent[`is_favorite`] = newData.isFavorite;

    const saveButton = editComponent.element.querySelector(`.point__button--save`);
    changeServiceMessage(saveButton, Message.SAVING);
    saveButton.disabled = true;

    pointsProvider.createPoint({point: newEvent})
      .then((data) => Promise.all([data]))
      .then(() => {
        editComponent.element.querySelector(`.point__button--save`).disabled = false;
        newEventButton.disabled = false;

        tripDayContainer.removeChild(editComponent.element);
        editComponent.unrender();
      })
      .catch(() => {
        editComponent.element.querySelector(`.point__button--save`).disabled = false;
        editComponent.shake();
        changeServiceMessage(saveButton, Message.SAVE);
      });
  };
});

const renderEvent = (dist, event) => {
  const eventComponent = new Event(event);
  const editComponent = new EventEdit(event, offersData, destinationsData);

  dist.appendChild(eventComponent.render());

  eventComponent.onEdit = () => {
    editComponent.render();
    dist.replaceChild(editComponent.element, eventComponent.element);
    eventComponent.unrender();
  };

  const blockFormEdit = () => {
    editComponent.element.querySelector(`.trip-form`).disabled = true;
    editComponent.element.querySelector(`.point__button--save`).disabled = true;
    editComponent.element.querySelector(`.point__button--delete`).disabled = true;
  };

  const unblockFormEdit = () => {
    editComponent.element.querySelector(`.trip-form`).disabled = false;
    editComponent.element.querySelector(`.point__button--save`).disabled = false;
    editComponent.element.querySelector(`.point__button--delete`).disabled = false;
  };

  editComponent.onSubmit = (newData) => {
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
    const saveButton = editComponent.element.querySelector(`.point__button--save`);

    blockFormEdit();
    changeServiceMessage(saveButton, Message.SAVING);

    pointsProvider.updatePoint({id: event.id, data: event.toRAW()})
      .then((newEvent) => {
        eventComponent.update(newEvent);
        eventComponent.render();
        dist.replaceChild(eventComponent.element, editComponent.element);
        editComponent.unrender();
        updateCharts();
      })
      .catch(() => {
        unblockFormEdit();
        editComponent.shake();
        changeServiceMessage(saveButton, Message.SAVE);
      });

  };

  editComponent.onDelete = (id) => {

    const deleteButton = editComponent.element.querySelector(`.point__button--delete`);

    blockFormEdit();
    changeServiceMessage(deleteButton, Message.DELETING);

    pointsProvider.deletePoint({id})
      .then(() => {
        unblockFormEdit();
        dist.removeChild(editComponent.element);
        editComponent.unrender();
        updateCharts();
      })
      .catch(() => {
        unblockFormEdit();
        editComponent.shake();
        changeServiceMessage(deleteButton, Message.DELETE);
      });
  };

  editComponent.onKeyDown = (keyCode) => {

    if (keyCode === 27) {
      eventComponent.render();
      dist.replaceChild(eventComponent.element, editComponent.element);
      editComponent.unrender();
    }
  };

};

const renderTrip = (points, dist) => {
  dist.innerHTML = ``;
  const renderedDates = [];

  let tripDayComponent;
  let tripDay;

  for (const point of points) {

    const date = point.time.from;
    const formattingDate = moment(date).format(`D-MMM-YY`);

    if (!renderedDates.includes(formattingDate)) {
      renderedDates.push(formattingDate);

      tripDayComponent = new TripDay(date);
      dist.appendChild(tripDayComponent.render());
    }
    tripDay = dist.querySelector(`#day-${formattingDate}`);

    renderEvent(tripDay, point);
  }
};

const mainContainer = document.querySelector(`.main`);
const viewSwitcher = document.querySelector(`.view-switch`);
const statisticContainer = document.querySelector(`.statistic`);

viewSwitcher.addEventListener(`click`, (evt) => {
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

const moneyStatiscticContainer = document.querySelector(`.statistic__money`);
const transportStatiscticContainer = document.querySelector(`.statistic__transport`);
const timeStatiscticContainer = document.querySelector(`.statistic__time-spend`);

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

  for (const event of data) {
    const icon = POINTS_LIST[event.type].icon;
    const title = POINTS_LIST[event.type].title;
    const key = `${icon} ${title.toUpperCase()}`;

    if (moneyData.has(key)) {
      const currentValue = moneyData.get(key);
      moneyData.set(key, +currentValue + event.price);
    } else {
      moneyData.set(key, event.price);
    }

    if (transportData.has(key)) {
      let currentValue = transportData.get(key);
      transportData.set(key, ++currentValue);
    } else {
      transportData.set(key, 1);
    }

    if (timeSpendData.has(key)) {
      let currentDifference = timeSpendData.get(key);
      timeSpendData.set(key, currentDifference + getTimeDifference(event.time.from, event.time.to));
    } else {
      timeSpendData.set(key, getTimeDifference(event.time.from, event.time.to));
    }
  }

  const moneyParams = new ChartParam(`MONEY`, moneyData).params;
  const transportParams = new ChartParam(`TRANSPORT`, transportData).params;
  const timesParams = new ChartParam(`TIME`, timeSpendData).params;

  moneyChart = new Chart(moneyStatiscticContainer.getContext(`2d`), moneyParams);
  transportChart = new Chart(transportStatiscticContainer.getContext(`2d`), transportParams);
  timeChart = new Chart(timeStatiscticContainer.getContext(`2d`), timesParams);

};

const updateCharts = () => {
  moneyChart.destroy();
  transportChart.destroy();
  timeChart.destroy();
  renderCharts(daysData);
};
