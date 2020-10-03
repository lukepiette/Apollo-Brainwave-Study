import React, { useCallback, useContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { withRouter, Redirect } from "react-router";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import firebase from "../Firebase.js";
import Cookies from 'js-cookie';
import AuthUser from '../Auth';


import { Helmet } from 'react-helmet'
import '../css/Dashboard.css'


import { MuseClient } from "muse-js";
import { mockMuseEEG } from "../../PageSwitcher/utils/mockMuseEEG";
import * as translations from "../../PageSwitcher/translations/en.json";
import * as generalTranslations from "../../PageSwitcher/components/translations/en";
import { emptyAuxChannelData } from "../../PageSwitcher/components/chartOptions";
import * as funIntro from "../../PageSwitcher/components/EEGEduIntro/EEGEduIntro"

// import moment from 'moment';


const intro = translations.types.intro;


function DashboardForm(props){
    const UUID = Cookies.get('uid');

    const [checked, setChecked] = useState(false);
    const handleChange = useCallback((newChecked) => setChecked(newChecked), []);
    window.enableAux = checked;
    if (window.enableAux) {
      window.nchans = 5;
    } else {
      window.nchans = 4;
    }
    let showAux = true; // if it is even available to press (to prevent in some modules)
  
    const [introData, setIntroData] = useState(emptyAuxChannelData)
    const [introSettings] = useState(funIntro.getSettings);
    const [status, setStatus] = useState(generalTranslations.connect);
  
    const [selected, setSelected] = useState(intro);
    const handleSelectChange = useCallback(value => {
      setSelected(value);
  
      console.log("Switching to: " + value);
  
      if (window.subscriptionIntro) window.subscriptionIntro.unsubscribe();
      subscriptionSetup(value);
    }, []);
  
    const [recordPop, setRecordPop] = useState(false);
    const recordPopChange = useCallback(() => setRecordPop(!recordPop), [recordPop]);
  
    const [recordTwoPop, setRecordTwoPop] = useState(false);
    const recordTwoPopChange = useCallback(() => setRecordTwoPop(!recordTwoPop), [recordTwoPop]);
  
    switch (selected) {
      case intro:
        showAux = false;
        break
      default:
        console.log("Error on showAux");
    }
  
  
    const chartTypes = [
      { label: intro, value: intro },
    ];
  
    function buildPipes(value) {
      funIntro.buildPipe(introSettings);
    }
  
    function subscriptionSetup(value) {
      switch (value) {
        case intro:
          funIntro.setup(setIntroData, introSettings, UUID);
          break;
        default:
          console.log(
            "Error on handle Subscriptions. Couldn't switch to: " + value
          );
      }
    }
  
    async function connect() {
      try {
        if (window.debugWithMock) {
          // Debug with Mock EEG Data
          setStatus(generalTranslations.connectingMock);
          window.source = {};
          window.source.connectionStatus = {};
          window.source.connectionStatus.value = true;
          window.source.eegReadings$ = mockMuseEEG(256);
          setStatus(generalTranslations.connectedMock);
        } else {
          // Connect with the Muse EEG Client
          setStatus(generalTranslations.connecting);
          window.source = new MuseClient();
          window.source.enableAux = window.enableAux;
          await window.source.connect();
          await window.source.start();
          window.source.eegReadings$ = window.source.eegReadings;
          setStatus(generalTranslations.connected);
        }
        if (
          window.source.connectionStatus.value === true &&
          window.source.eegReadings$
        ) {
          console.log(window.source.eegReadings$);
          buildPipes(selected);
          subscriptionSetup(selected);
        }
      } catch (err) {
        setStatus(generalTranslations.connect);
        console.log("Connection error: " + err);
      }
    }
  
    function refreshPage(){
      window.location.reload();
    }
  
    function pipeSettingsDisplay() {
      switch(selected) {
        case intro:
          return null
        default: console.log('Error rendering settings display');
      }
    }
  
    function renderModules() {
      switch (selected) {
        case intro:
          return <funIntro.renderModule data={introData} />;
        default:
          console.log("Error on renderCharts switch.");
      }
    }
   
    function renderRecord() {
      switch (selected) {
        case intro: 
          return null
        default:   
          console.log("Error on renderRecord.");
      }
    }

    function onOffPush(str){
      
    }

    const history = useHistory();
    // if (AuthUser != true){
    //     history.push("/login");
    // }
    
    const uid = Cookies.get('uid');
    const name = firebase.database().ref().child('accounts').child(uid).child('name')
    
    return (
        <div class="body-full-dashboard" style={{margin:"0px",padding:"0px"}}>
            <Helmet>
                <style>{'body { background-color: #EEF4EC; }'}</style>
                <title>Dashboard - Apollo Brainwave Study</title>
            </Helmet>

            <div class="nav-dashboard">
                <div class="nav-wrapper-dashboard">
                    <a style={{cursor:"pointer"}} onClick={() => history.push("/dashboard")}><img src="https://firebasestorage.googleapis.com/v0/b/apollo-brain-study.appspot.com/o/apollo-logo.png?alt=media&token=1be620a4-ba56-4241-84ad-6d053d2d65c0" style={{width:"15vh",padding:"1.5vh",marginLeft:"2%"}}/></a>
                    <ul style={{float:"right",marginRight:"4%",padding:"3vh"}}>
                        <li class="nav-link-dashboard"><a style={{cursor:"pointer"}} class="nav-link-text-dashboard" onClick={() => {history.push("/history");history.go();}}>History</a></li>
                        <li class="nav-link-dashboard"><a style={{cursor:"pointer"}} class="nav-link-text-dashboard" onClick={() => {history.push("/meditate");history.go();}}>Meditate</a></li>
                        <li class="nav-link-dashboard"><a style={{cursor:"pointer",borderBottomWidth:"1px",color:"#52B8A6"}} class="nav-link-text-dashboard" onClick={() => {history.push("/dashboard");history.go();}}>Dashboard</a></li>                
                    </ul>
                </div>
            </div>

            {/* <div style={{backgroundColor:"#000000 !important",height:"100px"}}></div> */}
            <div class="column-1-dashboard">
                <div style={{width:"100%"}}>
                    <div style={{textAlign:"left",margin:"0 auto",display:"block",width:"80%"}}>
                        {/* <h1 style={{color:"#52B8A6",marginBottom:"20px",fontWeight:"500",marginTop:"0px",paddingTop:"0px"}}>Welcome, <span onload={() => document.getElementById("name-id").innerText = name} id="name-id"></span>.</h1> */}
                        {/* <h2 style={{fontSize:"16px",marginBottom:"30px",fontWeight:"500"}}>Connect your Muse Headband to start streaming.</h2> */}

                        <div class="white-box-dashboard">
                            <p class="white-box-header-dashboard" style={{fontSize:"35px",marginBottom:"1vh",marginTop:"1vh"}}>Streaming</p>
                            <p style={{fontSize:"14px",width:"75%",display:"block",margin:"0 auto",marginBottom:"1.5vh"}}>Turn on your muse to start pairing.</p>
                            {/* <div style={{width:"60%",textAlign:"center",margin:"0 auto",display:"block"}}> */}
                                {/* <input style={{display:"inline-block",width:"90%",marginBottom:"0px !important"}} placeholder="Muse Address (Ex: 0BE9)" class="signup-input" name="museAddress"/> */}
                                {/* <a href="{{ url_for('setup',ID=ID) }}"><i style={{display:"inline-block",width:"1%",color:"#1F2E4F",fontSize:"36px"}} class="fa fa-question-circle"></i></a> */}
                            {/* </div> */}
                            <button style={{marginTop:"0px"}} type="submit" id="connect" class="sign-up-button-dashboard"
                                        primary={status === generalTranslations.connect}
                                        disabled={status !== generalTranslations.connect}
                                        onClick={() => {
                                        window.debugWithMock = false;
                                        connect();
                                        console.log(generalTranslations.connect)
                                        }}
                                    >
                                    {status}</button>
                            <p onClick={() => history.push("/help")} style={{fontSize:"10px",marginTop:"1vh",cursor:"pointer"}}>Having trouble?</p>
                            {/* <p style={{fontSize:"12px"}}>My Muse isn't showing up in bluetooth...</p> */}
                        </div>


                        <div class="white-box-dashboard">
                            <p class="white-box-header-history" style={{fontSize:"35px",marginBottom:"3vh",marginTop:"1vh"}}>Electrodes</p>
                            {/* <p class="what-is-electrode">What is TP9, TP10, AF7, AF8 on the chart?</p> */}
                            <img style={{height:"20vh"}} src="https://firebasestorage.googleapis.com/v0/b/apollo-brain-study.appspot.com/o/electrode-config-FULL.png?alt=media&token=73a563e0-0f6c-4bce-82f1-7af9ebed4fd2"></img>
                            {/* <p style={{fontSize:"14px",width:"75%",display:"block",margin:"0 auto",marginBottom:"2vh"}}>Check out this quick video on how to properly fit the Muse to your head 🎥</p> */}
                            {/* <a target="_blank" href="https://www.youtube.com/watch?v=v8xUYqqJAIg"><button style={{display:"inline-block",opacity:"0 !important"}} type="submit" class="sign-up-button-history">Watch the Video</button></a> */}
                        </div>


                        {/* <div class="white-box-dashboard">
                            <p class="white-box-header-dashboard" style={{marginBottom:"2vh"}}>Recent Data Recordings</p>
                            <div style={{width:"80%",textAlign:"center",margin:"0 auto",display:"block",marginBottom:"0px",height:"4vh"}}>
                                <p style={{display:"inline-block",marginRight:"10px"}} class="recording-date-dashboard">July 20, 2020</p>
                                <button style={{display:"inline-block"}} type="submit" class="view-logs-button-dashboard">View</button>
                            </div>
                            <div style={{width:"80%",textAlign:"center",margin:"0 auto",display:"block",marginBottom:"0px",height:"4vh"}}>
                                <p style={{display:"inline-block",marginRight:"10px"}} class="recording-date-dashboard">July 19, 2020</p>
                                <button style={{display:"inline-block"}} type="submit" class="view-logs-button-dashboard">View</button>
                            </div>
                            <div style={{width:"80%",textAlign:"center",margin:"0 auto",display:"block",marginBottom:"0px",height:"4vh"}}>
                                <p style={{display:"inline-block",marginRight:"10px"}} class="recording-date-dashboard">July 18, 2020</p>
                                <button style={{display:"inline-block"}} type="submit" class="view-logs-button-dashboard">View</button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>


            <div class="column-2-dashboard">
                <div style={{marginTop:"0%",width:"100%",height:"100%",paddingTop:"0vh"}}>
                    <div style={{paddingTop:"5vh",textAlign:"center",margin:"0 auto",display:"block",width:"100%",height:"100%",backgroundColor:"white",borderRadius:"15px"}}>
                        <h2 style={{marginBottom:"20px",marginTop:"0px",paddingTop:"0px"}}>Live Feed</h2>
                        <p style={{paddingLeft:"30px",paddingRight:"30px",marginBottom:"0px"}}>A live look at your brainwave data. Try blinking! 👁️</p>

                        <div class="chart-body-dashboard">
                            <div class="data-container-dashboard">
                                <div style={{position:"relative"}}>
                                    {renderModules()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default withRouter(DashboardForm);


