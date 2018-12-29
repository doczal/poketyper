import React, { Component } from 'react';
import Timer from './Timer';
import Navigation from './Navigation';
import pokemon from '../pokemon.json';
import shuffle from 'shuffle-array';
import '../styles/Game.scss';
import * as gs from '../constants/gameStates';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemon: shuffle(pokemon),
      currPokemon: null,
      totalPokemon: pokemon.length,
      pointer: 0,
      answer: '',
      points: 0,
      time: 120000,
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
    console.log('done');
    this.setState({
      currPokemon: pokemon[pointer],
      status: gs.STATUS_READY,
    });
  }

  handleChange = (e) => {
    if(!this.timerId) {
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
          points: prevState.points + 1,
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
        this.setState({
          status: gs.STATUS_FINISHED,
          time: 0,
        });
        this.stopTimer();
      }
    });
  }

  render() {
    const { currPokemon, time, answer, status, points } = this.state;

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
              { status === gs.STATUS_FINISHED ? (<div>Your final score is: {points}</div>) : null}
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

export default Game;