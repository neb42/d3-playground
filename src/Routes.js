import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import BarChart from './pages/BarChart';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Redirect path="/" exact to="/home" />
      <Route path="/home" component={Home} />
      <Route path="/bar-chart" component={BarChart} />
      <Route component={Home} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
