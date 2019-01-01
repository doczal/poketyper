import React, { Component } from 'react';
import Timer from './Timer';
import Navigation from './Navigation';
import pokemon from '../pokemon.json';
import shuffle from 'shuffle-array';
import { AuthUserContext } from './Session';
import { withFirebase } from './Firebase';
import { compose } from 'recompose';
import '../styles/Game.scss';
import * as gs from '../constants/gameStates';

class Game extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
    this.state = {
      pokemon: shuffle(pokemon),
      currPokemon: null,
      totalPokemon: pokemon.length,
      pointer: 0,
      answer: '',
      score: 0,
      time: 10000,
      status: gs.STATUS_LOADING,
    };
  }

  componentDidMount() {
    const { pokemon, pointer } = this.state;
    //Preload all Pokemon images
    for(let pkmn of pokemon) {
      //console.log(`${process.env.PUBLIC_URL}/img/${pkmn.img}`);
      const img = new Image();
      img.src = `${process.env.PUBLIC_URL}/img/${pkmn.img}`;
    }
    this.setState({
      currPokemon: pokemon[pointer],
      status: gs.STATUS_READY,
    });
  }

  handleChange = (e) => {
    if(!this.timerId) {
      console.log(this.props.firebase);
      this.startTimer();
      this.setState({
        status: gs.STATUS_PLAYING,
      });
    }
    if(this.state.status !== gs.STATUS_FINISHED) {
      this.setState({
        answer: e.target.value,
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.status === gs.STATUS_PLAYING) {
      const { answer, currPokemon } = this.state;
      if(answer.toLowerCase() === currPokemon.name.toLowerCase()) {
        this.setState((prevState) => ({
          score: prevState.score + 1,
        }));
        this.getNext();
      }
      this.setState({
        answer: '',
      });
    }
  }

  getNext = () => {
    const { pokemon } = this.state;
    //console.log(pointer);
    //console.log(totalPokemon - 1);
    this.setState((prevState) => ({
      pointer: prevState.pointer + 1,
      currPokemon: pokemon[prevState.pointer + 1],
    }));
  }

  //Timer functions
  delta = () => {
    const now = Date.now();
    const delta = now - this.offset;
    this.offset = now;
    return delta;
  }

  startTimer = () => {
    if(!this.timerId) {
      this.offset = Date.now();
      this.timerId = setInterval(this.updateTimer, 100);
    }
  }

  stopTimer = () => {
    if(this.timerId) {
      clearInterval(this.timerId);
    }
  }

  updateTimer = () => {
    this.setState((prevState) => ({
      time: prevState.time - this.delta(),
    }),
    () => {
      if(this.state.time <= 0) {
        let authUser = this.context;
        this.setState({
          status: gs.STATUS_FINISHED,
          time: 0,
        },
        () => {
          let usersRef = this.props.firebase.db.collection("users");
          if(authUser !== 'loading' && authUser !== null) {
            let docRef = usersRef.doc(authUser.uid);
            docRef.get().then((doc) => {
              if(doc.exists && this.state.score > doc.data().score) {
                usersRef.doc(authUser.uid).update({
                  score: this.state.score,
                }).then(() => {
                  console.log("Document updated!");
                }).catch((err) => {
                  console.log(err);
                });
              }
            });
          }
        });
        this.stopTimer();
      }
    });
  }

  render() {
    const { currPokemon, time, answer, status, score } = this.state;

    return (
      <div>
        <Navigation />
        {
          status !== gs.STATUS_LOADING ? (
            <div>
              <div className="spriteContainer">
                <img src={`${process.env.PUBLIC_URL}/img/${currPokemon.img}`} alt={currPokemon.name}/>
              </div>
              <form onSubmit={this.handleSubmit}>
                <input
                  disabled={status === gs.STATUS_FINISHED}
                  type="text"
                  onChange={this.handleChange}
                  value={answer}
                />
              </form>
              { status === gs.STATUS_FINISHED ? (<div>Your final score is: {score}</div>) : null}
              <Timer 
                time={time}
              />
            </div>
          ) : (
            <div className="loader">Now loading...</div>
          )
        }
      </div>
    );
  }
}

// const Game = () => (
//   <AuthUserContext.Consumer>
//   { authUser =>
//     <GameBase authUser={authUser} />
//   }
//   </AuthUserContext.Consumer>
// )

export default withFirebase(Game);