import React, { useCallback, useContext, useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { withRouter, Redirect } from "react-router";

function PageNotFound(props){
    const history = useHistory();
  
    return (
        <div style={{marginTop:"3vh",marginLeft:"3vh"}}>
            <p>Page Not Found</p>
            <p style={{fontSize:"12px",textDecoration:"underline",marginTop:"20px",color:"#52B8A6",cursor:"pointer"}} onClick={() => history.push("/login")}>Login</p>
        </div>
      );
  }
  
  
  export default withRouter(PageNotFound);


