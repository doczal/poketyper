import React from 'react';
import { Link } from 'react-router-dom';
import SignOut from './SignOut';
import * as ROUTES from '../constants/routes';
import { AuthUserContext } from './Session'

const Navigation = () => (
  <AuthUserContext.Consumer>
    { authUser => 
      <nav>
        <h1>PokeTyper</h1>
        { authUser ? <SignOut /> : <Link to={ROUTES.LANDING}>Sign In</Link> }
      </nav>
    }
  </AuthUserContext.Consumer>
  
);

export default Navigation;