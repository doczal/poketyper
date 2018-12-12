import React, { Component } from 'react';
import '../styles/App.scss';
import pokemon from '../pokemon.json';

class App extends Component {
  state = {
    pokemon: pokemon,
  };

  componentDidMount() {

  }

  render() {
    const { pokemon } = this.state;
    return (
      <div className="App">
      {
        this.state.pokemon.length > 0 ?
        (
          <div className="spriteContainer">
            <img src={`${process.env.PUBLIC_URL}/img/${pokemon[0].img}`} alt={pokemon[0].name}/>
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
