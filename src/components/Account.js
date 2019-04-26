import React, { Component } from "react";
import { connect } from "react-redux";

import Login from "./Login";
import TabMenu from "./TabMenu";
import SearchTable from "./SearchTable";
import "./Account.scss";
import { tokenFilter } from "../actions";
import { extractKeysFromObjectArray } from "../helpers";

class Account extends Component {
  state = {
    tabs: ["assets", "orders", "transfers", "trades"],
    currentTab: "assets"
  };

  addActionsColumn = data => {
    for (let row of data) {
      row["actions"] = (
        <div className="actions">
          <div className="action">deposit</div>
          <div className="action">withdraw</div>
        </div>
      );
    }
    return data;
  };

  getAssetTableData = () => {
    if (!this.props.account.address) {
      return [];
    }
    const extractedData = extractKeysFromObjectArray(
      this.props.tokens.filtered,
      ["name", "totalBalance", "availableBalance", "inOrders"]
    );
    const dataWithActionsColumn = this.addActionsColumn(extractedData);
    return dataWithActionsColumn;
  };

  handleTabChange = tab => {
    this.setState({ currentTab: tab });
  };

  renderAssetSearchTable = () => {
    return (
      <SearchTable
        theme={this.props.app.theme}
        data={this.getAssetTableData()}
        searchInputPlaceholder="Search by asset name or symbol..."
        defaultOrderBy="totalBalance"
        excludeFromSorting={["actions"]}
        searchValue={this.props.tokens.searchValue}
        handleSearch={this.props.tokenFilter}
      />
    );
  };

  renderOrderSearchTable = () => {
    return <div>ORDERS</div>;
  };

  renderTransferSearchTable = () => {
    return <div>TRANSFERS</div>;
  };

  renderTradeSearchTable = () => {
    return <div>TRADES</div>;
  };

  render() {
    return (
      <div className="Account">
        <Login />

        <div className={`card ${this.props.app.theme}`}>
          <TabMenu
            items={this.state.tabs}
            currentItem={this.state.currentTab}
            theme={this.props.app.theme}
            onChange={this.handleTabChange}
          />

          {this.state.currentTab === "assets" && this.renderAssetSearchTable()}
          {this.state.currentTab === "orders" && this.renderOrderSearchTable()}
          {this.state.currentTab === "transfers" &&
            this.renderTransferSearchTable()}
          {this.state.currentTab === "trades" && this.renderTradeSearchTable()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ app, account, tokens }) => {
  return { app, account, tokens };
};

const mapActionsToProps = {
  tokenFilter
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Account);
