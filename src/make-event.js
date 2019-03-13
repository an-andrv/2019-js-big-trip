export default (eventData) => {

  const offersTemplate = [];
  eventData.offers.forEach((offer) => {
    offersTemplate.push(`
      <li>
        <button class="trip-point__offer">${offer} +&euro;&nbsp;20</button>
      </li>
    `);
  });

  return `
    <article class="trip-point">
      <i class="trip-icon">${eventData.event.icon}</i>
      <h3 class="trip-point__title">${eventData.event.title} ${eventData.event.location}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${eventData.time.from}&nbsp;&mdash; ${eventData.time.to}</span>
        <span class="trip-point__duration">${eventData.time.duration}</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${eventData.price}</p>
      <ul class="trip-point__offers">
        ${offersTemplate.join(``)}
      </ul>
    </article>
  `;
};
