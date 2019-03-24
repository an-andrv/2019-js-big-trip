import {EventComponent} from './event-component';
import moment from 'moment';

export class TripDay extends EventComponent {
  constructor(date) {
    super();
    this._date = date;
  }

  get template() {
    return `
      <section class="trip-day">
        <article class="trip-day__info">
          <span>
            <span class="trip-day__caption">Day</span>
            <p class="trip-day__number">1</p>
            <h2 class="trip-day__title">${moment(this._date).format(`MMM D`)}</h2>
          </span>
        </article>
        <div class="trip-day__items" id="day-${moment(this._date).format(`DD-MM-YYYY`)}">
        </div>
      </section>
    `.trim();
  }

}
