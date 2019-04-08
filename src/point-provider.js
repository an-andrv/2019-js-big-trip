import {PointAdapter} from "./point-adapter";
import {objectToArray} from "./utils";

export class PointProvider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  updateTask({id, data}) {
    if (this._isOnline()) {
      return this._api.updateTask({id, data})
        .then((task) => {
          this._store.setItem({key: task.id, item: task.toRAW()});
          return task;
        });
    } else {
      const task = data;
      this._needSync = true;
      this._store.setItem({key: task.id, item: task});
      return Promise.resolve(PointAdapter.parsePoint(task));
    }
  }

  createTask({task}) {
    if (this._isOnline()) {
      return this._api.createTask({task})
        .then((createdTask) => {
          this._store.setItem({key: createdTask.id, item: createdTask.toRAW()});
          return createdTask;
        });
    } else {
      task.id = this._generateId();
      this._needSync = true;

      this._store.setItem({key: task.id, item: task});
      return Promise.resolve(PointAdapter.parsePoint(task));
    }
  }

  deleteTask({id}) {
    if (this._isOnline()) {
      return this._api.deleteTask({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  getTasks() {
    if (this._isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          tasks.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
          return tasks;
        });
    } else {
      const rawTasksMap = this._store.getAll();
      const rawTasks = objectToArray(rawTasksMap);
      const tasks = PointAdapter.parsePoints(rawTasks);

      return Promise.resolve(tasks);
    }
  }

  syncTasks() {
    return this._api.syncTasks({tasks: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
