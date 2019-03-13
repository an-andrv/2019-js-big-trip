import makeFilter from './make-filter';
import makeEvent from './make-event';
import makeDayEvents from './make-day-events';
import {getRandomNumber} from './utils';
import {makeDayData} from './mock';

const filterNames = [`everything`, `future`, `past`];
const filtersSection = document.querySelector(`.trip-filter`);

filterNames.forEach((name) => {
  filtersSection.insertAdjacentHTML(`beforeend`, makeFilter(name));
});

const FIRST_LOAD_EVENTS_COUNT = 7;
const eventsContainer = document.querySelector(`.trip-points`);

const renderEvents = (dist, count) => {

  const dayData = makeDayData(count);
  const events = [];

  dayData.data.forEach((event) => {
    events.push(makeEvent(event));
  });

  const dayEvents = makeDayEvents(dayData.date, events);
  dist.insertAdjacentHTML(`beforeend`, dayEvents);
};

renderEvents(eventsContainer, FIRST_LOAD_EVENTS_COUNT);

const filterLabels = document.querySelectorAll(`.trip-filter__item`);

[].forEach.call(filterLabels, (label) => {
  label.addEventListener(`click`, () => {

    eventsContainer.innerHTML = ``;

    const randomEventsCount = getRandomNumber(1, 10);
    renderEvents(eventsContainer, randomEventsCount);
  });
});
