import * as generalTranslations from "./translations/en";

export const chartStyles = {
  wrapperStyle: {
    display: "block",
    flexWrap: "wrap",
    padding: "0px",
  }
};

export const emptyChannelData = {
  ch0: {
    datasets: [{}]
  },
  ch1: {
    datasets: [{}]
  },
  ch2: {
    datasets: [{}]
  },
  ch3: {
    datasets: [{}]
  }
};

export const emptyAuxChannelData = {
  ch0: {
    datasets: [{}]
  },
  ch1: {
    datasets: [{}]
  },
  ch2: {
    datasets: [{}]
  },
  ch3: {
    datasets: [{}]
  },
  ch4: {
    datasets: [{}]
  }
};

export const emptySingleChannelData = {
  ch1: {
    datasets: [{}]
  }
};


export const generalOptions = {
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        scaleLabel: {
          display: true
        }
      }
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true
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
    text: generalTranslations.channel
  },
  responsive: true,
  tooltips: { enabled: false },
  legend: { display: false }
};
