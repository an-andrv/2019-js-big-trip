import {Component} from './component';
import moment from 'moment';
import {POINTS_LIST} from './consts';

export class Event extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._icon = POINTS_LIST[this._type].icon || ``;
    this._title = POINTS_LIST[this._type].title || ``;
    this._destination = data.destination;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;

    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
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

  set onEdit(value) {
    this._onEdit = value;
  }

  update(data) {
    this._type = data.type;
    this._icon = POINTS_LIST[this._type].icon;
    this._title = POINTS_LIST[this._type].title;
    this._destination = data.destination;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
  }

  _makeOffers() {
    const offers = [];
    for (const offer of this._offers) {
      if (offer.accepted) {
        offers.push(`
          <li>
            <button class="trip-point__offer">${offer.title} +&euro;&nbsp;20</button>
          </li>
        `);
      }
    }

    return offers.join(``);
  }

  bind() {
    this._element.querySelector(`.trip-point`)
      .addEventListener(`click`, this._onEditButtonClick);
  }

  unbind() {
    this._element.querySelector(`.trip-point`)
      .removeEventListener(`click`, this._onEditButtonClick);
  }

  _onEditButtonClick() {
    return typeof this._onEdit === `function` && this._onEdit();
  }

}
