import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthUser from "./Auth";
import Cookies from 'js-cookie'

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps =>
        AuthUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={'signup'} />
        )
      }
    />
  );
};


export default PrivateRoute