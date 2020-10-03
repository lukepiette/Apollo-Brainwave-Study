import React, { useCallback, useContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { withRouter, Redirect } from "react-router";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import firebase from "../Firebase.js";
import Cookies from 'js-cookie';
import AuthUser from '../Auth';


import { Helmet } from 'react-helmet'
import '../css/History.css'


import { MuseClient } from "muse-js";
import { mockMuseEEG } from "../../PageSwitcher/utils/mockMuseEEG";
import * as translations from "../../PageSwitcher/translations/en.json";
import * as generalTranslations from "../../PageSwitcher/components/translations/en";
import { emptyAuxChannelData } from "../../PageSwitcher/components/chartOptions";
import * as funIntro from "../../PageSwitcher/components/EEGEduIntro/EEGEduIntro"



import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import DatePicker from 'rc-calendar/lib/Picker';
import moment from 'moment';

import { Line } from "react-chartjs-2";


import Chart from "chart.js";
import { OPTIONS } from '../ChartOptions.js'



const LABELS = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
const tmpLabels = ['12:00am','1:00am','2:00am','3:00am','4:00am','5:00am','6:00am','7:00am','8:00am','9:00am','10:00am','11:00am','12:00pm']
for (var i=0;i<13;i++){
    LABELS[i*64] = tmpLabels[i]
}




function handleDataArrays(data){
    var arrayTo = {'AF7':[],'AF8':[],'TP9':[],'TP10':[]};
    for (var hour=0;hour<24;hour++){
        for (var min=0;min<60;min++){
            for (var sec=0;sec<60;sec+=10){
                try {
                    arrayTo['AF7'].push(data[hour][min][sec]['AF7'])
                    arrayTo['AF8'].push(data[hour][min][sec]['AF8'])
                    arrayTo['TP9'].push(data[hour][min][sec]['TP9'])
                    arrayTo['TP10'].push(data[hour][min][sec]['TP10'])
                    console.log(hour,min,sec)
                }
                catch {
                    arrayTo['AF7'].push(null)
                    arrayTo['AF8'].push(null)
                    arrayTo['TP9'].push(null)
                    arrayTo['TP10'].push(null)
                }
            }
        }
    }

    var avArrayTo = {'AF7':[],'AF8':[],'TP9':[],'TP10':[]};

    for (var len=0;len<1440;len++){
        var AF7values = arrayTo['AF7'].slice(len*6,(len+1)*6);
        var AF8values = arrayTo['AF8'].slice(len*6,(len+1)*6);
        var TP9values = arrayTo['TP9'].slice(len*6,(len+1)*6);
        var TP10values = arrayTo['TP10'].slice(len*6,(len+1)*6);

        var array = {'AF7':[],'AF8':[],'TP9':[],'TP10':[]};

        for (var i=0;i<AF7values.length;i++){
            var array = {'AF7':[],'AF8':[],'TP9':[],'TP10':[]};
            if (AF7values[i]!=null){
                
                array['AF7'].push(AF7values[i])
            }
            if (AF8values[i]!=null){
                array['AF8'].push(AF8values[i])
            }
            if (TP9values[i]!=null){
                array['TP9'].push(TP9values[i])
            }
            if (TP10values[i]!=null){
                array['TP10'].push(TP10values[i])
            }
        }

        if (array['AF7'].length == 0){
            avArrayTo['AF7'].push(null);
        }
        else {
            avArrayTo['AF7'].push(array['AF7'].reduce((a, b) => a + b) / array['AF7'].length)
        }
        if (array['AF8'].length == 0){
            avArrayTo['AF8'].push(null);
        }
        else {
            avArrayTo['AF8'].push(array['AF8'].reduce((a, b) => a + b) / array['AF8'].length)
        }
        if (array['TP9'].length == 0){
            avArrayTo['TP9'].push(null);
        }
        else {
            avArrayTo['TP9'].push(array['TP9'].reduce((a, b) => a + b) / array['TP9'].length)
        }
        if (array['TP10'].length == 0){
            avArrayTo['TP10'].push(null);
        }
        else {
            avArrayTo['TP10'].push(array['TP10'].reduce((a, b) => a + b) / array['TP10'].length)
        }
    
    }

    return avArrayTo
}





class HistoryForm extends React.Component {

    chartRef = React.createRef();

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");
        
        this.CHART = new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels:LABELS,
                datasets: [
                    {
                        data: [],
                        borderColor: 'rgba(240, 128, 128)',
                        fill: false,
                        label: 'TP9'
                    },
                    {
                        data: [],
                        borderColor: 'rgba(240, 200, 128)',
                        fill: false,
                        label: 'TP10'
                    },
                    {
                        data: [],
                        borderColor: 'rgba(128, 128, 240)',
                        fill: false,
                        label: 'AF7'
                    },
                    {
                        data: [],
                        borderColor: 'rgba(128, 200, 240)',
                        fill: false,
                        label: 'AF8'
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMax: 300,
                            min:0,
                        }
                    }]
                }
            }
        });
    }

    render(){
        // const myChart = <Line id="CHART-ID" data={DATA_IN} options={OPTIONS} ref={this.chartRef}/> //ref={(reference) => this.reference = reference}
        const UUID = Cookies.get('uid');
        const rootRef = firebase.database().ref().child('accounts');
        const userRef = rootRef.child(UUID).child('history')
        
        const todayDate = moment().format('YYYY-MM-DD');
        let dataAF7 = [];
        let dataAF8 = [];
        let dataTP9 = [];
        let dataTP10 = [];
    

        const handleButton1 = () => {
            if (document.getElementById("button-1")){
                document.getElementById("button-1").style.backgroundColor = "#ffffff";
                document.getElementById("button-1").style.color = "#1F2E4F";
        
                document.getElementById("button-2").style.backgroundColor = "#1F2E4F";
                document.getElementById("button-2").style.color = "#ffffff";
            }
            updateChart(0);
        }
        
        const handleButton2 = () => {
            if (document.getElementById("button-2")){
                document.getElementById("button-2").style.backgroundColor = "#ffffff";
                document.getElementById("button-2").style.color = "#1F2E4F";
        
                document.getElementById("button-1").style.backgroundColor = "#1F2E4F";
                document.getElementById("button-1").style.color = "#ffffff";
            }
            updateChart(1);
        }


        const updateChart = (value) => {
            var numStart = 0
            var numFin = 770

            var LABELS_1 = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
            var LABELS_2 = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
            var tmpLabels_1 = ['12:00am','1:00am','2:00am','3:00am','4:00am','5:00am','6:00am','7:00am','8:00am','9:00am','10:00am','11:00am','12:00pm']
            var tmpLabels_2 = ['12:00pm','1:00pm','2:00pm','3:00pm','4:00pm','5:00pm','6:00pm','7:00pm','8:00pm','9:00pm','10:00pm','11:00pm','12:00am']

            for (var i=0;i<13;i++){
                LABELS_1[i*64] = tmpLabels_1[i]
            }
            for (var i=0;i<13;i++){
                LABELS_2[i*64] = tmpLabels_2[i]
            }

            var ALL_LABELS = [LABELS_1,LABELS_2]

            if (value == 0){
                numStart = 0;
                numFin = 770;
            }
            else if (value == 1){
                numStart = 770;
                numFin = 1440;
            }

            this.CHART.data.labels = ALL_LABELS[value];
            this.CHART.data.datasets = [
                {
                    data: dataTP9.slice(numStart,numFin),
                    borderColor: 'rgba(240, 128, 128)',
                    fill: false,
                    label: 'TP9'
                },
                {
                    data: dataTP10.slice(numStart,numFin),
                    borderColor: 'rgba(240, 200, 128)',
                    fill: false,
                    label: 'TP10'
                },
                {
                    data: dataAF7.slice(numStart,numFin),
                    borderColor: 'rgba(128, 128, 240)',
                    fill: false,
                    label: 'AF7'
                },
                {
                    data: dataAF8.slice(numStart,numFin),
                    borderColor: 'rgba(128, 200, 240)',
                    fill: false,
                    label: 'AF8'
                }
            ];
            this.CHART.update();
        }

        async function handleChange(date){
            var cleanDate = moment(date).format('YYYY-MM-DD');
            var DATA = await getDateData(cleanDate);
            if (DATA != undefined){
                console.log('yup');
                var arrays = handleDataArrays(DATA);

                dataAF7 = arrays['AF7'];
                dataAF8 = arrays['AF8'];
                dataTP9 = arrays['TP9'];
                dataTP10 = arrays['TP10'];

                document.getElementById('no-data-available').style.visibility = "hidden";

                handleButton1();
            }
            else {
                console.log('nah');
                var returnArray = [];
                for (var i=0;i<1440;i++){
                    returnArray.push(null);
                }
                dataAF7 = returnArray
                dataAF8 = returnArray
                dataTP9 = returnArray
                dataTP10 = returnArray

                document.getElementById('no-data-available').style.visibility = "visible";

                handleButton1();
            }
        }
        
        async function getDateData(date){
            var DATA
            let NOTHING = await userRef.child(date).once('value', async (snap)=>{
                DATA = snap.val();
                return(snap.val());
              });
            return DATA;
        }

        handleChange(todayDate);

        return (
            <div class="body-full-history" style={{margin:"0px",padding:"0px"}}>
                <Helmet>
                    <style>{'body { background-color: #EEF4EC; }'}</style>
                    <title>Dashboard - Apollo Brainwave Study</title>
                </Helmet>
    
                <div class="nav-history">
                    <div class="nav-wrapper-history">
                        <a style={{cursor:"pointer"}} onClick={() => this.props.history.push("/dashboard")}><img src="https://firebasestorage.googleapis.com/v0/b/apollo-brain-study.appspot.com/o/apollo-logo.png?alt=media&token=1be620a4-ba56-4241-84ad-6d053d2d65c0" style={{width:"15vh",padding:"1.5vh",marginLeft:"2%"}}/></a>
                        <ul style={{float:"right",marginRight:"4%",padding:"3vh"}}>
                            <li class="nav-link-history"><a style={{cursor:"pointer",borderBottomWidth:"1px",color:"#52B8A6"}} class="nav-link-text-history" onClick={() => {this.props.history.push("/history");this.props.history.go()}}>History</a></li>
                            <li class="nav-link-history"><a style={{cursor:"pointer"}} class="nav-link-text-history" onClick={() => {this.props.history.push("/meditate");this.props.history.go()}}>Meditate</a></li>
                            <li class="nav-link-history"><a style={{cursor:"pointer"}} class="nav-link-text-history" onClick={() => {this.props.history.push("/dashboard");this.props.history.go()}}>Dashboard</a></li>
                        </ul>
                    </div>
                </div>
    
                <div class="column-1-history">
                    <div style={{width:"100%"}}>
                        <div style={{textAlign:"left",margin:"0 auto",display:"block",width:"80%"}}>
                            <div class="calendar-box-history">
                                <div style={{display:"inline-block"}}>
                                    <Calendar style={{width:"800px !important"}} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="column-2-history">
                    <div style={{marginTop:"0%",width:"100%",height:"100%",paddingTop:"0vh"}}>
                        <div style={{paddingTop:"5vh",textAlign:"center",margin:"0 auto",display:"block",width:"100%",height:"100%",backgroundColor:"white",borderRadius:"15px"}}>
                            <h2 style={{marginBottom:"20px",marginTop:"0px",paddingTop:"0px"}}>Historical Brainwave Data</h2>
                            <p style={{paddingLeft:"30px",paddingRight:"30px",marginBottom:"0px"}}>Click on a calendar date to see your data for that day <b style={{marginLeft:"5px"}}>📅</b></p>
                            <div style={{display:"inline-block",marginTop:"2vh",marginBottom:"1.5vh"}}>
                                <button id="button-1" class="button-time-style" onClick={handleButton1}>0h-12h</button>
                                <button id="button-2" class="button-time-style" onClick={handleButton2}>12h-24h</button>
                                {/* <button onClick={() => {myChart.props.data.datasets[0] = [0]}}>REDUCE</button> */}
                            </div>
                            <p id="no-data-available" >No data available.</p>
                            <div class="chart-body-history">
                                <div class="data-container-history">
                                    <canvas
                                        id="myChart"
                                        ref={this.chartRef}
                                    />
                                    {/* {myChart} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div style={{float: "left",width:"100%",margin:"0px",padding:"0px",textAlign:"center"}}>
                    <p class="what-is-electrode">What is TP9, TP10, AF7, AF8?</p>
                </div> */}
            </div>
        );
    }
}



export default withRouter(HistoryForm);


