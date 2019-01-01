import React, { Component } from 'react';
import { AuthUserContext } from './Session';
import { withFirebase } from './Firebase';


class Leaderboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      highscores: [],
    }
  }

  componentDidMount() {
    this.props.firebase.getHighScoresFromDB().then((querySnapshot) => {
      //console.log(querySnapshot.documents);
      this.setState({
        highscores: querySnapshot.docs.map((documentSnapshot) => documentSnapshot.data()),
      });
    });
  }

  render() {
    
    return (
      <div>
        <ul>
          <h1>High Scores:</h1>
          {
            this.state.highscores.map(item => (
              <li>{`${item.name}: ${item.score}`}</li>
            ))
          }
        </ul>
      </div>
    );
  }
  
};

export default withFirebase(Leaderboard);