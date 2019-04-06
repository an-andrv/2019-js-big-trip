import {Component} from './component';
import {POINTS_LIST} from './consts';
import flatpickr from 'flatpickr';

import moment from 'moment';
import _ from 'lodash';

export class EventEdit extends Component {
  constructor(data, offersData, destinationsData) {
    super();
    // console.log(data);
    this._id = data.id;
    this._type = data.type;
    this._icon = data.icon;
    this._title = data.title;
    this._picture = data.picture;
    this._description = data.description;
    this._time = data.time;
    this._price = data.price;
    this._destination = data.destination;
    this._offers = data.offers;
    this._offersData = offersData;
    this._destinationsData = destinationsData;
    this._isFavorite = data.isFavorite;

    this._onSubmit = null;
    this._onDelete = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onTravelWayChange = this._onTravelWayChange.bind(this);
    this._onDestinationChange = this._onDestinationChange.bind(this);
  }

  update(data) {
    this._type = data.type;
    this._icon = data.icon;
    this._title = data.title;
    this._destination = data.destination;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
    this._isFavorite = data.isFavorite;
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    const RED_BORDER_TIMEOUT = 1200;
    this._element.setAttribute(`style`, `animation: shake ${ANIMATION_TIMEOUT / 1000}s; border:4px solid red;`);

    setTimeout(() => {
      this._element.style.animation = ``;
    }, ANIMATION_TIMEOUT);

    setTimeout(() => {
      this._element.style = ``;
    }, RED_BORDER_TIMEOUT);
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
                ${this._renderDestinationDatalist()}
              </datalist>
            </div>
      
            <label class="point__time ">
              choose time                      
              <input class="point__input point__time-from" type="text" value="${moment(this._time.from).format(`HH:mm`)}" name="timeFrom" placeholder="19:00">                    
              <input class="point__input point__time-to" type="text" value="${moment(this._time.to).format(`HH:mm`)}" name="timeTo" placeholder="21:00">
            </label>
      
            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input class="point__input" type="text" value="${this._price}" name="price">
            </label>
      
            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              <button class="point__button point__button--delete" type="reset">Delete</button>
            </div>
      
            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${ this._isFavorite ? `checked` : ``}>
              <label class="point__favorite" for="favorite">favorite</label>
            </div>
          </header>
      
          <section class="point__details">
            <section class="point__offers">
              <h3 class="point__details-title">offers</h3>
      
              <div class="point__offers-wrap">
                ${this._renderOffers()}
              </div>
      
            </section>
            <section class="point__destination">
              <h3 class="point__details-title">Destination</h3>
              <p class="point__destination-text">${this._description}</p>
              <div class="point__destination-images">
                ${this._renderPicturesList()}
              </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
          </section>
        </form>
      </article>
    `.trim();
  }

  set onSubmit(value) {
    this._onSubmit = value;
  }

  set onDelete(value) {
    this._onDelete = value;
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  _processForm(formData) {
    const entry = {
      id: this._id,
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
      isFavorite: ``
    };

    const eventEditMapper = EventEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (eventEditMapper[property]) {
        eventEditMapper[property](value);
      }
    }

    entry.time.from = new Date(moment(this._time.from).format(`YYYY-MM-DD`) + `T` + entry.time.from).getTime();
    entry.time.to = new Date(moment(this._time.to).format(`YYYY-MM-DD`) + `T` + entry.time.to).getTime();

    if (!entry.type && !entry.icon && !entry.title) {
      entry.type = this._type;
      entry.icon = POINTS_LIST[this._type].icon;
      entry.title = POINTS_LIST[this._type].title;
    }

    const updateOffers = _.cloneDeep(this._offers);
    for (const updateOffer of updateOffers) {
      updateOffer.accepted = entry.offers.includes(updateOffer.title);
    }

    entry.offers = updateOffers;

    return entry;
  }

  _renderDestinationDatalist() {
    const destinations = [];
    for (const destination of this._destinationsData) {
      destinations.push(`
        <option value="${destination.name}"></option>
      `);
    }

    return destinations.join(``);
  }

  _renderOffers() {
    const offerTemplates = [];
    if (this._offers.length > 0) {

      for (const [index, offer] of this._offers.entries()) {
        offerTemplates.push(`
          <input 
            class="point__offers-input visually-hidden"
            type="checkbox"
            id="offer-${index}"
            name="offer"
            value="${offer.title}"
            ${offer.accepted ? `checked` : ``}
          >
          <label
            for="offer-${index}"
            class="point__offers-label"
          ><span class="point__offer-service">
            ${offer.title}
            </span> + €
            <span class="point__offer-price">
              ${offer.price}
            </span>
          </label>
        `);
      }
    }

    return offerTemplates.join(``);
  }

  _renderPicturesList() {
    const descriptions = [];
    for (const url of this._picture) {
      descriptions.push(`
        <img src="${url.src}" alt="${url.description}" class="point__destination-image">
      `);
    }

    return descriptions.join(``);
  }

  bind() {
    this._element.querySelector(`.trip-form`)
      .addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.trip-form`)
      .addEventListener(`reset`, this._onDeleteButtonClick);
    this._element.querySelector(`.travel-way`)
      .addEventListener(`change`, this._onTravelWayChange);
    this._element.querySelector(`.point__time`)
      .addEventListener(`click`, this._onColorChange);
    this._element.querySelector(`.point__destination-input`)
      .addEventListener(`change`, this._onDestinationChange);

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
      .removeEventListener(`change`, this._onTravelWayChange);
    this._element.querySelector(`.point__time`)
      .removeEventListener(`click`, this._onColorChange);
    this._element.querySelector(`.point__destination-input`)
      .removeEventListener(`change`, this._onDestinationChange);
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.trip-form`));

    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
    this.update(newData);
  }

  _onDeleteButtonClick() {
    return typeof this._onDelete === `function` && this._onDelete(this._id);
  }

  _onChangeDate() {
    this.unbind();
    this._partialUpdate();
    this.bind();
  }

  _onTravelWayChange(evt) {
    const choosenValue = evt.target.value;
    if (choosenValue && choosenValue !== `on` && this._offersData.find((offer) => offer.type === choosenValue)) {

      this._type = choosenValue;
      this._icon = POINTS_LIST[choosenValue].icon;
      this._title = POINTS_LIST[choosenValue].title;

      let newOffers = this._offersData.find((offer) => offer.type === this._type).offers;
      this._offers = _.cloneDeep(newOffers);
      for (const offer of this._offers) {
        offer.accepted = false;
        offer.title = offer.name;
        delete offer.name;
      }

      this._element.querySelector(`.travel-way__label`).innerHTML = this._icon;
      this._element.querySelector(`.point__destination-label`).innerHTML = this._title;
      this._element.querySelector(`.point__offers-wrap`).innerHTML = this._renderOffers();
      this._element.querySelector(`.travel-way__toggle`).checked = false;
    }
  }

  _onDestinationChange(evt) {
    const choosenDestination = this._destinationsData.find((descriptionData) => descriptionData.name === evt.target.value);

    if (choosenDestination) {
      this._destination = choosenDestination.name;
      this._description = choosenDestination.description;
      this._picture = choosenDestination.pictures;

      this._element.querySelector(`.point__destination-text`).innerHTML = this._description;
      this._element.querySelector(`.point__destination-images`).innerHTML = this._renderPicturesList(this._picture);
    }
  }

  static createMapper(target) {
    return {
      travelWay: (value) => {
        target.type = value;
        target.icon = POINTS_LIST[value].icon;
        target.title = POINTS_LIST[value].title;
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
      favorite: (value) => {
        target.isFavorite = value;
      },
    };
  }
}
