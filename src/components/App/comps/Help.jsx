import React from "react";
import { withRouter } from "react-router";

import '../css/Help.css'


function Help(props){
    return (
        <div class="main-box">
            <p style={{fontSize:"35px",fontWeight:"bold"}}>Common problems ⚙️</p>
            <div class="problem-box">
                <p class="header-title">Nothing happens when I click "connect Muse"</p>
                <div class="points-wrapper">
                    <div class="points-sub">
                        <p class="sub-header">1. Web Bluetooth is only supported in Chrome</p>
                        <p class="sub-desc">Web Bluetooth is used to stream data from the Muse. It is fully compatible with Chrome, but using the app in other browsers might not work.</p>
                    </div>
                    <div class="points-sub">
                        <p class="sub-header">2. Bluetooth isn't turned on</p>
                        <p class="sub-desc">Make sure your computer's Bluetooth is on. If not, no prompt with appear for you to connect the Muse.</p>
                    </div>
                    <div class="points-sub">
                        <p class="sub-header">3. Operating system incompatible</p>
                        <p class="sub-desc">Web Bluetooth is not fully supported withh all operating systems. If you're using Mac, Windows, or Linux, you should be okay. If not, that could be why the prompt isn't appearing.</p>
                    </div>
                </div>
            </div>
            <div class="problem-box">
                <p class="header-title">My Muse isn't showing up on the Bluetooth scanner</p>
                <div class="points-wrapper">
                    <div class="points-sub">
                        <p class="sub-header">1. Make sure Muse is powered on and ready to pair</p>
                        <p class="sub-desc">Hold the power button on the right ear for 1s to turn the Muse on. Make sure it's in pairing mode (light moving up and down). If the light is solid white and it isn't already connected with this app, it's probably connected to your phone. Turn off your phone Bluetooth and try connecting again.</p>
                    </div>
                    <div class="points-sub">
                        <p class="sub-header">2. Restart your browser</p>
                        <p class="sub-desc">If nothing else works, try closing your browser and opening it again.</p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default withRouter(Help);