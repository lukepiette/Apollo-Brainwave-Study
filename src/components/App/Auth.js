import React, { useEffect, useState, Component } from "react";
import firebase from "./Firebase";
import Cookies from 'js-cookie'

// const rootRef = firebase.database().ref().child('accounts');

// async function getStatus(UID){
//     var DATA
//     let NOTHING = await rootRef.child(UID).child('status').once('value', async (snap)=>{
//         DATA = snap.val();
//         return(snap.val());
//       });
//     return DATA;
// }

function AuthUser(){
    const cookie = Cookies.get('uid');
    if (cookie != undefined){
        return true
        // var callibrationStatus = getStatus(cookie);
        // console.log(callibrationStatus);
        // if (callibrationStatus == 'incomplete'){
        //     console.log('INCOMPLETE');
        //     return 'incomplete';
        // }
        // else {
        //     return true
        // }
    }
    return false
}

export default AuthUser()