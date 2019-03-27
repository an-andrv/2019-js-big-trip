import {checkStatus, toJSON} from './utils';
import {Methods} from './consts';

export class RestService {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = `Basic eo0w590ik29889a`; // Basic ${случайная строка} // Basic eo0w590ik29889a
  }

  getPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      // .then(Adapter.parseTasks);
  }

  getDestinations() {
    return this._load({url: `destinations`}) // Создайте для списка направлений отдельную структуру и запишите в неё полученные данные.
      .then(toJSON)
      // .then(Adapter.parseTasks);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(toJSON)
    //   .then(Adapter.parseTasks);
  }

  createTask({task}) {
    // return this._load({
    //   url: `tasks`,
    //   method: Method.POST,
    //   body: JSON.stringify(task),
    //   headers: new Headers({'Content-Type': `application/json`})
    // })
    //   .then(toJSON)
    //   .then(Adapter.parseTask);
  }

  updateTask({id, data}) {
    // return this._load({
    //   url: `tasks/${id}`,
    //   method: Method.PUT,
    //   body: JSON.stringify(data),
    //   headers: new Headers({'Content-Type': `application/json`})
    // })
    //   .then(toJSON)
    //   .then(Adapter.parseTask);
  }

  deleteTask({id}) {
    // return this._load({url: `tasks/${id}`, method: Method.DELETE});
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
