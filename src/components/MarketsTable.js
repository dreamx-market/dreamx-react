import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./MarketsTable.scss";

class MarketsTable extends Component {
  render() {
    return (
      <div className={`MarketsTable card ${this.props.theme}`}>
        MarketsTable
      </div>
    );
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getChartData
// };

MarketsTable.propTypes = {
  theme: PropTypes.string.isRequired
};

export default MarketsTable;
