import {Component} from './component';
import moment from 'moment';

export class TripDay extends Component {
  constructor(date) {
    super();

    this._fullDate = moment(date).format(`D-MMM-YY`);
    this._day = moment(date).format(`D`);
    this._monthYear = moment(date).format(`MMM YY`);
  }

  get template() {
    return `
      <section class="trip-day">
        <article class="trip-day__info">
          <span>
            <span class="trip-day__caption">Day</span>
            <p class="trip-day__number">${this._day}</p>
            <h2 class="trip-day__title">${this._monthYear}</h2>
          </span>
        </article>
        <div class="trip-day__items" id="day-${this._fullDate}">
        </div>
      </section>
    `.trim();
  }

}
