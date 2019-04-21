import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Table.scss";

class Table extends Component {
  formatNameToUserFriendly = name => {
    return name
      .split(/(?=[A-Z])/)
      .join(" ")
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  render() {
    return (
      <div className={`Table ${this.props.theme} table-responsive`}>
        <table className="table">
          <thead>
            <tr>
              {Object.keys(this.props.data[0]).map(col => (
                <th scope="col" key={col}>
                  {this.formatNameToUserFriendly(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((row, i) => (
              <tr key={i}>
                {Object.keys(row).map(key => (
                  <td key={key}>{row[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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

Table.propTypes = {
  theme: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired // [ { column: value, ... }, ... ]
};

export default Table;
