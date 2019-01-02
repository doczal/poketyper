import React from 'react';
import '../styles/Loader.scss';

const Loader = () => (
  <div className="Loader">
    <img className="LoaderIcon" src={`${process.env.PUBLIC_URL}/img/poketyper_icon.svg`} alt="PokeTyper" />
  </div>
);

export default Loader;