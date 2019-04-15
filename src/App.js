import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Market from "./components/Market";
import Account from "./components/Account";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Menu from "./components/Menu";
import { toggleTheme, loadTheme } from "./actions";

const logo = require("./images/logo.svg");

const navItems = [
  {
    label: "Home",
    pathname: "/"
  },
  {
    label: "Market",
    pathname: "/market/ETH_NJA"
  },
  {
    label: "Account",
    pathname: "/account"
  }
];

class App extends Component {
  componentWillMount = () => {
    this.props.loadTheme();
  };

  render() {
    return (
      <BrowserRouter>
        <div className={`App ${this.props.app.theme}`}>
          <Menu
            logo={logo}
            navItems={navItems}
            toggleTheme={this.props.toggleTheme}
          />

          <div className="container">
            <div className="row">
              <div className="col-12">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/market/:symbol" component={Market} />
                  <Route path="/account" component={Account} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = ({ app }) => {
  return { app };
};

const mapActionsToProps = {
  toggleTheme,
  loadTheme
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
