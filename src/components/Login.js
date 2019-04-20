import React, { Component } from "react";
import { connect } from "react-redux";
import Loading from "./Loading";

import { accountLoginAsync, accountLogout } from "../actions";
import "./Login.scss";
import Button from "./Button";

class Login extends Component {
  renderBody = () => {
    if (this.props.account.loading) {
      return (
        <Loading
          active={this.props.account.loading}
          type="absolute"
          theme={this.props.app.theme}
        />
      );
    }

    if (this.props.account.address) {
      const address_first_four_digits = this.props.account.address.substring(
        2,
        6
      );
      const address_last_four_digits = this.props.account.address.substring(
        this.props.account.address.length - 4,
        this.props.account.address.length
      );

      return (
        <div className="card-body">
          <h5 className="card-title">Welcome!</h5>
          <p className="card-text">
            You have now logged in. Your address is 0x
            {address_first_four_digits}...{address_last_four_digits}
          </p>
          <Button
            theme={this.props.app.theme}
            onClick={this.props.accountLogout}
          >
            Disconnect
          </Button>
        </div>
      );
    }

    if (this.props.account.metamask === "unavailable") {
      return (
        <div className="card-body">
          <h5 className="card-title">MetaMask is not installed</h5>
          <p className="card-text">Would you like to install it now?</p>
          <a
            href="https://metamask.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button theme={this.props.app.theme}>Install MetaMask</Button>
          </a>
        </div>
      );
    }

    if (this.props.account.metamask === "wrongnetwork") {
      return (
        <div className="card-body">
          <h5 className="card-title">Wrong network detected</h5>
          <p className="card-text">
            Please set MetaMask's network to {this.props.app.networkName} and
            try again.
          </p>
          <Button
            onClick={this.props.accountLoginAsync}
            theme={this.props.app.theme}
          >
            Try again
          </Button>
        </div>
      );
    }

    return (
      <div className="card-body">
        <h5 className="card-title">You are not logged in</h5>
        <p className="card-text">Connect to MetaMask to manage your account.</p>
        <Button
          onClick={this.props.accountLoginAsync}
          theme={this.props.app.theme}
        >
          Connect
        </Button>
      </div>
    );
  };

  render() {
    return (
      <div className={`Login card text-center ${this.props.app.theme}`}>
        {this.renderBody()}
      </div>
    );
  }
}

const mapStateToProps = ({ account, app }) => {
  return { account, app };
};

const mapActionsToProps = {
  accountLoginAsync,
  accountLogout
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Login);