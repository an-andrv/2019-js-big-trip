import makeFilter from './make-filter';
import makeEvent from './make-event';
import {getRandomNumber} from './utils';

const filterNames = [`everything`, `future`, `past`];
const filtersSection = document.querySelector(`.trip-filter`);

filterNames.forEach((name) => {
  filtersSection.insertAdjacentHTML(`beforeend`, makeFilter(name));
});

let eventsCount = 7;
const eventsContainer = document.querySelector(`.trip-day__items`);

const renderEvents = (dist, count) => {
  const events = new Array(count)
    .fill()
    .map(makeEvent);
  dist.insertAdjacentHTML(`beforeend`, events.join(``));
};

renderEvents(eventsContainer, eventsCount);

const filterLabels = document.querySelectorAll(`.trip-filter__item`);

[].forEach.call(filterLabels, (label) => {
  label.addEventListener(`click`, () => {

    eventsContainer.innerHTML = ``;

    eventsCount = getRandomNumber(1, 10);
    renderEvents(eventsContainer, eventsCount);
  });
});
