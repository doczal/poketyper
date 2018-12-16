import React, { Component } from 'react';
import '../styles/App.scss';
import pokemon from '../pokemon.json';
import Timer from './Timer';

class App extends Component {
  state = {
    pokemon: pokemon,
    currPokemon: null,
    pointer: 0,
    answer: '',
    finishTime: 0,
  };

  componentDidMount() {
    const { pokemon, pointer } = this.state;
    this.setState({
      currPokemon: pokemon[pointer],
    });
  }

  handleChange = (e) => {
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
    this.setState((prevState) => ({
      pointer: prevState.pointer + 1,
      currPokemon: this.state.pokemon[prevState.pointer + 1],
    }));
  }

  render() {
    const { currPokemon } = this.state;
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
            <Timer />
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
