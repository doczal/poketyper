import React from 'react';
import '../styles/Landing.scss';
import { Link } from 'react-router-dom';
import SignIn from './SignIn';
import * as ROUTES from '../constants/routes';
import { withAuthorization } from './Session';

const Landing = () => (
  <div className="Landing">
    <img className="MainLogo" src={`${process.env.PUBLIC_URL}/img/poketyper_tsp.svg`} alt="PokeTyper" />
    <SignIn />
  </div>
)

//Signed in users will be redirected to game
const condition = authUser => {
  if(authUser === null) {
    return true;
  }
  return false;
}

export default withAuthorization(condition)(Landing);