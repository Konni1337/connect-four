import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Statistics from "../components/Statistics";

class Training extends Component {
  static propTypes = {
    statistics: PropTypes.shape({
      draw: PropTypes.number.isRequired,
      1: PropTypes.number.isRequired,
      2: PropTypes.number.isRequired
    })
  };

  render() {
    return (
      <div>
        <Statistics statistics={this.props.statistics}/>
      </div>
    )
  }
}

export default connect(state => state.statistics, {})(Training)
