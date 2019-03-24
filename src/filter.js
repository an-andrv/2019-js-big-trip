import {EventComponent} from './event-component';

export class Filter extends EventComponent {
  constructor(name) {
    super();
    this._name = name;

    this._onFilter = null;
  }

  set onFilter(value) {
    this._onFilter = value;
  }

  _onFilterClick(evt) {
    return typeof this._onFilter === `function` && this._onFilter(evt.target.innerHTML);
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
      .addEventListener(`click`, this._onFilterClick.bind(this));
  }

}
