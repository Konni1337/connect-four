import React, {Component, PropTypes} from "react";

class Input extends Component {
  defaultProps() {
    return {
      inputProps: {
        type: 'text',
        className: "form-control"
      }
    }
  }

  render() {
    const {id, name, label, inputProps} = this.props;

    return (
      <div className="form-group">
        <label htmlFor={id} className="col-sm-3 control-label">{label}</label>
        <div className="col-sm-9">
          <input id={id} name={name} required {...Object.assign({}, this.defaultProps().inputProps, inputProps)}/>
        </div>
      </div>
    )
  }
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  inputProps: PropTypes.object
};

export default Input;