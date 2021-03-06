import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./MyOpenOrders.scss";
import ScrollableTable from "./ScrollableTable";
import {
  capitalize,
  truncateNumberOutput
} from "../helpers";
import {
  accountOrdersCancelAllAsync,
  accountOrdersCancelAsync
} from "../actions"
import Loading from './Loading'
import * as Web3Utils from 'web3-utils'

class MyOpenOrders extends Component {
  extractOpenOrdersData = () => {
    if (!this.props.account.address || !this.props.base || !this.props.quote || !this.props.market) {
      return [];
    }

    const { accountOrders, market } = this.props;

    const extractedData = []
    for (let accountOrder of accountOrders.all) {
      if (accountOrder.marketSymbol !== market.currentMarket || accountOrder.status === 'closed') {
        continue
      }

      const basePrecision = this.props.base.amountPrecision
      const quotePrecision = this.props.quote.amountPrecision
      const pricePrecision = this.props.market.pricePrecision
      const price = truncateNumberOutput(Web3Utils.fromWei(accountOrder.price.toString()), pricePrecision)
      const amount = truncateNumberOutput(Web3Utils.fromWei(accountOrder.amount.toString()), quotePrecision)
      const filled = truncateNumberOutput(Web3Utils.fromWei(accountOrder.amountFilled.toString()), quotePrecision)
      const type = (
        <div className={`pill ${accountOrder.type}`}>
          {capitalize(accountOrder.type)}
        </div>
      );
      const total = `${truncateNumberOutput(Web3Utils.fromWei(accountOrder.total.toString()), basePrecision)} ${this.props.base.symbol}`;
      const date = accountOrder.createdAt;
      const cancelAll = (
        <div className="actions">
          <div className='action' onClick={() => this.props.accountOrdersCancelAsync(accountOrder)}>cancel</div>
        </div>
      );

      extractedData.push({ type, price, amount, total, filled, date, cancelAll });
    }

    return extractedData;
  };

  render() {
    return (
      <div className={`MyOpenOrders card ${this.props.theme}`}>
        <Loading
          active={this.props.loading}
          type="absolute"
          theme={this.props.theme}
        />
        <div className="header">
          My Open Orders
        </div>
        <div className="body">
          <ScrollableTable
            loginRequired={true}
            loggedIn={this.props.account.address ? true : false}
            theme={this.props.theme}
            data={this.extractOpenOrdersData()}
            defaultOrderBy='date'
            dateColumn="date"
            dataName='open orders'
            excludeFromSorting={["cancelAll"]}
            clickableHeaders={[
              { name: "cancelAll", onClick: () => this.props.accountOrdersCancelAllAsync({ market: this.props.market.currentMarket }) }
            ]}
            height={200}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

const mapActionsToProps = {
  accountOrdersCancelAllAsync,
  accountOrdersCancelAsync
};

MyOpenOrders.propTypes = {
  theme: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapActionsToProps)(MyOpenOrders);
