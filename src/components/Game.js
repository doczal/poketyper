import React, { Component } from 'react';
import Timer from './Timer';
import '../styles/Game.scss';
import * as gs from '../constants/gameStates';

const Game = (props) => {
  const { time, pokemon, answer, handleSubmit, handleChange, status } = props;
  return (
    <div>
      <div className="spriteContainer">
        <img src={`${process.env.PUBLIC_URL}/img/${pokemon.img}`} alt={pokemon.name}/>
      </div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          onChange={handleChange}
          value={answer}
        />
      </form>
      { status === gs.STATUS_FINISHED ? (<div>Congrats! Your final time is:</div>) : null}
      <Timer 
        time={time}
      />
    </div>
  );
  
}

export default Game;