import React, { Component } from 'react';
import { AuthUserContext } from './Session';
import { withFirebase } from './Firebase';
import Loader from './Loader';
import Navigation from './Navigation';
import '../styles/Leaderboard.scss';

const elites = [
  { 
    sprite: "blue",
    title: "Pokémon Champion",
  },
  { 
    sprite: "lance",
    title: "Elite Four",
  },
  { 
    sprite: "agatha",
    title: "Elite Four",
  },
  { 
    sprite: "bruno",
    title: "Elite Four",
  },
  { 
    sprite: "lorelei",
    title: "Elite Four",
  },
];


class Leaderboard extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
    this.state = {
      highscores: [],
      isInLeaderboard: false,
      loaded: false,
      myInfo: null,
    }
  }

  componentDidMount() {

    // this.setState({
    //   highscores: [
    //     {
    //       name: "Blue",
    //       score: 500,
    //     },
    //     {
    //       name: "Lance",
    //       score: 400,
    //     },
    //     {
    //       name: "Agatha",
    //       score: 300,
    //     },
    //     {
    //       name: "Bruno",
    //       score: 200,
    //     },
    //     {
    //       name: "FruitsPunchPachi",
    //       score: 100,
    //     },
    //   ]
    // });

    if(this.context) {
      this.props.firebase.getMyInfoFromDB(this.context.uid).then((doc) => {
        if(doc.exists) {
          this.setState({
            myInfo: doc.data(),
          });
        }
      }).then(() => {
        this.loadHighScores();
      });
    } else {
      this.loadHighScores();
    }
  }

  loadHighScores = () => {
    this.props.firebase.getHighScoresFromDB().then((querySnapshot) => {
      this.setState({
        highscores: querySnapshot.docs.map((documentSnapshot) => ({
          name: documentSnapshot.data().name,
          score: documentSnapshot.data().score,
          id: documentSnapshot.id,
        })),
      }, () => {
        let inLeaderboard = false;
        if(this.context) {
          for(let score of this.state.highscores) {
            if(this.context.uid === score.id) {
              inLeaderboard = true;
              break;
            }
          }
          this.setState({
            loaded: true,
            isInLeaderboard: inLeaderboard,
          });
        } else {
          this.setState({
            loaded: true,
          });
        }
      });
    });
  }
  

  render() {
    return (
      <div className="LeaderboardContainer">
        <Navigation />
        {
          this.state.loaded ? 
            <LeaderboardDisplay 
              highscores={this.state.highscores}
              authUser={this.context}
              isInLeaderboard={this.state.isInLeaderboard}
              playerInfo={this.state.myInfo}
            /> :
            <Loader />
        }
      </div>
    );
  }
};

const LeaderboardDisplay = ({highscores, authUser, isInLeaderboard, playerInfo}) => {  
  
  let topScorers = highscores.map((item, index) => (
    <PlayerDisplay
      key={item.id}
      img={authUser && item.id === authUser.uid ? "red" : elites[index].sprite}
      name={item.name}
      title={authUser && item.id === authUser.uid ? elites[index].title + " (You)" : elites[index].title}
      score={item.score}
    />
  ));

  return (
    <div className="Leaderboard">
      <h1 className="Heading">Indigo Plateau</h1>
      <p className="SubDesc">The PokéTyper Leaderboard</p>
      <div className="LeaderboardMain">
        {topScorers}
      </div>
      {
        authUser && !isInLeaderboard ?
        <div className="LeaderboardPlayer">
          <h2>Your Score</h2>
          <PlayerDisplay
            key={authUser.uid}
            img="red"
            name={playerInfo.name}
            title="The Challenger"
            score={playerInfo.score}
          />
        </div> :
        null
      }
      
    </div>
  );

}

function shortenName(name) {
  if(name.length > 16) {
    return name.slice(0, 16) + "...";
  }
  return name;
}

const PlayerDisplay = ({ img, name, score, title }) => (
  <div className="PlayerDisplay">
    <div className="PlayerProfile">
      <img className="PlayerSprite" src={`${process.env.PUBLIC_URL}/img/${img}.png`} alt=""/>
      <div className="PlayerDesc">
        <h3 className="PlayerName">{shortenName(name)}</h3>
        <span className="PlayerTitle">{title}</span>
      </div>
    </div>
    <div className="PlayerScore">
      {score}
    </div>
  </div>
);

export default withFirebase(Leaderboard);