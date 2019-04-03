import ChartDataLabels from 'chartjs-plugin-datalabels';
import {convertToHours} from './utils';

export class ChartParam {
  constructor(nameChart, data) {
    this._title = nameChart;
    this._dataLabels = Array.from(data.keys());
    this._datasets = Array.from(data.values());

    if (this._title === `TIME`) {
      this._datasets = this._datasets.map((dataset) => convertToHours(dataset));
    }

    this._formatters = {
      MONEY: (val) => `€ ${val}`,
      TRANSPORT: (val) => `${val}x`,
      TIME: (val) => `${val}H`
    };
  }

  get params() {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._dataLabels,
        datasets: [{
          data: this._datasets,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#FFD054`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: this._formatters[this._title]
          }
        },
        title: {
          display: true,
          text: this._title,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    };
  }
}
