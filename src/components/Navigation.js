import React from 'react';
import '../styles/Navigation.scss';
import { Link } from 'react-router-dom';
import SignOut from './SignOut';
import * as ROUTES from '../constants/routes';
import { AuthUserContext } from './Session'
import ButtonLink from './ButtonLink';

const Navigation = () => (
  <AuthUserContext.Consumer>
    { authUser => 
      <nav className="Navigation">
        <Link to={ROUTES.GAME}>
          <img className="Logo" src={`${process.env.PUBLIC_URL}/img/poketyper_icon.svg`} alt="PokeTyper" />
        </Link>
        
        
        <div className="NavigationRight">
        <ButtonLink className="LeaderboardLink" to={ROUTES.LEADERBOARD}>Leaderboard</ButtonLink>
        { authUser ? <SignOut /> : <ButtonLink to={ROUTES.LANDING}>Sign In</ButtonLink> }
        </div>
        
      </nav>
    }
  </AuthUserContext.Consumer>
  
);

export default Navigation;