import {pointsList} from './consts';

export class Adapter {
  constructor(data) {
    this.id = +data[`id`] || 0;
    this.type = data[`type`] || ``;
    this.icon = pointsList[this.type].icon || ``;
    this.title = pointsList[this.type].title || ``;
    this.destination = data[`destination`].name || ``; // : {name: , description: , pictures: [description: , src: ]}
    this.picture = data[`destination`].pictures || []; // переписать место рендеринга картинок
    this.description = data[`destination`].description || ``;

    this.time = {
      from: data[`date_from`] || ``,
      to: data[`date_to`] || ``,
    };

    this.price = data[`base_price`] || ``; // : 500
    this.offers = data[`offers`] || []; // : (3) [{…}, {…}, {…}]
    // this.isDeleted = false; // отправлять ли на сервер инфу если событие удаление, is_deleted = true ???
    this.isFavorite = data[`is_favorite`] || false; // : true // в mock не было
  }

  toRAW() {
    console.warn({
      'id': this.id,//
      'type': this.type,
      'destination': {
        name: this.destination,
        description: this.description,
        pictures: this.picture // [{description: , src: }]
      },
      'date_from': this.time.from,//
      'date_to': this.time.to,//
      'base_price': this.price,//
      'offers': this.offers, //[{accepted: price: title: }]
      'is_favorite': this.isFavorite,//
    });
    console.warn(this.picture);
    console.warn(this.offers);
    return {
      'id': this.id,//
      'type': this.type,
      'destination': {
        name: this.destination,
        description: this.description,
        pictures: this.picture // [{description: , src: }]
      },
      'date_from': this.time.from,//
      'date_to': this.time.to,//
      'base_price': this.price,//
      'offers': this.offers, //[{accepted: price: title: }]
      'is_favorite': this.isFavorite,//
    };
  }

  static parsePoint(data) {
    return new Adapter(data);
  }

  static parsePoints(data) {
    return data.map(Adapter.parsePoint);
  }

}
