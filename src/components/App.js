import React, { Component } from 'react';
import '../styles/App.scss';
import pokemon from '../pokemon.json';
import Game from './Game'
import shuffle from 'shuffle-array';
import { BrowserRouter as Router } from 'react-router-dom';
import * as gs from '../constants/gameStates';

class App extends Component {
  state = {
    pokemon: shuffle(pokemon),
    currPokemon: null,
    totalPokemon: pokemon.length,
    pointer: 0,
    answer: '',
    time: 0,
    finishTime: 0,
    status: gs.STATUS_LOADING,
  };

  componentDidMount() {
    const { pokemon, pointer } = this.state;
    //Preload all Pokemon images
    for(let pkmn of pokemon) {
      console.log(`${process.env.PUBLIC_URL}/img/${pkmn.img}`);
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
        this.getNext();
      }
      this.setState({
        answer: '',
      });
    }
  }

  getNext = () => {
    const { pointer, totalPokemon, pokemon } = this.state;
    console.log(pointer);
    console.log(totalPokemon - 1);
    if(pointer < totalPokemon - 1) {
      this.setState((prevState) => ({
        pointer: prevState.pointer + 1,
        currPokemon: pokemon[prevState.pointer + 1],
      }));
    } else {
      this.setState({
        finishTime: this.state.time,
        status: gs.STATUS_FINISHED,
      })
      this.stopTimer();
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
      time: prevState.time + this.delta(),
    }));
  }

  render() {
    const { currPokemon, time } = this.state;
    return (
      <Router>
        <div className="App">
        {
          this.state.status !== gs.STATUS_LOADING ?
          (
            <Game
              time={time}
              pokemon={currPokemon}
            />
          ) :
          (
            <div className="loader">Now loading...</div>
          )
        }
        </div>
      </Router>
    );
  }
}

export default App;
