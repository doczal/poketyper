import React, { Component } from 'react';
import '../styles/App.scss';

import LandingPage from './Landing';
import SignUpPage from './SignUp';
import Game from './Game'
import { BrowserRouter as Router, Route } from 'react-router-dom';

import * as ROUTES from '../constants/routes';
import { withAuthentication } from './Session';

const App = () => (

  <Router>
    <div className="App">
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.GAME} component={Game} />
    </div>
  </Router>

);

export default withAuthentication(App);
