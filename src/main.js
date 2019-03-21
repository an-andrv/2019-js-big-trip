import {getRandomNumber} from './utils';
import {makeDayData} from './mock';
import {Event} from './event';
import {EventEdit} from './event-edit';
import {TripDay} from './trip-day';
import {Filter} from './filter';

const FIRST_LOAD_EVENTS_COUNT = 7;

const filterNames = [`everything`, `future`, `past`];
const filtersSection = document.querySelector(`.trip-filter`);

const tripDayInfoContainer = document.querySelector(`.trip-day__info`);
const eventsContainer = document.querySelector(`.trip-day__items`);

filterNames.forEach((name) => {

  const filterComponent = new Filter(name);
  filtersSection.appendChild(filterComponent.render());

  filterComponent.onChangeCount = () => {
    eventsContainer.innerHTML = ``;
    tripDayInfoContainer.innerHTML = ``;

    const randomEventsCount = getRandomNumber(1, 10);
    renderEvents(eventsContainer, randomEventsCount);
  };

});

const renderEvents = (dist, count) => {

  const dayData = makeDayData(count);
  const date = dayData.date;

  dayData.data.forEach((event) => {

    const eventComponent = new Event(event);
    const editEventComponent = new EventEdit(date, event);

    dist.appendChild(eventComponent.render());

    eventComponent.onEdit = () => {
      editEventComponent.render();
      dist.replaceChild(editEventComponent.element, eventComponent.element);
      eventComponent.unrender();
    };

    editEventComponent.onSubmit = (newObject) => {
      event.mapElement = newObject.mapElement;
      event.icon = newObject.icon;
      event.title = newObject.title;
      event.destination = newObject.destination;
      event.time.from = newObject.time.from;
      event.time.to = newObject.time.to;
      event.time.duration = newObject.time.duration;
      event.price = newObject.price;
      event.offers = newObject.offers;

      eventComponent.update(event);
      eventComponent.render();
      dist.replaceChild(eventComponent.element, editEventComponent.element);
      editEventComponent.unrender();
    };

    editEventComponent.onReset = () => {
      eventComponent.render();
      dist.replaceChild(eventComponent.element, editEventComponent.element);
      editEventComponent.unrender();
    };
  });

  const tripDayComponent = new TripDay(date);
  tripDayInfoContainer.appendChild(tripDayComponent.render());
};

renderEvents(eventsContainer, FIRST_LOAD_EVENTS_COUNT);
