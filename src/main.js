import moment from 'moment';

import {Point} from './point';
import {PointEdit} from './point-edit';
import {TripDay} from './trip-day';
import {Filter} from './filter';
import {Sort} from './sort';
import {TotalCost} from './total-cost';
import {RestService} from './rest-service';
import {Charts} from './charts';
import {PointStore} from './point-store';
import {PointProvider} from './point-provider';

import {filterDays, changeServiceMessage, sortDays, launchViewSwitcher} from './utils';
import {
  SERVER_ADDRESS, AUTHORIZATION, Message,
  FILTER_NAMES, SORT_NAMES, POINTS_STORE_KEY,
  OFFERS_HANDBOOK_STORE_KEY, DESTINATIONS_HANDBOOK_STORE_KEY,
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

let daysData = [];
let destinationsData = [];
let offersData = [];
let charts;

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
    charts = new Charts(daysData);
    charts.render();
    countTotalCost(daysData);
  })
  .catch(() => {
    changeServiceMessage(Message.ERROR);
  });
};

getDataAndRender();

const countTotalCost = (data) => {
  const totalCostContainer = document.querySelector(`.trip`);
  const totalCost = new TotalCost(data); // const totalCostContainer = document.querySelector(`.trip`);
  totalCostContainer.appendChild(totalCost.render());
};

const filterContainer = document.querySelector(`.trip-filter`);
for (const name of FILTER_NAMES) {
  const filterComponent = new Filter(name); // const filterContainer = document.querySelector(`.trip-filter`);
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
  const sortComponent = new Sort(name); // const sortContainer = document.querySelector(`.trip-sorting`);
  sortContainer.insertBefore(sortComponent.render(), offerSort);

  sortComponent.onSort = (sortName) => {
    const sortingDaysData = sortDays(daysData, sortName);
    tripDayContainer.innerHTML = ``;
    renderTrip(sortingDaysData, tripDayContainer);
  };
}

const newPointButton = document.querySelector(`.trip-controls__new-event`);
newPointButton.addEventListener(`click`, () => {

  const newPoint = {
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

  const editComponent = new PointEdit(newPoint, offersData, destinationsData); // добавить может метод const newPointButton = document.querySelector(`.trip-controls__new-event`);
  tripDayContainer.insertBefore(editComponent.render(), tripDayContainer.querySelector(`.trip-day`)); // !!!! const tripDayContainer = document.querySelector(`.trip-points`);
  editComponent.element.querySelector(`.point__button--delete`).remove();
  newPointButton.disabled = true;

  editComponent.onSubmit = (newData) => {
    const choosenDestination = destinationsData.find((descriptionData) => descriptionData.name === newData.destination);

    newPoint.id = newData.id;
    newPoint.type = newData.type;
    newPoint.destination = {
      name: newData.destination,
      description: choosenDestination ? choosenDestination.description : ``,
      pictures: choosenDestination ? choosenDestination.pictures : [],
    };
    newPoint[`date_from`] = newData.time.from;
    newPoint[`date_to`] = newData.time.to;
    newPoint[`base_price`] = newData.price;
    newPoint.offers = newData.offers;
    newPoint[`is_favorite`] = newData.isFavorite;

    const saveButton = editComponent.element.querySelector(`.point__button--save`);
    editComponent.changeSaveButtonMessage(Message.SAVING);
    saveButton.disabled = true;

    pointsProvider.createPoint({point: newPoint})
      .then((data) => Promise.all([data]))
      .then(() => {
        editComponent.element.querySelector(`.point__button--save`).disabled = false;
        newPointButton.disabled = false;

        tripDayContainer.removeChild(editComponent.element);
        editComponent.unrender();
      })
      .catch(() => {
        editComponent.element.querySelector(`.point__button--save`).disabled = false;
        editComponent.shake();
        editComponent.changeSaveButtonMessage(Message.SAVE);
      });
  };
});

const renderPoint = (dist, point) => {
  const pointComponent = new Point(point);
  const editComponent = new PointEdit(point, offersData, destinationsData);

  dist.appendChild(pointComponent.render());

  pointComponent.onEdit = () => {
    editComponent.render();
    dist.replaceChild(editComponent.element, pointComponent.element);
    pointComponent.unrender();
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
    point.id = newData.id;
    point.type = newData.type;
    point.icon = newData.icon;
    point.title = newData.title;
    point.destination = newData.destination;
    point.time.from = newData.time.from;
    point.time.to = newData.time.to;
    point.price = newData.price;
    point.offers = newData.offers;
    point.isFavorite = newData.isFavorite;

    blockFormEdit();
    editComponent.changeSaveButtonMessage(Message.SAVING);

    pointsProvider.updatePoint({id: point.id, data: point.toRAW()})
      .then((newPoint) => {
        unblockFormEdit();
        pointComponent.update(newPoint);
        pointComponent.render();
        dist.replaceChild(pointComponent.element, editComponent.element);
        editComponent.unrender();
        charts.updateCharts();
      })
      .catch(() => {
        unblockFormEdit();
        editComponent.shake();
        editComponent.changeSaveButtonMessage(Message.SAVE);
      });

  };

  editComponent.onDelete = (id) => {

    blockFormEdit();
    editComponent.changeDeleteButtonMessage(Message.DELETING);

    pointsProvider.deletePoint({id})
      .then(() => {
        unblockFormEdit();
        dist.removeChild(editComponent.element);
        editComponent.unrender();
        charts.updateCharts();
      })
      .catch(() => {
        unblockFormEdit();
        editComponent.shake();
        editComponent.changeDeleteButtonMessage(Message.DELETE);
      });
  };

  editComponent.onKeyDown = (keyCode) => {

    if (keyCode === 27) {
      pointComponent.render();
      dist.replaceChild(pointComponent.element, editComponent.element);
      editComponent.unrender();
    }
  };

};

const renderTrip = (points, dist) => { // const tripDayContainer = document.querySelector(`.trip-points`);
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

    renderPoint(tripDay, point);
  }
};

launchViewSwitcher();
