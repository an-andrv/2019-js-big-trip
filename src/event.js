import {EventComponent} from './event-component';

export class Event extends EventComponent {
  constructor(data) {
    super();
    this._icon = data.event.icon;
    this._title = data.event.title;
    this._location = data.event.location;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;

    this._state = {
      // Состояние компонента
    };
    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
  }

  _onEditButtonClick() {
    return typeof this._onEdit === `function` && this._onEdit();
  }

  set onEdit(value) {
    this._onEdit = value;
  }

  makeTags(offersData) {
    const offers = [];
    offersData.forEach((offer) => {
      offers.push(`
        <li>
          <button class="trip-point__offer">${offer} +&euro;&nbsp;20</button>
        </li>
      `);
    });

    return offers.join(``);
  }

  get template() {
    return `
      <article class="trip-point">
        <i class="trip-icon">${this._icon}</i>
        <h3 class="trip-point__title">${this._title} ${this._location}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${this._time.from}&nbsp;&mdash; ${this._time.to}</span>
          <span class="trip-point__duration">${this._time.duration}</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
        <ul class="trip-point__offers">
          ${this.makeTags(this._offers)}
        </ul>
      </article>
    `.trim();
  }

  bind() {
    this._element.querySelector(`.trip-icon`)
      .addEventListener(`click`, this._onEditButtonClick);
  }

  unbind() {
    this._element.querySelector(`.trip-icon`)
      .removeEventListener(`click`, this._onEditButtonClick);
  }

  update(data) {
    this._mapElement = data.mapElement;
    this._icon = data.event.icon;
    this._title = data.event.title;
    this._location = data.event.location;
    this._price = data.price;
    this._offers = data.offers;
  }

}
