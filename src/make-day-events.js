export default (date, dayEvents) => {
  return `
    <section class="trip-day">
      <article class="trip-day__info">
        <span class="trip-day__caption">Day</span>
        <p class="trip-day__number">1</p>
        <h2 class="trip-day__title">${date}</h2>
      </article>

      <div class="trip-day__items">
        ${dayEvents.join(``)}
      </div>
    </section>
  `;
};
