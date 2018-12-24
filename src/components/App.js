import React, { Component } from 'react';
import '../styles/App.scss';

import LandingPage from './Landing';
import SignUpPage from './SignUp';
import Game from './Game'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

class App extends Component {

  render() {
    
    return (
      <Router>
        <div className="App">
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route exact path={ROUTES.SIGN_IN} component={LandingPage} />
          <Route exact path={ROUTES.GAME} component={Game} />
        </div>
      </Router>
    );
  }
}

export default App;
