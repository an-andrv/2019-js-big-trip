import {eventData} from './mock';

export const makeEvent = () => {
  return `
  <article class="trip-point">
    <i class="trip-icon">${eventData.icon}</i>
    <h3 class="trip-point__title">${eventData.title}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${eventData.time.from}&nbsp;&mdash; ${eventData.time.to}</span>
      <span class="trip-point__duration">${eventData.duration}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${eventData.price}</p>
    <ul class="trip-point__offers">
      <li>
        <button class="trip-point__offer">${eventData.offers} +&euro;&nbsp;20</button>
      </li>
      <li>
        <button class="trip-point__offer">${eventData.offers} +&euro;&nbsp;20</button>
      </li>
    </ul>
  </article>
`;
};

export const makeFullEvent = () => {
  return `
  <article class="trip-point">
    <i class="trip-icon">${eventData.icon}</i>
    <h3 class="trip-point__title">${eventData.title}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${eventData.time.from}&nbsp;&mdash; ${eventData.time.to}</span>
      <span class="trip-point__duration">${eventData.duration}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${eventData.price}</p>
    <ul class="trip-point__offers">
      <li>
        <button class="trip-point__offer">Edit</button>
      </li>
      <li>
        <button class="trip-point__offer">Delete</button>
      </li>
    </ul>
  </article>
`;
};
