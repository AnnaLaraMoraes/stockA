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
      <Route path="/register-product">
        <RegisterProduct />
      </Route>
      <Route path="/products-list">
        <ProductsList />
      </Route>
      <Route path="/register-stakeholders">
        <RegisterStakeholdersContainer />
      </Route>
      <Route path="/register-sale">
        <RegisterSale />
      </Route>
      <Route path="/employees-list">
        <Employees />
      </Route>
      <Route path="/providers-list">
        <Providers />
      </Route>
      <Route path="/costumers-list">
        <Customers />
      </Route>
      <Route path="/sales-list">
        <SalesList />
      </Route>
      <Redirect to="/login" />
    </Switch>
  );
}
