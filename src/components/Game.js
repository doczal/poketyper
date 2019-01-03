import React, { Component } from 'react';
import Timer from './Timer';
import Navigation from './Navigation';
import Loader from './Loader'
import pokemon from '../pokemon.json';
import shuffle from 'shuffle-array';
import { AuthUserContext } from './Session';
import { withFirebase } from './Firebase';
import { compose } from 'recompose';
import '../styles/Game.scss';
import * as gs from '../constants/gameStates';

const SCORE_CORRECT = 10;
const SCORE_WRONG = 2;
const CLASS_CORRECT = "Correct";
const CLASS_WRONG = "Wrong";
const TOTAL_POKEMON = 151;
const TIME_LIMIT = 10000;//111000;

class Game extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
    this.state = {
      pokemon: shuffle(pokemon),
      currPokemon: null,
      pointer: 0,
      answer: '',
      score: 0,
      time: TIME_LIMIT,
      imgElems: [],
      loadedSprites: 0,
      status: gs.STATUS_LOADING,
    };

    this.answerBox = React.createRef();
  }

  componentDidMount() {
    const { pokemon, pointer } = this.state;
    //Preload all Pokemon images
    // for(let pkmn of pokemon) {
    //   //console.log(`${process.env.PUBLIC_URL}/img/${pkmn.img}`);
    //   const img = new Image();
    //   img.src = `${process.env.PUBLIC_URL}/img/${pkmn.img}`;
    //   img.onload = () => { console.log('loaded') };
    // }
    // console.log('READY');
    this.setState({
      currPokemon: pokemon[0],
    });

    this.preloadSprites();
  }

  componentWillUnmount() {
    if(this.timerId) {
      clearInterval(this.timerId);
    }
  }

  handleSpriteLoaded = () => {
    console.log('loaded');
    this.setState((prevState) => ({
      loadedSprites: prevState.loadedSprites + 1,
    }),
    () => {
      if(this.state.loadedSprites >= this.state.pokemon.length) {
        this.setState({
          status: gs.STATUS_READY,
        });
      }
    });
  }

  preloadSprites = () => {
    const { pokemon } = this.state;
    let totalLoaded = 0;
    const spriteArr = [];
    //Preload all Pokemon images
    for(let pkmn of pokemon) {
      //console.log(`${process.env.PUBLIC_URL}/img/${pkmn.img}`);
      const img = new Image();
      img.src = `${process.env.PUBLIC_URL}/img/${pkmn.img}`;
      img.onload = this.handleSpriteLoaded;
      spriteArr.push(img);
      if(totalLoaded >= this.state.pokemon.length) {
        this.setState({
          status: gs.STATUS_READY,
        });
      }
    }
    //Store it so that they can loaded from cache later
    this.spriteElems = spriteArr;
  }

  restartGame = () => {
    this.setState({
      pokemon: shuffle(pokemon),
      currPokemon: pokemon[0],
      pointer: 0,
      answer: '',
      score: 0,
      time: TIME_LIMIT,
      status: gs.STATUS_READY,
    });
  }

  handleChange = (e) => {
    if(this.state.status !== gs.STATUS_PLAYING) {
      this.startTimer();
      this.setState({
        status: gs.STATUS_PLAYING,
      });
    }
    console.log(this.timerId);
    if(this.state.status !== gs.STATUS_FINISHED) {
      this.setState({
        answer: e.target.value,
      });
    }
  }

  flashInput = (className) => {
    if(this.inputAnim) {
      clearTimeout(this.inputAnim);
    }
    this.answerBox.current.classList.remove(CLASS_WRONG, CLASS_CORRECT);
    this.answerBox.current.classList.add(className);
    this.inputAnim = setTimeout(() => {
      this.answerBox.current.classList.remove(CLASS_WRONG, CLASS_CORRECT);
    }, 150);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // this.inputElem = document.getElementsByClassName("AnswerBox")[0];
    // console.log(this.inputElem);
    if(this.state.status === gs.STATUS_PLAYING) {
      const { answer, currPokemon } = this.state;
      if(answer.toLowerCase() === 'asdf') {// currPokemon.name.toLowerCase()) {
        // Correct Answer
        this.flashInput(CLASS_CORRECT);
        this.setState((prevState) => ({
          score: prevState.score + SCORE_CORRECT,
        }));
        this.getNext();
      } else {
        //Wrong Answer
        this.flashInput(CLASS_WRONG);
        this.setState((prevState) => ({
          score: prevState.score - SCORE_WRONG,
        }));
      }
      this.setState({
        answer: '',
      });
    }
  }

  getNext = () => {
    const { pokemon, pointer } = this.state;
    console.log(pointer);
    //console.log(totalPokemon - 1);
    if(pointer < pokemon.length - 1) {
      this.setState((prevState) => ({
        pointer: prevState.pointer + 1,
        currPokemon: pokemon[prevState.pointer + 1],
      }));
    } else {
      this.setState((prevState) => ({
        pointer: prevState.pointer + 1,
      }));
      this.gameOver();
    }
  }

  //Timer functions
  delta = () => {
    const now = Date.now();
    const delta = now - this.offset;
    this.offset = now;
    return delta;
  }

  startTimer = () => {
    this.offset = Date.now();
    this.timerId = setInterval(this.updateTimer, 100);
  }

  stopTimer = () => {
    if(this.timerId) {
      clearInterval(this.timerId);
    }
  }

  gameOver = () => {
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

  updateTimer = () => {
    this.setState((prevState) => ({
      time: prevState.time - this.delta(),
    }),
    () => {
      if(this.state.time <= 0 && this.state.status !== gs.STATUS_FINISHED) {
        this.gameOver();
      }
    });
  }

  render() {
    const { pokemon, currPokemon, time, answer, status, score, pointer } = this.state;

    return (
      <div className="GameContainer">
        <Navigation />
        {
          status !== gs.STATUS_LOADING ? (
            <div className="Game">
              <div className="GameInfo">
                <div className="SubInfo">
                  <h2>Time</h2>
                  <Timer time={time} />
                </div>
                <div className="SubInfo">
                  <h2>Score</h2>
                  <div className="Score">{score}</div>
                </div>
                <div className="SubInfo">
                  <h2>Caught</h2>
                  <div className="Score">{`${pointer}/${pokemon.length}`}</div>
                </div>
              </div>
              { this.context === null ? (<div className="TextInfo">Playing as guest (Score will not be submitted)</div>) : null}
              <div className="SpecialBorder">
                <div className="SpriteContainer">
                  <img className="PokemonSprite" src={`${process.env.PUBLIC_URL}/img/${currPokemon.img}`} alt={currPokemon.name}/>
                </div>
              </div>
              <form className="GameForm" onSubmit={this.handleSubmit}>
                <input className="AnswerBox"
                  ref={this.answerBox}
                  placeholder="Who's that Pokémon?"
                  disabled={status === gs.STATUS_FINISHED}
                  type="text"
                  onChange={this.handleChange}
                  value={answer}
                />
              </form>
              { status === gs.STATUS_FINISHED ? 
                (<button 
                  className="ResetButton"
                  type="button"
                  onClick={this.restartGame}
                 >
                  Restart
                 </button>) : 
                null }
              <div className="TextInfo">Protip: For gender-based Pokémon, type 'M' or 'F' after their name.</div>
              { status === gs.STATUS_FINISHED ? (<div>Your final score is: {score}</div>) : null}
            </div>
          ) : (
            <Loader />
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