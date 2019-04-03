import {checkStatus, toJSON} from './utils';
import {Methods} from './consts';
import {PointAdapter} from './point-adapter';

export class RestService {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(PointAdapter.parsePoints);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(toJSON);
  }

  createPoint({point}) {
    return this._load({
      url: `points`,
      method: Methods.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(PointAdapter.parsePoint);
  }

  updatePoint({id, data}) {
    // console.warn(id, data);
    return this._load({
      url: `points/${id}`,
      method: Methods.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(PointAdapter.parsePoint);
  }

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: Methods.DELETE});
  }

  _load({url, method = Methods.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        // console.error(`fetch error: ${err}`);
        throw err;
      });
  }

}
