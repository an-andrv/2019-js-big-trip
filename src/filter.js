import {Component} from './component';

export class Filter extends Component {
  constructor(name) {
    super();
    this._name = name;

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  get template() {
    return `
      <span>
        <input type="radio" id="filter-${this._name}" name="filter" value="${this._name}" checked>
        <label class="trip-filter__item" for="filter-${this._name}">${this._name}</label>
      </span>
    `.trim();
  }

  set onFilter(value) {
    this._onFilter = value;
  }

  bind() {
    this._element.querySelector(`.trip-filter__item`)
      .addEventListener(`click`, this._onFilterClick);
  }

  _onFilterClick(evt) {
    return typeof this._onFilter === `function` && this._onFilter(evt.target.innerHTML);
  }

}
