import React from 'react';
import { Link } from 'react-router-dom';
import Styles from './HomeStyles';

const pages = [
  { url: '/bar-chart', name: 'Bar Chart' },
  { url: '/nyc-crime', name: 'NYC Crime' },
];

const Home = ({

}: Props) => (
  <div>
    {pages.map(({ url, name }) => (
      <Link to={url}>
        <span>{name}</span>
      </Link>
    ))}
  </div>
);

export default Home;
