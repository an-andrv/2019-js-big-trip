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
import {
  filterDays, changeServiceMessage, sortDays,
  launchViewSwitcher, clearTripDayContainer,
} from './utils';
import {
  SERVER_ADDRESS, AUTHORIZATION, Message,
  FILTER_NAMES, SORT_NAMES, POINTS_STORE_KEY,
  OFFERS_HANDBOOK_STORE_KEY, DESTINATIONS_HANDBOOK_STORE_KEY,
  newPoint,
} from './consts';

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  pointsProvider.syncPoints();
});

const restService = new RestService({endPoint: SERVER_ADDRESS, authorization: AUTHORIZATION});
const localStorage = window.localStorage;

const pointsStore = new PointStore({key: POINTS_STORE_KEY, storage: localStorage});
const pointsProvider = new PointProvider({restService, store: pointsStore, generateId: () => String(Date.now())});
const offersStore = new PointStore({key: OFFERS_HANDBOOK_STORE_KEY, storage: localStorage});
const offersProvider = new PointProvider({restService, store: offersStore, generateId: () => String(Date.now())});
const destinationsStore = new PointStore({key: DESTINATIONS_HANDBOOK_STORE_KEY, storage: localStorage});
const destinationsProvider = new PointProvider({restService, store: destinationsStore, generateId: () => String(Date.now())});

const createdProviders = Promise.all([
  destinationsProvider.getDestinations(),
  offersProvider.getOffers(),
  pointsProvider.getPoints()
]);

let daysData = [];
let destinationsData = [];
let offersData = [];
let charts;

const getDataAndRender = () => {
  createdProviders
  .then((data) => {
    destinationsData = data[0];
    offersData = data[1];
    daysData = data[2];
  })
  .catch(() => {
    changeServiceMessage(Message.ERROR);
  })
  .then(() => {
    activateNewEventButton();
    renderTrip(daysData);
    charts = new Charts(daysData);
    charts.render();
    countTotalCost(daysData);
  });
};

getDataAndRender();

const countTotalCost = (data) => {
  const totalCost = new TotalCost(data);
  totalCost.render();
};

for (const name of FILTER_NAMES) {
  const filterComponent = new Filter(name);
  filterComponent.render();

  filterComponent.onFilter = (filterName) => {
    const filteredDaysData = filterDays(daysData, filterName);
    renderTrip(filteredDaysData);
  };
}

for (const name of SORT_NAMES) {
  const sortComponent = new Sort(name);
  sortComponent.render();

  sortComponent.onSort = (sortName) => {
    const sortingDaysData = sortDays(daysData, sortName);
    renderTrip(sortingDaysData);
  };
}

const activateNewEventButton = () => {
  const newComponent = new PointEdit(newPoint, offersData, destinationsData);
  newComponent.addNewEventButtonListener();

  newComponent.onSubmit = (newData) => {
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

    newComponent.changeSaveButtonMessage(Message.SAVING);
    newComponent.changeSaveButtonDisability(true);

    pointsProvider.createPoint({point: newPoint})
      .then((data) => Promise.all([data]))
      .then(() => {
        newComponent.changeSaveButtonDisability(false);
        newComponent.removeNewEventTemplate();
        newComponent.unrender();
        countTotalCost(daysData);
        charts.updateCharts();
      })
      .catch(() => {
        newComponent.changeSaveButtonDisability(false);
        newComponent.shake();
        newComponent.changeSaveButtonMessage(Message.SAVE);
      });
  };
};

const renderPoint = (dist, point) => {
  const pointComponent = new Point(point);
  const editComponent = new PointEdit(point, offersData, destinationsData);

  dist.appendChild(pointComponent.render());

  pointComponent.onEdit = () => {
    editComponent.render();
    dist.replaceChild(editComponent.element, pointComponent.element);
    pointComponent.unrender();
    countTotalCost(daysData);
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

    editComponent.changeFormEditButtonsDisability(true);
    editComponent.changeSaveButtonMessage(Message.SAVING);
    countTotalCost(daysData);

    pointsProvider.updatePoint({id: point.id, data: point.toRAW()})
      .then((updatedPoint) => {
        editComponent.changeFormEditButtonsDisability(false);
        pointComponent.update(updatedPoint);
        pointComponent.render();
        dist.replaceChild(pointComponent.element, editComponent.element);
        editComponent.unrender();
        charts.updateCharts();
      })
      .catch(() => {
        editComponent.changeFormEditButtonsDisability(false);
        editComponent.shake();
        editComponent.changeSaveButtonMessage(Message.SAVE);
      });

  };

  editComponent.onDelete = (id) => {

    editComponent.changeFormEditButtonsDisability(true);
    editComponent.changeDeleteButtonMessage(Message.DELETING);
    countTotalCost(daysData);

    pointsProvider.deletePoint({id})
      .then(() => {
        editComponent.changeFormEditButtonsDisability(false);
        dist.removeChild(editComponent.element);
        editComponent.unrender();
        charts.updateCharts();
      })
      .catch(() => {
        editComponent.changeFormEditButtonsDisability(false);
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

const renderTrip = (points) => {
  clearTripDayContainer();

  const renderedDates = [];
  let tripDayComponent;
  let tripDay;

  for (const point of points) {

    const date = point.time.from;
    const formattingDate = moment(date).format(`D-MMM-YY`);

    if (!renderedDates.includes(formattingDate)) {
      renderedDates.push(formattingDate);

      tripDayComponent = new TripDay(date);
      tripDayComponent.render();
    }
    tripDay = document.querySelector(`#day-${formattingDate}`);

    renderPoint(tripDay, point);
  }
};

launchViewSwitcher();
