import React, {Component, PropTypes} from "react";
import Input from './Input';

function renderOption(value, index) {
  return <option key={index} value={index}>{value}</option>
}

class SelectWrapped extends Component {
  constructor(props) {
    super(props);

    this.state = {selected: 0};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      selected: event.target.value
    })
  }

  render() {
    const {name, selectProps, values, inputProps} = this.props;

    return (
      <div className="select-wrapped">
        <div className="form-group">
          <div className="col-sm-12">
            <select ref='select' value={this.state.selected} onChange={this.handleChange} {...selectProps}>
              {values.map(renderOption)}
            </select>
          </div>
        </div>
        <input name={name} type="hidden" value={values[this.state.selected]} {...inputProps}/>
        <div ref="childWrapper">
          {this.props.children[this.state.selected]}
        </div>
      </div>
    )
  }
}

SelectWrapped.defaultProps = {
  selectProps: {
    className: "form-control"
  },
  inputProps: {}
};

SelectWrapped.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string.isRequired),
  name: PropTypes.string.isRequired,
  selectProps: PropTypes.object,
  inputProps: PropTypes.object
};

export default SelectWrapped;
