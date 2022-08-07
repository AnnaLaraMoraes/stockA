import React, { useEffect } from 'react';
import { Switch, Route, useLocation, Redirect } from 'react-router-dom';

import Login from './pages/login';
import CreateAccount from './pages/create-account';
import Dashboard from './pages/dashboard';
import RegisterProduct from './pages/register-product';
import ProductsList from './pages/products-list';
import RegisterStakeholdersContainer from './pages/register-stakeholders';
import RegisterSale from './pages/register-sale';
import Employees from './pages/employees';
import Providers from './pages/providers';
import Customers from './pages/customers';
import SalesList from './pages/sales-list';
import LandingPage from './pages/landing-page';
import { useAuthState } from './firebase-config';

export default function Routes() {
  const location = useLocation();
  const { isAuthenticated } = useAuthState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Switch>
      <Route path="/landing-page">
        <LandingPage />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/create-account">
        <CreateAccount />
      </Route>

      <Route
        render={() =>
          isAuthenticated ? <Dashboard /> : <Redirect to="/login" />
        }
        path="/dashboard"
      />

      <Route
        render={() =>
          isAuthenticated ? <RegisterProduct /> : <Redirect to="/login" />
        }
        path="/register-product"
      />

      <Route
        render={() =>
          isAuthenticated ? <ProductsList /> : <Redirect to="/login" />
        }
        path="/products-list"
      />

      <Route
        render={() =>
          isAuthenticated ? (
            <RegisterStakeholdersContainer />
          ) : (
            <Redirect to="/login" />
          )
        }
        path="/register-stakeholders"
      />

      <Route
        render={() =>
          isAuthenticated ? <RegisterSale /> : <Redirect to="/login" />
        }
        path="/register-sale"
      />

      <Route
        render={() =>
          isAuthenticated ? <Employees /> : <Redirect to="/login" />
        }
        path="/employees-list"
      />

      <Route
        render={() =>
          isAuthenticated ? <Providers /> : <Redirect to="/login" />
        }
        path="/providers-list"
      />

      <Route
        render={() =>
          isAuthenticated ? <Customers /> : <Redirect to="/login" />
        }
        path="/costumers-list"
      />

      <Route
        render={() =>
          isAuthenticated ? <SalesList /> : <Redirect to="/login" />
        }
        path="/sales-list"
      />

      <Redirect to="/landing-page" />
    </Switch>
  );
}
