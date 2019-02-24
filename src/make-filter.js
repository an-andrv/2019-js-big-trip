export default (filterName) => `
  <input type="radio" id="filter-${filterName}" name="filter" value="${filterName}" checked>
  <label class="trip-filter__item" for="filter-${filterName}">${filterName}</label>
`;
