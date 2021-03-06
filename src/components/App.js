import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import ChatBot from "./Chatbot";
import SightingsList from "./SightingsList";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <ChatBot />
        </Route>
        <Route path="/sightings">
          <SightingsList />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
