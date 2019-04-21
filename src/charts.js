import {ChartParam} from './chart-param';
import {POINTS_LIST, chartName} from './consts';
import {getTimeDifference} from './utils';

import Chart from 'chart.js';

export class Charts {
  constructor(data) {
    this._data = data;

    this._moneyData = new Map();
    this._transportData = new Map();
    this._timeSpendData = new Map();

    this._moneyChart = ``;
    this._transportChart = ``;
    this._timeChart = ``;
  }

  _updateDataChart(data) {
    this._moneyData.clear();
    this._transportData.clear();
    this._timeSpendData.clear();

    for (const point of data) {
      const icon = POINTS_LIST[point.type].icon;
      const title = POINTS_LIST[point.type].title;
      const key = `${icon} ${title.toUpperCase()}`;

      if (this._moneyData.has(key)) {
        const currentValue = this._moneyData.get(key);
        this._moneyData.set(key, +currentValue + +point.price);
      } else {
        this._moneyData.set(key, point.price);
      }

      if (this._transportData.has(key)) {
        let currentValue = this._transportData.get(key);
        this._transportData.set(key, ++currentValue);
      } else {
        this._transportData.set(key, 1);
      }

      if (this._timeSpendData.has(key)) {
        let currentDifference = this._timeSpendData.get(key);
        this._timeSpendData.set(key, currentDifference + getTimeDifference(point.time.from, point.time.to));
      } else {
        this._timeSpendData.set(key, getTimeDifference(point.time.from, point.time.to));
      }
    }
  }

  render() {
    this._updateDataChart(this._data);

    const moneyParams = new ChartParam(chartName.MONEY, this._moneyData).params;
    this._moneyChart = new Chart(document.querySelector(`.statistic__money`).getContext(`2d`), moneyParams);

    const transportParams = new ChartParam(chartName.TRANSPORT, this._transportData).params;
    this._transportChart = new Chart(document.querySelector(`.statistic__transport`).getContext(`2d`), transportParams);

    const timesParams = new ChartParam(chartName.TIME, this._timeSpendData).params;
    this._timeChart = new Chart(document.querySelector(`.statistic__time-spend`).getContext(`2d`), timesParams);
  }

  updateCharts() {
    this._moneyChart.destroy();
    this._transportChart.destroy();
    this._timeChart.destroy();
    this.render();
  }
}
