import {getRandomNumber} from './utils';
import {makeDayData} from './mock';
import {Event} from './event';
import {EventEdit} from './event-edit';
import {TripDay} from './trip-day';
import {Filter} from './filter';

const filterNames = [`everything`, `future`, `past`];
const filtersSection = document.querySelector(`.trip-filter`);

filterNames.forEach((name) => {

  const filterComponent = new Filter(name);
  filtersSection.appendChild(filterComponent.render());

  filterComponent.onChangeCount = () => {
    eventsContainer.innerHTML = ``;

    const randomEventsCount = getRandomNumber(1, 10);
    renderEvents(eventsContainer, randomEventsCount);
  }
  
});

const FIRST_LOAD_EVENTS_COUNT = 7;
const eventsContainer = document.querySelector(`.trip-day__items`);
const tripDayContainer = document.querySelector(`.trip-day`);

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

    editEventComponent.onSubmit = () => {
      eventComponent.render();
      dist.replaceChild(eventComponent.element, editEventComponent.element);
      editEventComponent.unrender();
    };
  });

  const tripDayComponent = new TripDay(date);
  tripDayContainer.insertBefore(tripDayComponent.render(), dist);
};

renderEvents(eventsContainer, FIRST_LOAD_EVENTS_COUNT);
