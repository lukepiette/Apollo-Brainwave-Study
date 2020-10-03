import React, { Component } from 'react';
// import { PageSwitcher } from "../PageSwitcher/PageSwitcher";
// import { AppProvider, Card, Page, Link } from "@shopify/polaris";
// import enTranslations from "@shopify/polaris/locales/en.json";
// import * as translations from "./translations/en.json";



import {Router, Route, Redirect, Switch} from "react-router";
import { BrowserRouter } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import LoginForm from './comps/Login.jsx'
import SignupForm from './comps/Signup.jsx'
import DashboardForm from './comps/Dashboard.jsx'
import HistoryForm from './comps/History.jsx'
import PageNotFound from './comps/Error404.jsx'

import Callibration from './comps/Callibration.jsx'
import Fitting from './comps/Fitting.jsx'
import Meditate from './comps/Meditate.jsx'
import Help from './comps/Help.jsx'



export class App extends Component {
  render() {
    return (
      <BrowserRouter>
          <Switch>
            <Redirect exact from="/" to="/signup" />
            <Route path={"/login"} component={LoginForm}/>
            <Route path={"/signup"} component={SignupForm}/>
            <Route path={"/help"} component={Help}/>
            {/* <Route path={"/test"} component={LineGraph}/> */}
            
            <PrivateRoute path={"/callibration"} component={Callibration}/>
            <PrivateRoute path={"/fitting"} component={Fitting}/>
            <PrivateRoute path={"/dashboard"} component={DashboardForm}/>
            <PrivateRoute path={"/meditate"} component={Meditate}/>
            <PrivateRoute path={"/history"} component={HistoryForm}/>

            <Route component={PageNotFound}/>
          </Switch>
      </BrowserRouter>
    );
  }
}

