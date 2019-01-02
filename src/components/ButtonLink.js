import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ButtonLink.scss';

const ButtonLink = ({to, children, className=""}) => (
  <button type="button" className={`ButtonLink ${className}`}>
    <Link to={to}>{children}</Link>
  </button>
)

export default ButtonLink;