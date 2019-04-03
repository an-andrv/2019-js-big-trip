import moment from 'moment';
import Chart from 'chart.js';

import {Event} from './event';
import {EventEdit} from './event-edit';
import {TripDay} from './trip-day';
import {Filter} from './filter';
import {RestService} from './rest-service';
import {ChartParam} from './chart-param';

import {filterDays, changeServiceMessage, getTimeDifference} from './utils';
import {SERVER_ADDRESS, AUTHORIZATION, Message, FILTER_NAMES} from './consts';

const restService = new RestService({endPoint: SERVER_ADDRESS, authorization: AUTHORIZATION});

// console.log(`getOffers :: `, restService.getPoints()); // 6
// console.log(`getOffers :: `, restService.getOffers()); // 6
// console.log(`getDestinations :: `, restService.getDestinations()); // 28

const tripDayContainer = document.querySelector(`.trip-points`);
const serviceMessageContainer = document.querySelector(`.service-message`);

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
    renderTripDay(daysData, tripDayContainer);
    renderCharts(daysData);
  })
  .catch(() => {
    changeServiceMessage(serviceMessageContainer, Message.ERROR);
  });

const filterContainer = document.querySelector(`.trip-filter`);

for (const name of FILTER_NAMES) {
  const filterComponent = new Filter(name);
  filterContainer.appendChild(filterComponent.render());

  filterComponent.onFilter = (filterName) => {
    const filteredDaysData = filterDays(daysData, filterName);
    tripDayContainer.innerHTML = ``;
    renderTripDay(filteredDaysData, tripDayContainer);
  };
}

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

    restService.updatePoint({id: event.id, data: event.toRAW()})
      .then((newEvent) => {
        unblockFormEdit();
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

    restService.deletePoint({id})
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

};

const renderTripDay = (points, dist) => {
  let currentDay = moment(points[0].time.from).format(`D`);
  let currentMonth = moment(points[0].time.from).format(`MMM`);

  let tripDayComponent = new TripDay(currentDay, currentMonth);
  dist.innerHTML = ``;
  dist.appendChild(tripDayComponent.render());
  let tripDay = dist.querySelector(`#day-${currentDay}-${currentMonth}`);

  for (const point of points) {

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
    const key = `${event.icon} ${event.title.toUpperCase()}`;
    if (moneyData.has(key)) {
      const currentValue = moneyData.get(key);
      moneyData.set(key, +currentValue + event.price);
    } else {
      moneyData.set(key, event.price);
    }
  }

  for (const event of data) {
    const key = `${event.icon} ${event.title.toUpperCase()}`;
    if (transportData.has(key)) {
      let currentValue = transportData.get(key);
      transportData.set(key, ++currentValue);
    } else {
      transportData.set(key, 1);
    }
  }

  for (const event of data) {
    const key = `${event.icon} ${event.title.toUpperCase()}`;
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

// 1.1 Либо нажатием на клавиатуре кнопки «Escape» — если внесённые изменения сохранять не требуется.
// 1.1 После внесения изменений итоговая стоимость путешествия пересчитывается.
// 1.2 Новые точки маршрута добавляются в контейнер .trip-points в соответствующий .trip-day (день события).
//      Новая точка маршрута создаётся нажатием кнопки .new-event.
//      После нажатия .new-event пользователь видит раскрытую форму карточки точки маршрута (режим редактирования), где ему необходимо заполнить ряд полей.
//      Карточка для создания новой точки маршрута появляется в самом начале списка,
//      а после выхода из режима редактирования, к карточке применяются установленный вариант сортировки.
// 1.3 Если сервер не вернул информацию по точкам маршрута, то список остаётся пустым.
// 1.3 Максимальное количество дополнительных опций для колонки .trip-point__offer — 3. Остальные скрыты.
//      Полный набор опций доступен в режиме редактирования точки маршрута.
// 1.3 Формат записи продолжительности зависит от длительности нахождения в точке маршрута:
//      Менее часа: 00M (23M);
//      Менее суток: 00H 00M (02H 44M);
//      Более суток: 00D 00H 00M (01D 02H 30M);
// 1.3 Cортировка точек маршрута в списке при помощи элементов: «Event» (список событий в изначальном порядке), «Time» (временной интервал), «Price» (стоимость).
// 1.4 Кнопка фильтра становится недоступной, если для него нет подходящих точек маршрута (необязательно).
// ДОП Offline режим. Реализуйте в приложении поддержку оффлайн режима.
//      Приложение должно иметь возможность запускаться без интернета и сохранять пользовательский функционал.
//      При появлении интернета все изменения должны отправляться на сервер.

// Б20 интересный,
// ^ * ~ это все служебные вещи, типа «обновляй до посл версии если есть» и тд?
// Только в package-lock.json тоже есть ^, там их оставить?
// Б25
// Б31
// Б39
