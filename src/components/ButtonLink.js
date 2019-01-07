import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ButtonLink.scss';

const ButtonLink = ({to, children, className=""}) => (
  <Link className={`ButtonLink ${className}`} to={to}>{children}</Link>
)

export default ButtonLink;