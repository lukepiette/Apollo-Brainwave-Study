import React, { useCallback, useContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { withRouter, Redirect } from "react-router";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import firebase from "../Firebase.js";
// import { AuthContext } from "../Auth.js";
import Cookies from 'js-cookie';
import AuthUser from '../Auth';


import { Helmet } from 'react-helmet'
import '../css/Login.css'

const rootRef = firebase.database().ref().child('accounts');


function SignupForm(props){
  const history = useHistory();

  if (AuthUser){
    history.push("/fitting");
  }

  const handleKeyPress = useCallback(
    event => {
      if(event.key === 'Enter'){
        console.log('enter press here! ');
        document.getElementById('button-action').click();
        // this.inputElement.click();
      }
    }
  );

  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const email = document.getElementById("email-input").value;
      const password = document.getElementById("password-input").value;
      const confPassword = document.getElementById("confirm-password-input").value;
      if (confPassword != password){
        alert("Passwords must match!")
        return 
      }
    //   const checked = document.getElementById('checkbox-input');
    //   console.log(checked);
    //   if (!checked) {
    //       alert('Please confirm the email address is your existing Apollo accountn email.');
    //       return
    //   }

      try {
        await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
        Cookies.set('uid', firebase.auth().currentUser.uid);

        var UUID = Cookies.get('uid');
        var formatted = {}
        formatted[UUID] = {'email':email,'password':password,'callibration':{'status':'incomplete'}}
        rootRef.update(formatted);
        history.push("/fitting");
        history.go();
      }
      catch (error) {
        alert(error);
      }
    },[history]
  );

//   const { getFieldDecorator } = props.form;
  return (
        <div style={{margin:"0px",padding:"0px"}}>
            <Helmet>
                <title>Sign Up - Apollo Brainwave Study</title>
            </Helmet>
            <div class="row-login">
                <div class="column-1-login">
                    <div style={{marginTop:"25%",width:"100%"}}>
                        <div style={{width:"330px",display:"block",marginBottom:"30px",marginLeft:"auto",marginRight:"auto"}}>
                            <img src={'https://firebasestorage.googleapis.com/v0/b/apollo-brain-study.appspot.com/o/apollo-logo.png?alt=media&token=1be620a4-ba56-4241-84ad-6d053d2d65c0'} style={{width:"150px",display:"inline-block"}}/>
                            <img src={'https://firebasestorage.googleapis.com/v0/b/apollo-brain-study.appspot.com/o/muse-logo.png?alt=media&token=c4130e55-ab39-41f0-9c25-a39fd775001c'} style={{width:"150px",display:"inline-block"}}/>
                        </div>
                        <div style={{textAlign:"center",margin:"0 auto",display:"block",width:"80%"}}>
                            <h1 style={{color:"#52B8A6",marginBottom:"20px",lineHeight:"1"}}>Brainwave Study</h1>
                            <p style={{marginBottom:"10px"}}>Welcome to the Apollo Brainwave Study 👋</p>
                            <p>Login to start streaming your brain wave data.</p>
                        </div>
                    </div>
                </div>
                
                <p id="no-mobile-login">This site isn't functional on mobile.<br></br>Please use a desktop device.</p>
                <div class="column-2-login">
                    <div style={{marginTop:"20%",width:"100%"}}>
                        <div style={{margin:"0 auto",width:"80%",textAlign:"center",display:"block"}}>
                            <h2 style={{marginBottom:"50px",lineHeight:"1"}}>Create an account</h2>
                            <div style={{width:"60%",textAlign:"center",margin:"0 auto",display:"block"}} id="column-2-body-login">

                                <input style={{marginBottom:"0px !important"}} id="email-input" placeholder="Apollo Account Email Address" class="signup-input-login" name="email"/>
                                <div style={{height:"5px"}}></div>
                                <input id="checkbox-input" style={{cursor:"pointer",float:"left",marginBottom:"0px",width:"10px",marginTop:"8px"}} type="checkbox" id="usedApollo" name="usedApollo"/>
                                <label id="checkbox-label" style={{cursor:"pointer",float:"left",marginTop:"5px",marginLeft:"3px",fontSize:"12px",fontFamily:"'Roboto', sans-serif",fontWeight:"100"}} for="usedApollo">I entered my existing Apollo account email.</label>
                                
                                <div style={{height:"60px"}}></div>
                                <input id="password-input" style={{marginBottom:"0px !important"}}  placeholder="Password" class="signup-input-login" type="password" name="password"/>

                                <div style={{height:"50px"}}></div>
                                <input id="confirm-password-input" style={{marginBottom:"0px !important"}}  onKeyPress={handleKeyPress} placeholder="Confirm Password" class="signup-input-login" type="password" name="confirm-password"/>

                                <div style={{height:"50px"}}></div>

                                <button id="button-action" htmlType="submit" class="sign-up-button-login" onClick={handleLogin}>Sign Up</button>

                                <p style={{fontWeight:"700",color:"#919091",fontSize:"12px",marginTop:"10px",marginBottom:"10px"}}>or</p>

                                <a onClick={() => history.push("/login")} style={{color:"#52B8A6",cursor:"pointer",textDecoration:"none"}}><p style={{fontWeight:"700",fontSize:"14px"}}>Login</p></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// const LoginForm = Form.create({ name: 'login' })(LoginFormRoot);

export default withRouter(SignupForm);


