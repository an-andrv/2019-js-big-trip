import {EventComponent} from './event-component';
import moment from 'moment';

export class Event extends EventComponent {
  constructor(data) {
    super();
    // console.log(data);
    this._icon = data.icon;
    this._title = data.title;
    this._destination = data.destination;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;

    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
  }

  _onEditButtonClick() {
    return typeof this._onEdit === `function` && this._onEdit();
  }

  set onEdit(value) {
    this._onEdit = value;
  }

  _makeOffers() {
    const offers = [];
    this._offers.forEach((offer) => {
      if (offer.accepted) {
        offers.push(`
          <li>
            <button class="trip-point__offer">${offer.title} +&euro;&nbsp;20</button>
          </li>
        `);
      }
    });

    return offers.join(``);
  }

  get template() {
    return `
      <span>
        <article class="trip-point">
          <i class="trip-icon">${this._icon}</i>
          <h3 class="trip-point__title">${this._title} ${this._destination}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${this._time.from ? moment(this._time.from).format(`HH:mm`) : ``}&nbsp;&mdash; ${this._time.to ? moment(this._time.to).format(`HH:mm`) : ``}</span>
            <span class="trip-point__duration">${moment(this._time.to - this._time.from - 3 * 60 * 60 * 1000).format(`HH[H] mm[M]`)}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${this._makeOffers()}
          </ul>
        </article>
      </span>
    `.trim();
  }

  bind() {
    this._element.querySelector(`.trip-point`)
      .addEventListener(`click`, this._onEditButtonClick);
  }

  unbind() {
    this._element.querySelector(`.trip-point`)
      .removeEventListener(`click`, this._onEditButtonClick);
  }

  update(data) {
    // console.log(data);
    this._icon = data.icon;
    this._title = data.title;
    this._destination = data.destination;
    this._price = data.price;
    this._offers = data.offers;
  }

}
