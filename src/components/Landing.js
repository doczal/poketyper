import React from 'react';
import '../styles/Landing.scss';
import SignIn from './SignIn';
import { withAuthorization } from './Session';

const Landing = () => (
  <div className="Landing">
    <p className="Disclaimer">This site is best experienced on Desktop devices.</p>
    <img className="MainLogo" src={`${process.env.PUBLIC_URL}/img/poketyper_tsp.svg`} alt="PokeTyper" />
    <h1 className="MainHeading">PokéTyper - Gotta Type 'Em All!</h1>
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