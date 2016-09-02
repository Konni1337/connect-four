import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

class ErrorContainer extends Component {
  static propTypes = {
    error: PropTypes.object
  };

  render() {
    const {message} = this.props;
    message && console.error(message);
    return <div>{message && <span className="error">{message}</span>}</div>
  }
}

export default connect(state => state.error, {})(ErrorContainer)
