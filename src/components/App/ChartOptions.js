// import { chartStyles, generalOptions } from "../PageSwitcher/components/chartOptions.js";

export const OPTIONS = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
            gridLines: {
                display: true,
            },
            scaleLabel: {
                display: true
            }
        }
      ],
      yAxes: [
        {
        gridLines: {
            display: true,
        },
          scaleLabel: {
            display: true,
            labelString:"Voltage (\u03BCV)"
          },
        ticks: {
            max: 300,
            min: 0,
          }
        }
      ]
    },
    elements: {
      point: {
        radius: 0
      }
    },
    title: {
      display: true,
    },
    plugins: {
        datalabels: {
            display: false,
        },
    },
    responsive: true,
    tooltips: { enabled: false },
    legend: { display: true }
  };

