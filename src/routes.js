import React, { useEffect } from 'react';
import { Switch, Route, useLocation, Redirect } from 'react-router-dom';

import Login from './pages/login';
import CreateAccount from './pages/create-account';
import Dashboard from './pages/dashboard';

export default function Routes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/create-account">
        <CreateAccount />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Redirect to="/login" />
    </Switch>
  );
}
