import React from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

import {
  ItemDetails
  , ItemList
  , NewItem
  , MyAccount
  , NewReview
} from './components';

import './App.css';

const AuthenticatedDropDown = () => {
  const { instance } = useMsal();

  const logout = () => {
    instance.logout();
  }

  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {instance.getActiveAccount().name}
      </a>
      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
        <a className="dropdown-item" href="/my-account">My Account</a>
        <div className="dropdown-divider"></div>
        <button className="btn navbar-btn line_btn" onClick={logout}>Logout</button>
      </div>
    </li>
  );
}

const UnauthenticatedDropDown = () => {
  const { instance } = useMsal();

  const login = () => {
    instance.loginRedirect();
  }

  return (
    <li className="nav-item">
      <button className="btn navbar-btn line_btn" onClick={login}>Login</button>
    </li>
  );
}

export const App = () => {

  return (
    <Router>
      <div className="App">
        <header>
          <nav className="navbar navbar-expand-md navbar-light bg-light">
            <a className="navbar-brand" href="/">Reviewer</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <NavLink exact={true} activeClassName='active' className='nav-link' to='/'>Items</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink exact={true} activeClassName='active' className='nav-link' to='/items/new'>Add Item</NavLink>
                </li>
              </ul>
              <ul className="navbar-nav">
                <AuthenticatedTemplate>
                  <AuthenticatedDropDown />
                </AuthenticatedTemplate>

                <UnauthenticatedTemplate>
                  <UnauthenticatedDropDown />
                </UnauthenticatedTemplate>
              </ul>
            </div>
          </nav>
        </header>
        <Switch>
          <Route path="/my-account" component={MyAccount} />
          <Route path="/items/new" component={NewItem} />
          <Route path="/items/:id/review" component={NewReview} />
          <Route path="/items/:id" component={ItemDetails} />
          <Route path="/" component={ItemList} />
        </Switch>
      </div>
    </Router >
  );
}
