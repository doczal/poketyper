import React, { Component } from 'react';
import '../styles/App.scss';
import Game from './Game'
import { BrowserRouter as Router } from 'react-router-dom';

class App extends Component {

  render() {
    
    return (
      <Router>
        <div className="App">
          <Game />
        </div>
      </Router>
    );
  }
}

export default App;
