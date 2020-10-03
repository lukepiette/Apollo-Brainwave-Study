import React, { useCallback, useContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { withRouter, Redirect } from "react-router";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import firebase from "../Firebase.js";
import Cookies from 'js-cookie';
import AuthUser from '../Auth';


import { Helmet } from 'react-helmet'
import '../css/Fitting.css'


import { MuseClient } from "muse-js";
import { mockMuseEEG } from "../../PageSwitcher/utils/mockMuseEEG";
import * as translations from "../../PageSwitcher/translations/en.json";
import * as generalTranslations from "../../PageSwitcher/components/translations/en";
import { emptyAuxChannelData } from "../../PageSwitcher/components/chartOptions";
import * as funIntro from "../../PageSwitcher/components/EEGEduIntro/EEGEduIntro"

// import moment from 'moment';

// import ConfettiGenerator from './Confetti.js'

const intro = translations.types.intro;


function Fitting(props){
    const rootRef = firebase.database().ref().child('accounts');

    async function getStatus(UID){
        var DATA
        let NOTHING = await rootRef.child(UID).child('callibration').child('status').once('value', async (snap)=>{
            DATA = snap.val();
            return(snap.val());
          });
        return DATA;
    }

    async function grabVal(UID){
        var DD = await getStatus(UUID)
        return DD
    }

    async function redirectOrNa(UUID){
        var status = await getStatus(UUID);
        if (status == 'complete'){
            history.push("/dashboard")
        }
    }


    const history = useHistory();
    const UUID = Cookies.get('uid');
    redirectOrNa(UUID)
    // const callibrationStatus = getStatus(UUID);


    if (AuthUser == false){
        history.push("/signup");
    }

    return (
        <div class="body-full-fitting" style={{margin:"0px",padding:"0px"}}>
            <Helmet>
                <style>{'body { background-color: #EEF4EC; }'}</style>
                <title>Fitting the Muse - Apollo Brainwave Study</title>
            </Helmet>

            <canvas style={{zIndex:"-100",position:"absolute",width:"100%",height:"100%"}} id="my-canvas"></canvas>

            <div class="nav-fitting">
                <div class="nav-wrapper-fitting">
                    <a style={{cursor:"pointer"}}><img src="https://firebasestorage.googleapis.com/v0/b/apollo-brain-study.appspot.com/o/apollo-logo.png?alt=media&token=1be620a4-ba56-4241-84ad-6d053d2d65c0" style={{width:"15vh",padding:"1.5vh",marginLeft:"2%"}}/></a>
                    <ul style={{float:"right",marginRight:"4%",padding:"3vh"}}>
                    </ul>
                </div>
            </div>

            {/* <div style={{backgroundColor:"#000000 !important",height:"100px"}}></div> */}
            <div class="column-1-fitting">
              <div style={{zIndex:"100"}} class="white-box-wrapper-fitting">
                <div style={{width:"100%"}}>
                    <div style={{textAlign:"left",margin:"0 auto",display:"block",width:"80%"}}>

                        <div class="white-box-fitting">
                            <p class="white-box-header-fitting" style={{marginBottom:"3vh"}}>Fitting The Muse</p>
                            <p style={{fontSize:"14px",width:"50%",display:"block",margin:"0 auto",marginBottom:"3vh",marginTop:"2vh"}}>Make sure your Muse has direct contact with your forehead and the ear electrodes are resting on your ears.</p>
                            
                            <iframe width="80%" height="400" src="https://www.youtube.com/embed/v8xUYqqJAIg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                            </iframe>

                            <button type="submit" class="sign-up-button-fitting" style={{marginTop:"4vh"}} onClick={() => {
                                    history.push('callibration')
                                  }} 
                                    >
                                    Done</button>
                        </div>



                    </div>
                </div>
              </div>
            </div>




        </div>
    );
}


export default withRouter(Fitting);


