import React, { Component } from 'react';
import Timer from './Timer';
import Navigation from './Navigation';
import Loader from './Loader'
import pokemon from '../pokemon.json';
import shuffle from 'shuffle-array';
import { AuthUserContext } from './Session';
import { withFirebase } from './Firebase';
import '../styles/Game.scss';
import * as gs from '../constants/gameStates';

const SCORE_CORRECT = 10;
const SCORE_WRONG = 2;
const CLASS_CORRECT = "Correct";
const CLASS_WRONG = "Wrong";
const TIME_LIMIT = 120000;
const MAX_COMBO = 10;

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
      combo: 0,
      highScore: 0,
      highScoreLoaded: false,
      time: TIME_LIMIT,
      loadedSprites: 0,
      status: gs.STATUS_LOADING,
    };

    this.answerBox = React.createRef();
  }

  componentDidMount() {
    
    const { pokemon } = this.state;

    this.setState({
      currPokemon: pokemon[0],
    });

    //Load initial high score from DB if logged in
    this.loadHighScores();
    
    this.preloadSprites();
  }

  componentWillUnmount() {
    if(this.timerId) {
      clearInterval(this.timerId);
    }
  }

  handleSpriteLoaded = () => {
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

  loadHighScores = () => {
    //console.log(this.context);
    let authUser = this.context;
    if(authUser !== 'loading' && authUser !== null) {
      let usersRef = this.props.firebase.db.collection("users");
      let docRef = usersRef.doc(authUser.uid);
      docRef.get().then((doc) => {
        if(doc.exists && doc.data().score > 0) {
          this.setState({
            highScore: doc.data().score,
            highScoreLoaded: true,
          });
        } else {
          this.setState({
            highScoreLoaded: true,
          });
        }
      });
    } else {
      this.setState({
        highScoreLoaded: true,
      });
    }
  }

  restartGame = () => {
    this.setState({
      pokemon: shuffle(pokemon),
      currPokemon: pokemon[0],
      pointer: 0,
      answer: '',
      score: 0,
      combo: 0,
      time: TIME_LIMIT,
      status: gs.STATUS_READY,
    });
  }

  handleChange = (e) => {
    if(this.state.status === gs.STATUS_READY) {
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

    if(this.state.status === gs.STATUS_PLAYING) {
      const { answer, currPokemon } = this.state;
      if(answer.toLowerCase() === "asdf") {//currPokemon.name.toLowerCase()) {
        // Correct Answer
        this.flashInput(CLASS_CORRECT);
        this.setState((prevState) => ({
          combo: prevState.combo >= MAX_COMBO ? MAX_COMBO : prevState.combo + 1,
          score: prevState.score + SCORE_CORRECT + prevState.combo,
        }));
        this.getNext();
      } else {
        //Wrong Answer
        this.flashInput(CLASS_WRONG);
        this.setState((prevState) => ({
          combo: 0,
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
    //console.log(pointer);
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
        this.setState({
          status: gs.STATUS_SCORE_CHECK,
        },
        () => {
          let docRef = usersRef.doc(authUser.uid);
          docRef.get().then((doc) => {
            if(doc.exists && this.state.score > doc.data().score) {
              usersRef.doc(authUser.uid).update({
                score: this.state.score,
              }).then(() => {
                this.setState({
                  status: gs.STATUS_SCORE_SUBMIT,
                  highScore: this.state.score,
                });
                console.log("Document updated!");
              }).catch((err) => {
                console.log(err);
                this.setState({
                  status: gs.STATUS_SCORE_NOT_SUBMIT,
                });
              });
            } else {
              this.setState({
                status: gs.STATUS_SCORE_NOT_SUBMIT,
              });
            }
          });
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
    const { pokemon, currPokemon, time, answer, status, score, highScore, highScoreLoaded, pointer, combo } = this.state;
    let gameOverMessage;

    if(status === gs.STATUS_SCORE_CHECK) {
      gameOverMessage = <GameOverText>Checking score...</GameOverText>;
    } else if (status === gs.STATUS_SCORE_SUBMIT) {
      gameOverMessage = <GameOverText>New High Score achieved! Score has been submitted.</GameOverText>;
    } else if (status === gs.STATUS_SCORE_NOT_SUBMIT) {
      gameOverMessage = <GameOverText>You didn't do your very best. Try again!</GameOverText>;
    } else if (status === gs.STATUS_FINISHED) {
      gameOverMessage = <GameOverText>Game Over.</GameOverText>;
    }

    return (
      <div className="GameContainer">
        <Navigation disabled={status === gs.STATUS_PLAYING} />
        {
          status !== gs.STATUS_LOADING ? (
            <div className="Game">
              <h1 className="Heading">PokéTyper</h1>
              { this.context === null ? (<GuestText />) : null}
              <div className="GameInfo">
                <div className="SubInfo">
                  <h2>Caught</h2>
                  <div className="Caught">{`${pointer}/${pokemon.length}`}</div>
                </div>
                <div className="SubInfo">
                  <h2>Time</h2>
                  <Timer time={time} />
                </div>
                <div className="SubInfo">
                  <h2>Score</h2>
                  <div className="Score">{score}</div>
                </div>
                <div className="SubInfo">
                  <h2>Hi-Score</h2>
                  <div className="Score">{highScoreLoaded ? highScore : "..."}</div>
                </div>
                
              </div>
              { gameOverMessage }
              {
                status === gs.STATUS_PLAYING ?
                <div className={`ComboText${combo >= MAX_COMBO ? " ComboMax" : ""}`}>{`Current Combo: ${combo < MAX_COMBO ? combo : "MAX"}`}</div> :
                null
              }
              <div className="SpecialBorder">
                <div className="SpriteContainer">
                  <img className="PokemonSprite" src={`${process.env.PUBLIC_URL}/img/${currPokemon.img}`} alt={currPokemon.name}/>
                </div>
              </div>
              <form className="GameForm" onSubmit={this.handleSubmit}>
                <input className="AnswerBox"
                  ref={this.answerBox}
                  placeholder="Who's that Pokémon?"
                  disabled={status !== gs.STATUS_READY && status !== gs.STATUS_PLAYING}
                  type="text"
                  onChange={this.handleChange}
                  value={answer}
                />
              </form>
              { status === gs.STATUS_FINISHED || status === gs.STATUS_SCORE_NOT_SUBMIT || status === gs.STATUS_SCORE_SUBMIT ? 
                (<button 
                  className="ResetButton"
                  type="button"
                  onClick={this.restartGame}
                 >
                  Restart
                 </button>) : 
                null }
              <div className="TextInfo">Protip: For gender-based Pokémon, type 'M' or 'F' after their name.</div>
            </div>
          ) : (
            <Loader />
          )
        }
      </div>
    );
  }
}

const GuestText = () => (
  <div className="TextInfo">Playing as guest (Score will not be submitted)</div>
)

const GameOverText = (props) => (
  <div className="GameOverText">{props.children}</div>
)

export default withFirebase(Game);