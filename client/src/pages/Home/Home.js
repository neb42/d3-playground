import React from 'react';
import { Link } from 'react-router-dom';

const pages = [
  { url: '/bar-chart', name: 'Bar Chart' },
  { url: '/nyc-crime', name: 'NYC Crime' },
  { url: '/crypto', name: 'Crypto' },
];

const Home = () => (
  <div>
    {pages.map(({ url, name }) => (
      <Link to={url}>
        <span>{name}</span>
      </Link>
    ))}
  </div>
);

export default Home;
