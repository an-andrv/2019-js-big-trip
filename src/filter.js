import {createElement} from './utils';

export class Filter {
  constructor(name) {
    this._name = name;

    this._element = null;
    this._onChangeCount = null;
  }

  set onChangeCount(value) {
    this._onChangeCount = value;
  }

  _onChangeButtonClick() {
    return typeof this._onChangeCount === `function` && this._onChangeCount();
  }

  get element() {
    return this._element;
  }

  get template() {
    return `
      <span>
        <input type="radio" id="filter-${this._name}" name="filter" value="${this._name}" checked>
        <label class="trip-filter__item" for="filter-${this._name}">${this._name}</label>
      </span>
    `.trim();
  }

  bind() {
    this._element.querySelector(`.trip-filter__item`)
      .addEventListener(`click`, this._onChangeButtonClick.bind(this));
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

}
