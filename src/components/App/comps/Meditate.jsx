import React, { useCallback, useContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { withRouter, Redirect } from "react-router";
import firebase from "../Firebase.js";
import Cookies from 'js-cookie';
import AuthUser from '../Auth';


import { Helmet } from 'react-helmet'
import '../css/Meditate.css'


import { MuseClient } from "muse-js";
import { mockMuseEEG } from "../../PageSwitcher/utils/mockMuseEEG";
import * as translations from "../../PageSwitcher/translations/en.json";
import * as generalTranslations from "../../PageSwitcher/components/translations/en";
import { emptyAuxChannelData } from "../../PageSwitcher/components/chartOptions";
import * as funIntro from "../../PageSwitcher/components/EEGEduIntro/MeditateMuse"

// import moment from 'moment';

// import ConfettiGenerator from './Confetti.js'

const intro = translations.types.intro;


function Meditate(props){
    function ConfettiGenerator(params) {
        //////////////
        // Defaults
        var appstate = {
        target: 'confetti-holder', // Id of the canvas
        max: 80, // Max itens to render
        size: 1, // prop size
        animate: true, // Should aniamte?
        props: ['circle', 'square', 'triangle', 'line'], // Types of confetti
        colors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]], // Colors to render confetti
        clock: 25, // Speed of confetti fall
        interval: null, // Draw interval holder
        rotate: false, // Whenever to rotate a prop
        width: window.innerWidth, // canvas width (as int, in px)
        height: window.innerHeight // canvas height (as int, in px)
        };
    
        //////////////
        // Setting parameters if received
        if(params) {
        if(params.target)
            appstate.target = params.target;
        if(params.max)
            appstate.max = params.max;
        if(params.size)
            appstate.size = params.size;
        if(params.animate !== undefined && params.animate !== null)
            appstate.animate = params.animate;
        if(params.props)
            appstate.props = params.props;
        if(params.colors)
            appstate.colors = params.colors;
        if(params.clock)
            appstate.clock = params.clock;
        if(params.width)
            appstate.width = params.width;
        if(params.height)
            appstate.height = params.height;
        if(params.rotate !== undefined && params.rotate !== null)
            appstate.rotate = params.rotate;
        }
    
        //////////////
        // Properties
        var cv = document.getElementById(appstate.target);
        var ctx = cv.getContext("2d");
        var particles = [];
    
        //////////////
        // Random helper (to minimize typing)
        function rand(limit, floor) {
        if(!limit) limit = 1;
        var rand = Math.random() * limit;
        return !floor ? rand : Math.floor(rand);
        }
    
        var totalWeight = appstate.props.reduce(function(weight, prop) {
        return weight + (prop.weight || 1);
        }, 0);
        function selectProp() {
        var rand = Math.random() * totalWeight;
        for (var i = 0; i < appstate.props.length; ++i) {
            var weight = appstate.props[i].weight || 1;
            if (rand < weight) return i;
            rand -= weight;
        }
        }
    
        //////////////
        // Confetti particle generator
        function particleFactory() {
        var prop = appstate.props[selectProp()];
        var p = {
            prop: prop.type ? prop.type : prop, //prop type
            x: rand(appstate.width), //x-coordinate
            y: rand(appstate.height), //y-coordinate
            src: prop.src,
            radius: rand(4) + 1, //radius
            size: prop.size,
            rotate: appstate.rotate,
            line: Math.floor(rand(65) - 30), // line angle
            angles: [rand(10, true) + 2, rand(10, true) + 2, rand(10, true) + 2, rand(10, true) + 2], // triangle drawing angles
            color: appstate.colors[rand(appstate.colors.length, true)], // color
            rotation: rand(360, true) * Math.PI/180,
            speed: rand(appstate.clock / 7) + (appstate.clock / 30)
        };
    
        return p;
        }
    
        //////////////
        // Confetti drawing on canvas
        function particleDraw(p) {
        var op = (p.radius <= 3) ? 0.4 : 0.8;
    
        ctx.fillStyle = ctx.strokeStyle = "rgba(" + p.color + ", "+ op +")";
        ctx.beginPath();
    
        switch(p.prop) {
            case 'circle':{
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, p.radius * appstate.size, 0, Math.PI * 2, true);
            ctx.fill();
            break;  
            }
            case 'triangle': {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + (p.angles[0] * appstate.size), p.y + (p.angles[1] * appstate.size));
            ctx.lineTo(p.x + (p.angles[2] * appstate.size), p.y + (p.angles[3] * appstate.size));
            ctx.closePath();
            ctx.fill();
            break;
            }
            case 'line':{
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + (p.line * appstate.size), p.y + (p.radius * 5));
            ctx.lineWidth = 2 * appstate.size;
            ctx.stroke();
            break;
            }
            case 'square': {
            ctx.save();
            ctx.translate(p.x+15, p.y+5);
            ctx.rotate(p.rotation);
            ctx.fillRect(-15 * appstate.size,-5 * appstate.size,15 * appstate.size,5 * appstate.size);
            ctx.restore();
            break;
            }
            case 'svg': {
            ctx.save();
            var image = new window.Image();
            image.src = p.src;
            var size = p.size || 15;
            ctx.translate(p.x + size / 2, p.y + size / 2);
            if(p.rotate)
                ctx.rotate(p.rotation);
            ctx.drawImage(image, -(size/2) * appstate.size, -(size/2) * appstate.size, size * appstate.size, size * appstate.size);
            ctx.restore();
            break;
            }
        }
        }
        
        //////////////
        // Public itens
        //////////////
    
        //////////////
        // Clean actual state
        var _clear = function() {
        appstate.animate = false;
        clearInterval(appstate.interval);
        
        requestAnimationFrame(function() {
            ctx.clearRect(0, 0, cv.width, cv.height);
            var w = cv.width;
            cv.width = 1;
            cv.width = w;
        });
        }
    
        //////////////
        // Render confetti on canvas
        var _render = function() {
            //canvas dimensions
            cv.width = appstate.width;
            cv.height = appstate.height;
            particles = [];
    
            for(var i = 0; i < appstate.max; i ++)
            particles.push(particleFactory());
            
            function draw(){
            ctx.clearRect(0, 0, appstate.width, appstate.height);
    
            for(var i in particles)
                particleDraw(particles[i]);
            
            update();
    
            //animation loop
            if(appstate.animate) requestAnimationFrame(draw);
            }
    
            function update() {
    
            for (var i = 0; i < appstate.max; i++) {
                var p = particles[i];
                if(appstate.animate)
                p.y += p.speed;
    
                if (p.rotate)
                p.rotation += p.speed / 35;
                
                if ((p.speed >= 0 && p.y > appstate.height) || (p.speed < 0 && p.y < 0)) {
                particles[i] = p; 
                particles[i].x = rand(appstate.width, true);
                particles[i].y = p.speed >= 0 ? -10 : parseFloat(appstate.height);
                }
            }
            }
    
            return requestAnimationFrame(draw);
        };
    
        return {
        render: _render,
        clear: _clear
        }
    }



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

    async function getApolloStatus(date){
        var DATA
        let NOTHING = await rootRef.child('apollo-status').once('value', async (snap)=>{
            DATA = snap.val();
            return(snap.val());
          });
        return DATA;
    }
  
    async function subscriptionSetup(value) {
      switch (value) {
        case intro:
          var apolloStatus = await getApolloStatus()
          funIntro.setup(setIntroData, introSettings, UUID, apolloStatus);
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
        nextCallibration(2);
      } catch (err) {
        setStatus(generalTranslations.connect);
        console.log("Connection error: " + err);
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
   
    const history = useHistory();
    // if (AuthUser != true){
    //     history.push("/login");
    // }
    
    const uid = Cookies.get('uid');
    const rootRef = firebase.database().ref().child('accounts').child(uid).child('meditate')


    function nextCallibration(ID_NUM){
      document.getElementById(`meditate-${ID_NUM}`).style.display = 'none';
      document.getElementById(`meditate-${ID_NUM+1}`).style.display = 'block';
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function onOffPush(str){
        rootRef.update({'apollo-status':str});
        nextCallibration(1)
    }


    async function meditate(sec){
      var TIMESTAMP = + new Date();
      var formatted = {};
      formatted[TIMESTAMP] = {}
      rootRef.update(formatted)

      document.getElementById('meditate-5min').style.display = "none";
      document.getElementById('meditate-10min').style.display = "none";
      document.getElementById('meditate-15min').style.display = "none";
      document.getElementById('meditate-30min').style.display = "none";
      document.getElementById('meditating').style.display = "block";
      
      for (var count=sec;count>-1;count--){
        document.getElementById("meditation-seconds").innerText = `${count}s`
        await sleep(1000);
      }

        nextCallibration(3);
        document.getElementById('my-canvas').style.zIndex = '1';
        var confettiSettings = { target: 'my-canvas' };
        var confetti = new ConfettiGenerator(confettiSettings);      
        confetti.render();
    }

    
    return (
        <div class="body-full-meditate" style={{margin:"0px",padding:"0px"}}>
            <Helmet>
                <style>{'body { background-color: #EEF4EC; }'}</style>
                <title>Meditate - Apollo Brainwave Study</title>
            </Helmet>

            <canvas style={{zIndex:"-100",position:"absolute",width:"100%",height:"100%"}} id="my-canvas"></canvas>

            <div class="nav-dashboard">
                <div class="nav-wrapper-dashboard">
                    <a style={{cursor:"pointer"}} onClick={() => history.push("/dashboard")}><img src="https://firebasestorage.googleapis.com/v0/b/apollo-brain-study.appspot.com/o/apollo-logo.png?alt=media&token=1be620a4-ba56-4241-84ad-6d053d2d65c0" style={{width:"15vh",padding:"1.5vh",marginLeft:"2%"}}/></a>
                    <ul style={{float:"right",marginRight:"4%",padding:"3vh"}}>
                        <li class="nav-link-dashboard"><a style={{cursor:"pointer"}} class="nav-link-text-dashboard" onClick={() => {history.push("/history");history.go();}}>History</a></li>
                        <li class="nav-link-dashboard"><a style={{cursor:"pointer",borderBottomWidth:"1px",color:"#52B8A6"}} class="nav-link-text-dashboard" onClick={() => {history.push("/meditate");history.go();}}>Meditate</a></li>
                        <li class="nav-link-dashboard"><a style={{cursor:"pointer"}} class="nav-link-text-dashboard" onClick={() => {history.push("/dashboard");history.go();}}>Dashboard</a></li>                
                    </ul>
                </div>
            </div>

            {/* <div style={{backgroundColor:"#000000 !important",height:"100px"}}></div> */}
            <div class="column-1-meditate">
              <div style={{zIndex:"100"}} class="white-box-wrapper">
                <div style={{width:"100%"}}>
                    <div style={{textAlign:"left",margin:"0 auto",display:"block",width:"80%"}}>

                        <div id="meditate-1">
                          <div class="white-box-meditate">
                              <p style={{fontSize:"14px",marginBottom:"3vh"}}>1/3</p>
                              <p class="white-box-header-meditate" style={{marginBottom:"1vh"}}>Meditation</p>
                              <p style={{fontSize:"14px",width:"70%",display:"block",margin:"0 auto",marginBottom:"1vh",marginTop:"2vh"}}>It's best to alternate days meditating with the Apollo on/off so we can track the impact it has on your brainwaves.</p>

                              <button style={{marginTop:"2vh",marginRight:"1vh",display:"inline-block"}} type="submit" class="sign-up-button-meditate"
                                          onClick={() => {
                                            onOffPush('on')
                                          }}
                                      >
                                      ✔️ With Apollo</button>
                              <button style={{marginTop:"2vh",marginLeft:"1vh",display:"inline-block"}} type="submit" class="sign-up-button-meditate"
                                  onClick={() => {
                                    onOffPush('off')
                                  }}
                              >
                             ❌ Without Apollo</button>
                          </div> 
                        </div>


                        <div id="meditate-2" class="white-box-callibration" style={{display:"none"}}>
                            <p style={{fontSize:"14px",marginBottom:"3vh"}}>2/3</p>
                            <p class="white-box-header-callibration" style={{marginBottom:"1vh"}}>Connect Muse</p>
                            <p style={{fontSize:"14px",width:"70%",display:"block",margin:"0 auto",marginBottom:"1.5vh",marginTop:"2vh"}}>Connect Muse to start meditating</p>
                            <button style={{marginTop:"2vh"}} type="submit" id="connect" class="sign-up-button-callibration"
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
                        </div>


                        <div id="meditate-3"  style={{display:"none"}}>
                          <div class="white-box-meditate">
                              <p style={{fontSize:"14px",marginBottom:"3vh"}}>3/3</p>
                              <p class="white-box-header-meditate" style={{marginBottom:"1vh"}}>Meditate</p>
                              <p style={{fontSize:"14px",width:"70%",display:"block",margin:"0 auto",marginBottom:"1.5vh",marginTop:"2vh"}}>Chose a meditation duration that best suits you.</p>
                              <button id="meditating" style={{pointerEvents:"none",marginTop:"2.5vh",display:"none",margin:"0 auto"}} type="submit" class="sign-up-button-meditate"
                                      >
                                      Recording...</button>

                              <button id="meditate-5min" style={{marginTop:"2vh",marginRight:"2vh",display:"inline-block"}} type="submit" class="sign-up-button-meditate"
                                          onClick={() => {
                                            meditate(5*60)
                                          }}
                                      >
                                      5 min</button>
                              <button id="meditate-10min" style={{marginTop:"2vh",marginRight:"2vh",display:"inline-block"}} type="submit" class="sign-up-button-meditate"
                                  onClick={() => {
                                    meditate(10*60)
                                  }}
                              >
                              10 min</button>
                              <button id="meditate-15min" style={{marginTop:"2vh",marginRight:"2vh",display:"inline-block"}} class="sign-up-button-meditate"
                                  onClick={() => {
                                    meditate(15*60)
                                  }}
                              >
                              15 min</button>
                              <button id="meditate-30min" style={{marginTop:"2vh",display:"inline-block"}} class="sign-up-button-meditate"
                                  onClick={() => {
                                    meditate(30*60)
                                  }}
                              >
                              30 min</button>
                          </div> 

                          <div style={{marginTop:"4vh"}}>
                            <p id="meditation-seconds" style={{fontSize:"20px",marginTop:"0vh",textAlign:"center"}}>300s</p>
                          </div>
                        </div>


                        <div id="meditate-4" style={{display:"none",paddingBottom:"10vh"}} class="white-box-callibration">
                            <p style={{fontSize:"14px",marginBottom:"3vh"}}></p>
                            <p class="white-box-header-callibration" style={{marginBottom:"1vh"}}>Nice Job!</p>
                            <p style={{fontSize:"14px",width:"60%",display:"block",margin:"0 auto",marginBottom:"1.5vh",marginTop:"2vh"}}>The longer you meditate, the better we can improve the Apollo :)</p>
                            <button style={{marginTop:"1vh",marginBottom:"1.5vh",position:"absolute",zIndex:"100",marginLeft:"auto",marginRight:"auto",left:"0",right:"0",textAlign:"center"}} class="sign-up-button-callibration"
                                        onClick={() => {
                                          history.push('dashboard')
                                        }}
                                    >
                                    Dashboard</button>
                        </div>

{/* 
                        <div id="meditate-5" style={{display:"none"}}>
                          <div class="white-box-meditate" style={{paddingBottom:"10vh"}}>
                              <p style={{fontSize:"14px",marginBottom:"3vh"}}>4/4 👀</p>
                              <p class="white-box-header-meditate" style={{marginBottom:"1vh"}}>Zone Out</p>
                              <p style={{fontSize:"14px",width:"60%",display:"block",margin:"0 auto",marginBottom:"1.5vh",marginTop:"2vh"}}>Let your mind loose as you stare at the <b style={{color:"#00ab93"}}>GREEN</b> circle for 60s</p>
                              <button id="zoneout-text" style={{marginTop:"1vh",marginBottom:"1.5vh",position:"absolute",zIndex:"100",marginLeft:"auto",marginRight:"auto",left:"0",right:"0",textAlign:"center"}} class="sign-up-button-meditate"
                                          onClick={() => {
                                          zoneout()
                                          }}
                                      >
                                      Let's do it</button>
                          </div>

                          <div class="white-box-blink">
                            <span id="circle" style={{height:"10px",fontSize:"400px",color:"#00ab93"}} class="circle"></span>
                            <p id="zoneout-seconds" style={{fontSize:"14px",marginTop:"0vh"}}>60s</p>
                          </div>
                        </div> */}

{/* 
                        <div id="meditate-6" style={{display:"none",paddingBottom:"10vh"}} class="white-box-meditate">
                            <p style={{fontSize:"14px",marginBottom:"3vh"}}>🎉</p>
                            <p class="white-box-header-meditate" style={{marginBottom:"1vh"}}>You're All Set!</p>
                            <p style={{fontSize:"14px",width:"60%",display:"block",margin:"0 auto",marginBottom:"1.5vh",marginTop:"2vh"}}>You can now access the dashboard page</p>
                            <button style={{marginTop:"1vh",marginBottom:"1.5vh",position:"absolute",zIndex:"100",marginLeft:"auto",marginRight:"auto",left:"0",right:"0",textAlign:"center"}} class="sign-up-button-meditate"
                                        onClick={() => {
                                          history.push('dashboard')
                                        }}
                                    >
                                    Dashboard</button>
                        </div> */}

                    </div>
                </div>
              </div>
            </div>

            <script>

              
            </script>


        </div>
    );
}


export default withRouter(Meditate);

