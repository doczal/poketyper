import React from 'react';
import '../styles/SignOut.scss';
import { withFirebase } from './Firebase';

const SignOutButton = ({ firebase }) => (
  <button className="SignOutButton" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);

export default withFirebase(SignOutButton);