import React, {Component, PropTypes} from "react";

class CheckboxWrapped extends Component {
  constructor(props) {
    super(props);

    this.state = {checked: !!props.defaultValue};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.setState({
      checked: !this.state.checked
    })
  }

  render() {
    const {id, name, label, inputProps} = this.props;

    return (
      <div>
        <div className="checkbox">
          <label>
            <input id={id} name={name} type="checkbox" checked={this.state.checked}
                   onChange={this.handleChange} {...inputProps} />{' ' + label}

          </label>
        </div>
        {this.state.checked && this.props.children}
      </div>
    )
  }
}

CheckboxWrapped.defaultProps = {};

CheckboxWrapped.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool,
  inputProps: PropTypes.object
};

export default CheckboxWrapped;