import React, { Component } from 'react';
import { AuthUserContext } from './Session';
import { withFirebase } from './Firebase';
import Loader from './Loader';


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
      //debugger;
      this.setState({
        highscores: querySnapshot.docs.map((documentSnapshot) => documentSnapshot.data()),
      });
      //debugger;
    });
  }

  render() {
    
    return (
      <div>
        <ul>
          <h1>High Scores:</h1>
          {
            this.state.highscores.length > 0 ? 
              this.state.highscores.map(item => (
                <li>{`${item.name}: ${item.score}`}</li>
              )) :
              <Loader />
          }
        </ul>
      </div>
    );
  }
  
};

export default withFirebase(Leaderboard);