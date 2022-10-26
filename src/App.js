import { gapi } from "gapi-script";
import React, {useEffect} from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Home from "./container/Home";

const App = () => {
  useEffect(()=>{
    gapi.load('auth2', function(){
      gapi.auth2.init();
    })
  },[])

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
};

export default App;
