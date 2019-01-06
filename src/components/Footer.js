import React from 'react';
import '../styles/Footer.scss';

const year = new Date().getFullYear();

const Footer = () => (
  <footer className="Footer">
    <p>Pokémon And All Respective Names are Trademark &amp; © of Nintendo 1996 - {year}</p>
  </footer>
);

export default Footer;