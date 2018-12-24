import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

const Landing = () => (
  <div>
    <h1>Landing</h1>
    <ul>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
      <li>
        <Link to={ROUTES.GAME}>Play as Guest</Link>
      </li>
    </ul>
  </div>
)

export default Landing;