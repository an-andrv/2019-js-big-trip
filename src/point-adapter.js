export class PointAdapter {
  constructor(data) {
    this.id = +data[`id`] || 0;
    this.type = data[`type`] || ``;
    this.destination = data[`destination`].name || ``;
    this.picture = data[`destination`].pictures || [];
    this.description = data[`destination`].description || ``;

    this.time = {
      from: data[`date_from`] || ``,
      to: data[`date_to`] || ``,
      duration: data[`date_to`] - data[`date_from`] || ``,
    };

    this.price = data[`base_price`] || ``;
    this.offers = data[`offers`] || [];
    this.isFavorite = data[`is_favorite`] || false;
  }

  toRAW() {
    return {
      'id': this.id.toString(),
      'type': this.type,
      'destination': {
        name: this.destination,
        description: this.description,
        pictures: this.picture
      },
      'date_from': this.time.from,
      'date_to': this.time.to,
      'base_price': +this.price,
      'offers': this.offers,
      'is_favorite': this.isFavorite,
    };
  }

  static parsePoint(data) {
    return new PointAdapter(data);
  }

  static parsePoints(data) {
    return data.map(PointAdapter.parsePoint);
  }

}
