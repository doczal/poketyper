import React, { Component } from 'react';
import '../styles/Form.scss';
import '../styles/SignUp.scss';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import * as ROUTES from '../constants/routes';
import { withAuthorization } from './Session';
import Navigation from './Navigation';

const SignUpPage = () => (
  <div className="SignUpContainer">
    <Navigation />
    <h1 className="Heading">Create An Account</h1>
    <p className="SubDesc">Sign up now to compete on the Indigo Plateau leaderboard!</p>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  signUpComplete: false,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (e) => {
    const { username, email, passwordOne } = this.state;
    const { firebase } = this.props;

    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        firebase.addNewUserToDB(username, authUser.user.uid);
      })
      .then(() => {
        //sign
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.GAME);
      })
      .catch(error => {
        this.setState({ error });
      });
    
    e.preventDefault();
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form className="Form" onSubmit={this.onSubmit}>
        <input 
          name="username"
          value={username}
          onChange={this.onChange}
          maxLength={20}
          type="text"
          placeholder="Username"
        />
        <input 
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email"
        />
        <input 
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <input 
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <button className="Button" disabled={isInvalid} type="submit">Sign Up</button>

        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

const condition = authUser => {
  if(authUser === null) {
    return true;
  }
  return false;
}

export default withAuthorization(condition)(SignUpPage);
//export default SignUpPage;

export { SignUpForm, SignUpLink };