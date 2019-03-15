import {createElement} from './utils';

export class TripDay {
  constructor(date) {
    this._date = date;

    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    return `
      <article class="trip-day__info">
        <span class="trip-day__caption">Day</span>
        <p class="trip-day__number">1</p>
        <h2 class="trip-day__title">${this._date}</h2>
      </article>
    `.trim();
  }

  render() {
    this._element = createElement(this.template);
    return this._element;
  }

  unrender() {
    this._element = null;
  }

}
