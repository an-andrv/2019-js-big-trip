import {pointsList} from './consts';
import moment from 'moment';

export class Adapter {
  constructor(data) {

    this.id = +data[`id`]+1 || ``;
    this.type = data[`type`] || ``;
    this.icon = pointsList[this.type].icon || ``;
    this.title = pointsList[this.type].title || ``;

    this.destination = data[`destination`].name || ``; // : {name: "Milan", description: "Milan, is a beautiful city, middle-eastern paradise.", pictures: Array(5)}
    this.picture = data[`destination`].pictures || []; // переписать место рендеринга картинок
    this.description = data[`destination`].description || ``;

    this.dateD = moment(data[`date_from`]).format(`D`) || ``,
    this.dateM = moment(data[`date_from`]).format(`MMM`) || ``,
    this.time = {
      from: moment(data[`date_from`]).format(`HH:mm`) || ``,
      to: moment(data[`date_to`]).format(`HH:mm`) || ``,
      duration: moment(data[`date_to`] - data[`date_from`] - 3*60*60*1000 ).format(`HH[H] mm[M]`) || ``,
    };

    this.price = data[`base_price`] || ``; // : 500

    this.offers = data[`offers`] || []; // : (3) [{…}, {…}, {…}]
    this.isDeleted = false; // отправлять ли на сервер инфу если событие удаление, is_deleted = true ???
    this.isFavorite = data[`is_favorite`] || false; // : true // в mock не было
  }

  toRAW() {
    return {
      // 'id': this.id,
      // 'title': this.title,
      // 'due_date': this.dueDate,
      // 'tags': [...this.tags.values()],
      // 'picture': this.picture,
      // 'repeating_days': this.repeatingDays,
      // 'color': this.color,
      // 'is_favorite': this.isFavorite,
      // 'is_done': this.isDone,
    };
  }

  static parsePoint(data) {
    return new Adapter(data);
  }

  static parsePoints(data) {
    return data.map(Adapter.parsePoint);
  }

}
