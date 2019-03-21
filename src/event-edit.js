import {EventComponent} from './event-component';
import {eventsData} from './mock';
import {getRandomNumber} from './utils';
import flatpickr from 'flatpickr';
import moment from 'moment';

export class EventEdit extends EventComponent {
  constructor(date, data) {
    super();
    this._date = date;
    this._mapElement = data.mapElement;
    this._icon = data.event.icon;
    this._title = data.event.title;
    this._location = data.event.location;
    this._picture = data.picture;
    this._description = data.description;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;

    this._onSubmit = null;
    this._onReset = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onResetButtonClick = this._onResetButtonClick.bind(this);

    this._onChangeIcon = this._onChangeIcon.bind(this);
  }

  static createMapper(target) {

    // let fullDate = ``;
    return {
      travelWay: (value) => {
        target.mapElement = eventsData.get(value)
        target.event.icon = target.mapElement.icon;
        target.event.title = target.mapElement.title;
      },
      destination: (value) => target.event.location = value,
      // time: (value) => target.time = value,
      price: (value) => target.price = value,
      offer: (value) => target.offers.push(value),
    };
  }

  _onSubmitButtonClick(evt) {

    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.trip-point`));
    for (const pair of formData.entries()) {
      console.log(pair);
    }
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  _onResetButtonClick(evt) {
    evt.preventDefault();
    return typeof this._onReset === `function` && this._onReset();
  }

  _onChangeIcon(evt) {
    const choosenIcon = evt.target.value;

    if (choosenIcon && choosenIcon !== `on`) {
      this._mapElement = eventsData.get(choosenIcon);
      console.log(this._icon, this._title, this._location, this._offers);
      console.log(this._mapElement);

      this._icon = this._mapElement.icon;
      this._title = this._mapElement.title;
      this._location = this._mapElement.location[getRandomNumber(0, this._mapElement.location.length - 1)];
      this._offers = this._mapElement.offers;
      console.log(this._icon, this._title, this._location, this._offers);

      this._element.querySelector(`.travel-way__label`).innerHTML = this._icon;
      this._element.querySelector(`.point__destination-label`).innerHTML = this._title;
      this._element.querySelector(`.point__destination-input`).value = this._location;
      this._element.querySelector(`.point__offers-wrap`).innerHTML = this._makeOffers(this._offers);
    }
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  _processForm(formData) {
    const entry = {
      mapElement: ``,
      event: {
        icon: ``,
        title: ``,
        location: ``,
      },
      time: ``,
      price: ``,
      offers: [],
    
    };

    const eventEditMapper = EventEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (eventEditMapper[property]) {
        eventEditMapper[property](value);
      }
    }

    return entry;
  }

  set onSubmit(value) {
    this._onSubmit = value;
  }

  set onReset(value) {
    this._onReset = value;
  }

  _makeOffers(offersData) {
    const offers = [];
    offersData.forEach((offer) => {
      offers.push(`
        <input class="point__offers-input visually-hidden" type="checkbox" id="add-luggage" name="offer" value="add-luggage">
        <label for="add-luggage" class="point__offers-label">
          <span class="point__offer-service">${offer}</span> + €<span class="point__offer-price">30</span>
        </label>
      `);
    });

    return offers.join(``);
  }


  get template() {
    return `
      <article class="point">
        <form action="" method="get">
          <header class="point__header">
            <label class="point__date">
              choose day
              <input class="point__input" type="text" placeholder="${this._date}" name="day">
            </label>
      
            <div class="travel-way">
              <label class="travel-way__label" for="travel-way__toggle">${this._icon}</label>
      
              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">
      
              <div class="travel-way__select">
                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travelWay" value="taxi">
                  <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travelWay" value="bus">
                  <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travelWay" value="train">
                  <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travelWay" value="flight" checked>
                  <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>      
                  
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-ship" name="travelWay" value="ship" checked>
                  <label class="travel-way__select-label" for="travel-way-ship">🛳️ ship</label>      
                  
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-transport" name="travelWay" value="transport" checked>
                  <label class="travel-way__select-label" for="travel-way-transport">🚊 transport</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-drive" name="travelWay" value="drive" checked>
                  <label class="travel-way__select-label" for="travel-way-drive">🚗 drive</label>
                </div>
      
                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travelWay" value="check-in">
                  <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travelWay" value="sight-seeing">
                  <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
                  
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-restaurant" name="travelWay" value="restaurant">
                  <label class="travel-way__select-label" for="travel-way-restaurant">🍴 restaurant</label>
                </div>
              </div>
            </div>
      
            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination">${this._title}</label>
              <input class="point__destination-input" list="destination-select" id="destination" value="${this._location}" name="destination">
              <datalist id="destination-select">
                <option value="airport"></option>
                <option value="Geneva"></option>
                <option value="Chamonix"></option>
                <option value="hotel"></option>
              </datalist>
            </div>
      
            <label class="point__time">
              choose time
              <input class="point__input" type="text" value="" name="time" placeholder="">
            </label>
      
            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input class="point__input" type="text" value="${this._price}" name="price">
            </label>
      
            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              <button class="point__button" type="reset">Delete</button>
            </div>
      
            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
              <label class="point__favorite" for="favorite">favorite</label>
            </div>
          </header>
      
          <section class="point__details">
            <section class="point__offers">
              <h3 class="point__details-title">offers</h3>
      
              <div class="point__offers-wrap">
                ${this._makeOffers(this._offers)}
              </div>
      
            </section>
            <section class="point__destination">
              <h3 class="point__details-title">Destination</h3>
              <p class="point__destination-text">${this._description}</p>
              <div class="point__destination-images">
                <img src="${this._picture}" alt="picture from place" class="point__destination-image">
              </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
          </section>
        </form>
      </article>
    `.trim();
  }

  bind() {
    this._element.querySelector(`form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`form`)
      .addEventListener(`reset`, this._onResetButtonClick);
    this._element.querySelector(`.trip-point`)
      .addEventListener(`change`, this._onChangeIcon);

    flatpickr(this._element.querySelector(`.point__time`),{mode: "range", dateFormat: "j F", defaultDate: ["00:00", "00:00"]});

  }

  unbind() {
    this._element.querySelector(`form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`form`)
      .removeEventListener(`reset`, this._onResetButtonClick);
    this._element.querySelector(`form`)
      .removeEventListener(`change`, this._onChangeIcon);
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
