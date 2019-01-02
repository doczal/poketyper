import React, { Component } from 'react';
import '../styles/App.scss';

import LandingPage from './Landing';
import Loader from './Loader';
import SignUpPage from './SignUp';
import Leaderboard from './Leaderboard';
import Game from './Game'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthUserContext } from './Session'

import * as ROUTES from '../constants/routes';
import { withAuthentication } from './Session';

const App = () => {
  return (
    <AuthUserContext.Consumer>
      { authUser => 
          authUser !== 'loading' ?
          <Router>
            <div className="App">
              <Route exact path={ROUTES.LANDING} component={LandingPage} />
              <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
              <Route exact path={ROUTES.GAME} render={() => <Game />} />
              <Route exact path={ROUTES.LEADERBOARD} component={Leaderboard} />
            </div>
          </Router> :
          <Loader />
      }
    </AuthUserContext.Consumer>
  )
  

  // <Router>
  //   <div className="App">
  //     <Route exact path={ROUTES.LANDING} component={LandingPage} />
  //     <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
  //     <Route exact path={ROUTES.GAME} render={() => <Game />} />
  //   </div>
  // </Router> :
  // null
}  

export default withAuthentication(App);
