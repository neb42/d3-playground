import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import BarChart from './pages/BarChart';
import NYCCrime from './pages/NYCCrime';
import Crypto from './pages/Crypto';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Redirect path="/" exact to="/home" />
      <Route path="/home" component={Home} />
      <Route path="/bar-chart" component={BarChart} />
      <Route path="/nyc-crime" component={NYCCrime} />
      <Route path="/crypto" component={Crypto} />
      <Route component={Home} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
