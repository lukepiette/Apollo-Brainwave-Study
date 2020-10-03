import firebase from 'firebase';
require('firebase/app');
require('firebase/database');
require('firebase/storage');
require('firebase/auth');

const config = {
    apiKey: "AIzaSyDkYVQIW8MH5C4jY_46-yIecF1QjR1qh7k",
    authDomain: "apollo-brain-study.firebaseapp.com",
    databaseURL: "https://apollo-brain-study.firebaseio.com",
    projectId: "apollo-brain-study",
    storageBucket: "apollo-brain-study.appspot.com",
    messagingSenderId: "975054576087",
    appId: "1:975054576087:web:ddf8d1769c6681185d5392",
    measurementId: "G-EVYSQ7TJQC"
  };

firebase.initializeApp(config);

export default firebase;