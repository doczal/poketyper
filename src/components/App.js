import React, { Component } from 'react';
import '../styles/App.scss';
import pokemon from '../pokemon.json';
import Timer from './Timer';
import shuffle from 'shuffle-array';

class App extends Component {
  state = {
    pokemon: shuffle(pokemon),
    currPokemon: null,
    totalPokemon: pokemon.length,
    pointer: 0,
    answer: '',
    time: 0,
    finishTime: 0,
  };

  componentDidMount() {
    const { pokemon, pointer } = this.state;
    this.setState({
      currPokemon: pokemon[pointer],
    });
  }

  handleChange = (e) => {
    if(!this.timerId) {
      this.startTimer();
    }
    this.setState({
      answer: e.target.value,
    });
  }

  handleSubmit = (e) => {
    const { answer, currPokemon } = this.state;
    e.preventDefault();
    if(answer.toLowerCase() === currPokemon.name.toLowerCase()) {
      this.getNext();
    } else {
      alert('wrong!');
    }
    this.setState({
      answer: '',
    });
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
    const { currPokemon, time, updateTime } = this.state;
    return (
      <div className="App">
      {
        this.state.currPokemon ?
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
