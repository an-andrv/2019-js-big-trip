import {PointAdapter} from "./point-adapter";
import {objectToArray} from "./utils";

export class PointProvider {
  constructor({restService, store, generateId}) {
    this._restService = restService;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  updatePoint({id, data}) {
    if (this._isOnline()) {
      return this._restService.updatePoint({id, data})
        .then((updatedPoint) => {
          this._store.setItem({key: updatedPoint.id, item: updatedPoint.toRAW()});
          return updatedPoint;
        });
    } else {
      const point = data;
      this._needSync = true;
      this._store.setItem({key: point.id, item: point});
      return Promise.resolve(PointAdapter.parsePoint(point));
    }
  }

  createPoint({point}) {
    if (this._isOnline()) {
      return this._restService.createPoint({point})
        .then((createdPoint) => {
          this._store.setItem({key: createdPoint.id, item: createdPoint.toRAW()});
          return createdPoint;
        });
    } else {
      point.id = this._generateId();
      this._needSync = true;

      this._store.setItem({key: point.id, item: point});
      return Promise.resolve(PointAdapter.parsePoint(point));
    }
  }

  deletePoint({id}) {
    if (this._isOnline()) {
      return this._restService.deletePoint({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  getPoints() {
    if (this._isOnline()) {
      return this._restService.getPoints()
        .then((points) => {
          points.map((it) => {
            return this._store.setItem({key: it.id, item: it.toRAW()});
          });
          return points;
        });
    } else {
      const rawPointsMap = this._store.getAll();
      const rawPoints = objectToArray(rawPointsMap);
      const points = PointAdapter.parsePoints(rawPoints);

      return Promise.resolve(points);
    }
  }

  getOffers() {
    if (this._isOnline()) {
      return this._restService.getOffers()
        .then((offers) => {
          offers.map((it, index) => this._store.setItem({key: index, item: it}));
          return offers;
        });
    } else {
      const rawOffersMap = this._store.getAll();
      const offers = objectToArray(rawOffersMap);

      return Promise.resolve(offers);
    }
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._restService.getDestinations()
        .then((destinations) => {
          destinations.map((it, index) => this._store.setItem({key: index, item: it}));
          return destinations;
        });
    } else {
      const rawDestinationsMap = this._store.getAll();
      const destinations = objectToArray(rawDestinationsMap);

      return Promise.resolve(destinations);
    }
  }

  syncPoints() {
    return this._restService.syncPoints({points: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
