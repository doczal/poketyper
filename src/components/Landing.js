import React from 'react';
import { Link } from 'react-router-dom';
import SignIn from './SignIn';
import * as ROUTES from '../constants/routes';
import { withAuthorization } from './Session';

const Landing = () => (
  <div>
    <h1>Landing</h1>
    <SignIn />
    <Link to={ROUTES.GAME}>Play as Guest</Link>
  </div>
)

const condition = authUser => {
  return !authUser;
}

export default withAuthorization(condition)(Landing);