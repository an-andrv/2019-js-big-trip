import {EventComponent} from './event-component';

export class TripDay extends EventComponent {
  constructor(day, month) {
    super();
    this._day = day;
    this._month = month;
  }

  get template() {
    return `
      <section class="trip-day">
        <article class="trip-day__info">
          <span>
            <span class="trip-day__caption">Day</span>
            <p class="trip-day__number">${this._day}</p>
            <h2 class="trip-day__title">${this._month} ${this._day}</h2>
          </span>
        </article>
        <div class="trip-day__items" id="day-${this._day}-${this._month}">
        </div>
      </section>
    `.trim();
  }

}
