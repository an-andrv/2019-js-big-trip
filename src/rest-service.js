import {checkStatus, toJSON} from './utils';
import {Methods} from './consts';
import {Adapter} from './adapter';

export class RestService {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization; //`Basic eo0w590ik29889a`; // Basic ${случайная строка} // Basic eo0w590ik29889a
  }

  getPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(Adapter.parsePoints);
  }

  getDestinations() {
    return this._load({url: `destinations`}) // Создайте для списка направлений отдельную структуру и запишите в неё полученные данные.
      .then(toJSON)
      // .then(Adapter.parseTasks);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(toJSON)
      // .then(Adapter.parseTasks);
  }

  createTask({point}) {
    return this._load({
      url: `tasks`,
      method: Methods.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(Adapter.parseTask);
  }

  updateTask({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Methods.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(Adapter.parseTask);
  }

  deleteTask({id}) {
    return this._load({url: `points/${id}`, method: Methods.DELETE});
  }

  _load({url, method = Methods.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        console.error(`fetch error: ${err}`);
        throw err;
      });
  }

}
