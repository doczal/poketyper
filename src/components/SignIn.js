import React, { Component } from 'react';
import '../styles/SignIn.scss';
import '../styles/Form.scss';
import ButtonLink from './ButtonLink';
import { withRouter } from 'react-router-dom';
import { SignUpLink } from './SignUp';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import * as ROUTES from '../constants/routes';

const SignInPage = () => (
  <div className="SignInContainer">
    <SignInForm />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (e) => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        //window.location.reload();
        //this.props.history.push(ROUTES.GAME);
      })
      .catch(error => {
        this.setState({ error });
      });
    
    e.preventDefault();
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <form className="Form" onSubmit={this.onSubmit}>
        <input 
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email"
        />
        <input 
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <button className="Button" disabled={isInvalid} type="submit">Sign In</button>
        {error && <p className="ErrorMessage">{error.message}</p>}
        <ButtonLink to={ROUTES.GAME}>Play as Guest</ButtonLink>
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };