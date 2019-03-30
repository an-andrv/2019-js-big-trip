import {EventComponent} from './event-component';
import {eventsData} from './mock';
import flatpickr from 'flatpickr';
import {getFormatTimeDifference} from './utils';

export class EventEdit extends EventComponent {
  constructor(data) {
    super();
    console.log(data);
    this._id = data.id;
    this._type = data.type;
    this._icon = data.icon;
    this._title = data.title;
    this._destination = data.destination;
    this._picture = data.picture; // массив объектов
    this._description = data.description;
    this._time = data.time; // from to
    this._price = data.price;
    this._offers = data.offers; // массив

    this._isDeleted = data.isDeleted;
    // isFavorite: false

    this._onSubmit = null;
    this._onDelete = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onChangeIcon = this._onChangeIcon.bind(this);
  }

  static createMapper(target) {
    return {
      travelWay: (value) => {
        target.mapElement = eventsData.get(value);
        target.icon = target.mapElement.icon;
        target.title = target.mapElement.title;
      },
      destination: (value) => {
        target.destination = value;
      },
      timeFrom: (value) => {
        target.time.from = value;
      },
      timeTo: (value) => {
        target.time.to = value;
      },
      price: (value) => {
        target.price = value;
      },
      offer: (value) => target.offers.push(value),
    };
  }

  _processForm(formData) {
    const entry = {
      type: ``,
      icon: ``,
      title: ``,
      destination: ``,
      time: {
        from: ``,
        to: ``,
      },
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

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.trip-form`));
    for (let pair of formData.entries()) {
      console.log(pair);
    }
    const newData = this._processForm(formData);

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
    this.update(newData);
  }

  _onDeleteButtonClick() {
    this._isDeleted = true;
    return typeof this._onDelete === `function` && this._onDelete(this._isDeleted);
  }

  _onChangeDate() {
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onChangeIcon(evt) {
    const choosenIcon = evt.target.value;

    if (choosenIcon && choosenIcon !== `on`) {
      this._mapElement = eventsData.get(choosenIcon);
      this._icon = this._mapElement.icon;
      this._title = this._mapElement.title;
      this._destination = this._mapElement.destination;
      this._offers = this._mapElement.offers;

      this._element.querySelector(`.travel-way__label`).innerHTML = this._icon;
      this._element.querySelector(`.point__destination-label`).innerHTML = this._title;
      this._element.querySelector(`.point__destination-input`).value = this._destination[0];
      this._element.querySelector(`.point__offers-wrap`).innerHTML = this._makeOffers(this._offers);
      this._element.querySelector(`#destination-select`).innerHTML = this._makeDestinationDatalist(this._mapElement.destination);

      this._element.querySelector(`.travel-way__toggle`).checked = false;
    }
  }

  set onSubmit(value) {
    this._onSubmit = value;
  }

  set onDelete(value) {
    this._onDelete = value;
  }

  _makeDestinationDatalist(destinationsData) {
    const destinations = [];
    destinationsData.forEach((destination) => {
      destinations.push(`
        <option value="${destination}"></option>
      `);
    });

    return destinations.join(``);
  }

  _makeOffers(offersData) {
    const offers = [];
    offersData.forEach((offer, index) => {
      offers.push(`
        <input class="point__offers-input visually-hidden" type="checkbox" id="offer-${index}" name="offer" value="${offer}" ${offer.accepted ? `checked` : ``}>
        <label for="offer-${index}" class="point__offers-label">
          <span class="point__offer-service">${offer.title}</span> + €<span class="point__offer-price">${offer.price}</span>
        </label>
      `);
    });

    return offers.join(``);
  }

  _makePicturesList(urls) {
    const destinations = [];
    urls.forEach((url) => {
      destinations.push(`
        <img src="${url.src}" alt="${url.description}" class="point__destination-image">
      `);
    });

    return destinations.join(``);
  }

  get template() {
    return `
      <article class="point">
        <form action="" class="trip-form" method="get">
          <header class="point__header">
            <label class="point__date">
              choose day
              <input class="point__input" type="text" placeholder="" name="day">
            </label>
      
            <div class="travel-way">
              <label class="travel-way__label" for="travel-way__toggle">${this._icon}</label>
      
              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">
      
              <div class="travel-way__select">
                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travelWay" value="taxi" ${ this._icon === `🚕` ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travelWay" value="bus" ${ this._icon === `🚌` ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travelWay" value="train" ${ this._icon === `🚂` ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travelWay" value="flight" ${ this._icon === `✈` ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-flight">✈ flight</label>      
                  
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-ship" name="travelWay" value="ship" ${ this._icon === `🛳️` ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-ship">🛳️ ship</label>      
                  
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-transport" name="travelWay" value="transport" ${ this._icon === `🚊` ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-transport">🚊 transport</label>

                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-drive" name="travelWay" value="drive" ${ this._icon === `🚗` ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-drive">🚗 drive</label>
                </div>
      
                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travelWay" value="check-in" ${ this._icon === `🏨` ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travelWay" value="sightseeing" ${ this._icon === `🏛` ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
                  
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-restaurant" name="travelWay" value="restaurant" ${ this._icon === `🍴` ? `checked` : ``}>
                  <label class="travel-way__select-label" for="travel-way-restaurant">🍴 restaurant</label>
                </div>
              </div>
            </div>
      
            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination">${this._title}</label>
              <input class="point__destination-input" list="destination-select" id="destination" value="${this._destination}" name="destination">
              <datalist id="destination-select">
              </datalist>
            </div>
      
            <label class="point__time ">
              choose time                      
              <input class="point__input point__time-from" type="text" value="${this._time.from}" name="timeFrom" placeholder="19:00">                    
              <input class="point__input point__time-to" type="text" value="${this._time.to}" name="timeTo" placeholder="21:00">
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
                ${this._makePicturesList(this._picture)}
              </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
          </section>
        </form>
      </article>
    `.trim();
  }

  bind() {
    this._element.querySelector(`.trip-form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.trip-form`)
      .addEventListener(`reset`, this._onDeleteButtonClick);
    this._element.querySelector(`.travel-way`)
      .addEventListener(`change`, this._onChangeIcon);
    this._element.querySelector(`.point__time`)
      .addEventListener(`click`, this._onChangeColor);

    // eslint-disable-next-line camelcase
    flatpickr(this._element.querySelector(`.point__time-from`), {enableTime: true, noCalendar: true, dateFormat: `H:i`, time_24hr: true});
    // eslint-disable-next-line camelcase
    flatpickr(this._element.querySelector(`.point__time-to`), {enableTime: true, noCalendar: true, dateFormat: `H:i`, time_24hr: true});

  }

  unbind() {
    this._element.querySelector(`.trip-form`)
      .removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.trip-form`)
      .removeEventListener(`reset`, this._onDeleteButtonClick);
    this._element.querySelector(`.travel-way`)
      .removeEventListener(`change`, this._onChangeIcon);
    this._element.querySelector(`.point__time`)
      .removeEventListener(`click`, this._onChangeColor);
  }

  update(data) {
    this._mapElement = data.mapElement;
    this._icon = data.icon;
    this._title = data.title;
    this._destination = data.destination;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
  }
}
