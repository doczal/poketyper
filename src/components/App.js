import React, { Component } from 'react';
import '../styles/App.scss';
import pokemon from '../pokemon.json';
import Timer from './Timer';
import shuffle from 'shuffle-array';

const STATUS_LOADING = 'STATUS_LOADING',
      STATUS_READY = 'STATUS_READY',
      STATUS_PLAYING = 'STATUS_PLAYING',
      STATUS_FINISHED = 'STATUS_FINISHED';

class App extends Component {
  state = {
    pokemon: shuffle(pokemon),
    currPokemon: null,
    totalPokemon: pokemon.length,
    pointer: 0,
    answer: '',
    time: 0,
    finishTime: 0,
    status: STATUS_LOADING,
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
      status: STATUS_READY,
    });
  }

  handleChange = (e) => {
    if(!this.timerId) {
      this.startTimer();
      this.setState({
        status: STATUS_PLAYING,
      });
    }
    if(this.state.status !== STATUS_FINISHED) {
      this.setState({
        answer: e.target.value,
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.status === STATUS_PLAYING) {
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
        status: STATUS_FINISHED,
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
      <div className="App">
      {
        this.state.status !== STATUS_LOADING ?
        (
          <div>
            <div className="spriteContainer">
              <img src={`${process.env.PUBLIC_URL}/img/${currPokemon.img}`} alt={currPokemon.name}/>
            </div>
            <form onSubmit={this.handleSubmit}>
              <input 
                type="text"
                onChange={this.handleChange}
                value={this.state.answer}
              />
            </form>
            { this.state.status === STATUS_FINISHED ? (<div>Congrats! Your final time is:</div>) : null}
            <Timer 
              time={time}
            />
          </div>
        ) :
        (
          <div className="loader">Now loading...</div>
        )
      }
      </div>
    );
  }
}

export default App;
