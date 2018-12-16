import React, { Component } from 'react';
import '../styles/Timer.scss';

class Timer extends Component {
  padZeroes(units) {
    let timeStr = units.toString();
    if(timeStr.length < 2) {
      timeStr = "0" + timeStr;
    }
    return timeStr;
  }

  displayTime = (ms) => {
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let milliseconds = Math.floor(((ms % 60000) % 1000) / 100); //milliseconds but displayed single digit, since we only update every 100ms
    
    minutes = minutes > 99 ? 99 : minutes; //Set a max of 99 minutes

    return `${this.padZeroes(minutes)}:${this.padZeroes(seconds)}.${milliseconds}`;
  }

  render() {
    return (
      <div>{this.displayTime(this.props.time)}</div>
    );
  }
}

export default Timer;