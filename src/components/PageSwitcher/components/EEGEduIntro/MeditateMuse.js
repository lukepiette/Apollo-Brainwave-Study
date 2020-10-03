import React from "react";
import { catchError, multicast } from "rxjs/operators";
import { Subject } from "rxjs";

import { Card, Link } from "@shopify/polaris";

import { Line } from "react-chartjs-2";

import { zipSamples } from "muse-js";

import {
  bandpassFilter,
  epoch
} from "@neurosity/pipes";

import { chartStyles, generalOptions } from "../chartOptions";

import * as specificTranslations from "./translations/en";

import { generateXTics, standardDeviation } from "../../utils/chartUtils";

import moment from 'moment';
import firebase from "../../../App/Firebase.js";


const rootRef = firebase.database().ref().child('accounts');

var DATA_TP9 = [];
var DATA_AF7 = [];
var DATA_AF8 = [];
var DATA_TP10 = [];

var MAX_COUNT = 21*1;
var COUNT = 0;

export function getSettings () {
  return {
    name: "Intro",
    cutOffLow: 2,
    cutOffHigh: 20,
    interval: 12,
    srate: 256,
    duration: 256
  }
};

export function buildPipe(Settings) {
  if (window.subscriptionIntro$) window.subscriptionIntro$.unsubscribe();

  window.pipeIntro$ = null;
  window.multicastIntro$ = null;
  window.subscriptionIntro = null;

  // Build Pipe
 window.pipeIntro$ = zipSamples(window.source.eegReadings$).pipe(
    bandpassFilter({ 
      cutoffFrequencies: [Settings.cutOffLow, Settings.cutOffHigh], 
      nbChannels: window.nchans }),
    epoch({
      duration: Settings.duration,
      interval: Settings.interval,
      samplingRate: Settings.srate
    }),
    catchError(err => {
      console.log(err);
    })
  );
  window.multicastIntro$ = window.pipeIntro$.pipe(
    multicast(() => new Subject())
  );
}

function avData(data){
  var sum = 0;
  for( var i = 0; i < data.length; i++ ){
    if (!isNaN(data[i])){
      if (data[i]<0){
        sum += (data[i]*-1);
      }
      else{
        sum += data[i];
      }
    }
  }
  var avg = sum/data.length;
  return avg
}

function formatSeconds(sec){
  if (sec < 10){
    return 0
  }
  if (sec < 20){
    return 10
  }
  if (sec < 30){
    return 20
  }
  if (sec < 40){
    return 30
  }
  if (sec < 50){
    return 40
  }
  if (sec < 60){
    return 50
  }
}


export function setup(setData, Settings, UUID, onOff) {
  console.log("Subscribing to " + Settings.name);

  if (window.multicastIntro$) {
    window.subscriptionIntro = window.multicastIntro$.subscribe(data => {

      // console.log(data.data["0"].slice(0,12));
      // console.log(data.data["0"].slice(0,12));
      DATA_TP9 = DATA_TP9.concat(data.data["0"].slice(0,12));
      DATA_AF7 = DATA_AF7.concat(data.data["1"].slice(0,12));
      DATA_AF8 = DATA_AF8.concat(data.data["2"].slice(0,12));
      DATA_TP10 = DATA_TP10.concat(data.data["3"].slice(0,12));

      if (COUNT > MAX_COUNT){
        var TIMESTAMP = + new Date();
        var dateFormatted = {};
        var formatted = {};
        formatted[TIMESTAMP] = {
          "TP9":DATA_TP9,
          "AF7":DATA_AF7,
          "AF8":DATA_AF8,
          "TP10":DATA_TP10
        }

        var date = moment().format('YYYY-MM-DD');
        var hour = moment().format('H');
        var minute = moment().format('mm');
        var seconds = formatSeconds(moment().format('ss'));


        var hourFormatted = {};
        hourFormatted[hour] = formatted;
        dateFormatted[date] = hourFormatted;

        //////////////////////////////////////

        var AV_TP9 = avData(DATA_TP9);
        var AV_TP10 = avData(DATA_TP10);
        var AV_AF7 = avData(DATA_AF7);
        var AV_AF8 = avData(DATA_AF8);

        
        var electrodesFormatted = {};
        electrodesFormatted['TP9'] = AV_TP9;
        electrodesFormatted['TP10'] = AV_TP10;
        electrodesFormatted['AF7'] = AV_AF7;
        electrodesFormatted['AF8'] = AV_AF8;

        var secondsFormatted = {};
        var secondsMeditate = {};
        secondsFormatted[seconds] = electrodesFormatted;
        secondsMeditate[moment().format('s')] = electrodesFormatted


        try{
          rootRef.child(UUID).child('data').update(dateFormatted);
          rootRef.child(UUID).child('history').child(date).child(hour).child(minute).update(secondsFormatted);
          rootRef.child(UUID).child('meditate').child(onOff).child(date).child(hour).child(minute).update(secondsMeditate);
          console.log("Data successfuly pushed.")
        }
        catch {console.log('missing values... could not push')}


        DATA_TP9 = [];
        DATA_AF7 = [];
        DATA_AF8 = [];
        DATA_TP10 = [];

        COUNT = 0;
      }
      COUNT ++;

      setData(introData => {
        Object.values(introData).forEach((channel, index) => {
          // console.log(index);
          if (index === 0) {
            channel.datasets[0].data = data.data[index];
            // console.log(data.data[index])
            channel.xLabels = generateXTics(Settings.srate, Settings.duration);
            channel.datasets[0].qual = standardDeviation(data.data[index]);
            // console.log(standardDeviation());  
            // console.log(data.data[index]);   
          }
        });

        return {
          ch0: introData.ch0
        };
      });
    });

    window.multicastIntro$.connect();
    console.log("Subscribed to " + Settings.name);
  }
}

export function renderModule(channels) {
  function renderCharts() {
    return Object.values(channels.data).map((channel, index) => {
      const options = {
        ...generalOptions,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                ...generalOptions.scales.xAxes[0].scaleLabel,
                labelString: specificTranslations.xlabel
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                ...generalOptions.scales.yAxes[0].scaleLabel,
                labelString: specificTranslations.ylabel
              },
              ticks: {
                max: 300,
                min: -300
              }
            }
          ]
        },
        elements: {
          line: {
            borderColor: 'rgba(' + channel.datasets[0].qual*10 + ', 128, 128)',
            fill: false
          },
          point: {
            radius: 0
          }
        },
        animation: {
          duration: 0
        },
        title: {
          ...generalOptions.title,
          text: ''
        }
      };

      if (index === 0) {
        return (
          <Card.Section key={"Card_" + index}>
            <Line id="CHART-ID" key={"Line_" + index} data={channel} options={options} />
          </Card.Section>
        );
      } else {
        return null
      };
    });
  }

  return (
      <div title={specificTranslations.title}>       
            <div style={chartStyles.wrapperStyle.style}>
              {renderCharts()}
            </div>
      </div>
  );
}