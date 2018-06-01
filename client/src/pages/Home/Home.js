import React from 'react';
import { Link } from 'react-router-dom';
import { PALETTE } from '@asidatascience/adler-ui';

const pages = [
  { url: '/bar-chart', name: 'Bar Chart', description: 'A animated bar chart with random data' },
  { url: '/nyc-crime', name: 'NYC Crime', description: 'A multi-line chart of New York crimes by borough, normalised by population' },
  { url: '/crypto', name: 'Crypto', description: 'A line chart of bit coin value with a tooltip showing the average value for the month' },
];

const Home = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: '200px',
  }}>
    {pages.map(({ url, name, description }) => (
      <Link to={url}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '320px',
          width: '200px',
          backgroundColor: PALETTE.grey4,
          boxShadow: '0 5px 10px 0 rgba(34, 51, 62, 0.08)',
          alignItems: 'center',
          textAlign: 'center',
          textDecoration: 'none',
          paddingTop: '80px',
        }}>
          <span style={{
            marginBottom: '50px',  
          }}>
            {name}
          </span>
          <span style={{

          }}>
            {description}
          </span>
        </div>
      </Link>
    ))}
  </div>
);

export default Home;
