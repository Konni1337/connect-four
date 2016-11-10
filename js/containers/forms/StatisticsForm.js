import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

class StatisticsForm extends Component {
  render() {
    const {} = this.props;

    return (
      <form>
      </form>
    )
  }
}

StatisticsForm.propTypes = {};

export default connect(state => {
  return {}
}, {})(StatisticsForm)
