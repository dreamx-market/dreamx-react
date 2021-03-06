import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Chart from "./Chart";
import Trade from "./Trade";
import MyOpenOrders from "./MyOpenOrders";
import OrderBook from "./OrderBook";
import TradeHistory from "./TradeHistory";
import "./Market.scss";
import {
  marketLoadAsync,
  tickersHandleSearchInput,
  tradingviewLoading,
  tradingviewLoaded
} from "../actions";
import singletons from "../singletons";
import config from "../config";

class Market extends Component {
  constructor(props) {
    super(props);
    this.trade = React.createRef();
  }

  state = {
    Trade: undefined
  }

  componentDidMount = () => {
    this.redirectToDefaultMarketIfMarketSymbolInvalid();
    window.scrollTo(0, 0);
  };

  componentDidUpdate = prevProps => {
    this.redirectToDefaultMarketIfMarketSymbolInvalid();
    window.redirectToDefaultMarketIfMarketSymbolInvalid = this.redirectToDefaultMarketIfMarketSymbolInvalid
    const currentMarket = this.props.match.params.marketSymbol;
    const previousMarket = prevProps.match.params.marketSymbol;
    const existingMarket = this.props.market.currentMarket;
    const marketChanged = currentMarket !== previousMarket && currentMarket !== existingMarket;
    const appLoaded = !this.props.app.loading
    if (marketChanged && appLoaded) {
      this.state.Trade.resetState();
      this.props.marketLoadAsync();
      window.scrollTo(0, 0);
    }
  };

  redirectToDefaultMarketIfMarketSymbolInvalid = () => {
    const { DEFAULT_MARKET } = config
    const allMarkets = this.props.markets.all;

    if (allMarkets.length < 1) {
      return;
    }

    const currentMarket = this.props.match.params.marketSymbol;

    const currentMarketExists = allMarkets.filter(
      m => m.symbol === currentMarket
    )[0]
      ? true
      : false;

    if (!currentMarket || !currentMarketExists) {
      this.props.history.push(`/market/${DEFAULT_MARKET}`);
      return;
    }
  };

  // returns { base: { symbol, balance }, quote: { symbol, balance } }
  getBaseAndQuoteBalances = () => {
    const [
      baseTokenSymbol,
      quoteTokenSymbol
    ] = this.props.market.currentMarket.split("_");
    const allTokens = this.props.tokens.all;

    if (!baseTokenSymbol || !quoteTokenSymbol || allTokens.length < 1) {
      return { base: undefined, quote: undefined };
    }

    const baseToken = this.props.tokens.all.filter(
      t => t.symbol === baseTokenSymbol
    )[0];
    const quoteToken = this.props.tokens.all.filter(
      t => t.symbol === quoteTokenSymbol
    )[0];
    
    if (!baseToken || !quoteToken) {
      return { base: undefined, quote: undefined };
    }

    const base = { symbol: baseToken.symbol, balance: baseToken.availableBalance, address: baseToken.address, amountPrecision: baseToken.amountPrecision, decimals: baseToken.decimals };
    const quote = { symbol: quoteToken.symbol, balance: quoteToken.availableBalance, address: quoteToken.address, amountPrecision: quoteToken.amountPrecision, decimals: quoteToken.decimals };
    return { base, quote };
  };

  registerTradeComponent = (Trade) => {
    this.setState({ Trade })
  }

  render() {
    const { cable } = singletons;
    const { API_HTTP_ROOT } = config;
    const isLoading = this.props.market.loading || this.props.app.loading || this.props.account.loading
    const isChartLoading = this.props.market.loading || this.props.app.loading || this.props.account.loading || this.props.tradingview.loading

    return (
      <div className="Market">
        <div className="row">
          <div className="col-lg-8">
            <Chart
              theme={this.props.app.theme}
              loading={isChartLoading}
              marketSymbol={this.props.market.currentMarket}
              searchValue={this.props.tickers.searchValue}
              handleSearchInput={this.props.tickersHandleSearchInput}
              apiHttpRoot={API_HTTP_ROOT}
              cable={cable}
              onTradingviewLoading={this.props.tradingviewLoading}
              onTradingviewLoaded={this.props.tradingviewLoaded}
            />
          </div>
          <div className="col-lg-4">
            <Trade
              theme={this.props.app.theme}
              loading={isLoading}
              loggedIn={this.props.account.address ? true : false}
              base={this.getBaseAndQuoteBalances().base}
              quote={this.getBaseAndQuoteBalances().quote}
              takerFee={this.props.app.takerFee}
              makerFee={this.props.app.makerFee}
              makerMinimum={this.props.app.makerMinimum}
              takerMinimum={this.props.app.takerMinimum}
              registerTradeComponent={this.registerTradeComponent}
              tradeRef={this.trade}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <MyOpenOrders 
              theme={this.props.app.theme} 
              loading={isLoading}
              base={this.getBaseAndQuoteBalances().base}
              quote={this.getBaseAndQuoteBalances().quote}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <OrderBook 
              theme={this.props.app.theme} 
              loading={isLoading}
              type='buy'
              total={this.props.orderBook.totalBuy}
              bookData={this.props.orderBook.buyBook}
              base={this.getBaseAndQuoteBalances().base}
              quote={this.getBaseAndQuoteBalances().quote}
              Trade={this.state.Trade}
              tradeRef={this.trade}
            />
          </div>
          <div className="col-lg-4">
            <OrderBook 
              theme={this.props.app.theme} 
              loading={isLoading}
              type='sell'
              total={this.props.orderBook.totalSell}
              bookData={this.props.orderBook.sellBook}
              base={this.getBaseAndQuoteBalances().base}
              quote={this.getBaseAndQuoteBalances().quote}
              Trade={this.state.Trade}
              tradeRef={this.trade}
            />
          </div>
          <div className="col-lg-4">
            <TradeHistory 
              theme={this.props.app.theme} 
              loading={isLoading}
              quote={this.getBaseAndQuoteBalances().quote}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

const mapActionsToProps = {
  marketLoadAsync,
  tickersHandleSearchInput,
  tradingviewLoading,
  tradingviewLoaded
};

export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps
  )(Market)
);
