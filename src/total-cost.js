import {Component} from "./component";

export class TotalCost extends Component {
  constructor(data) {
    super();
    this._data = data;

    const INITIAL_VALUE = 0;
    this._totalCost = this._data.reduce(
        (accumulator, currentValue) => {
          currentValue.offers.forEach((offer) => {
            accumulator += offer.price;
          });
          return accumulator + currentValue.price;
        },
        INITIAL_VALUE
    );
  }

  get template() {
    return `
      <p class="trip__total">Total: <span class="trip__total-cost">&euro;&nbsp;${this._totalCost}</span></p>
    `.trim();
  }

}
