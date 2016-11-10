import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import * as GridActions from "../../actions/GridActions";
import Input from '../../components/form/Input';

class GridForm extends Component {
  onBackClick(event) {
    event.preventDefault();
    this.props.handleBack();
  }

  submitForm(event) {
    event.preventDefault();
    this.props.handleSubmit();
  }

  render() {
    const {columns, rows, changeColumns, changeRows, handleBack} = this.props;

    return (
      <form className="form-horizontal small-form" onSubmit={this.submitForm.bind(this)}>
        <Input id="columns" name="columns" label="Columns" inputProps={{value: columns, onChange: changeColumns}}/>
        <Input id="rows" name="rows" label="Rows" inputProps={{value: rows, onChange: changeRows}}/>
        <div className="form-controls">
          {handleBack && <button className="btn btn-default" onClick={this.onBackClick.bind(this)}>Back</button>}
          <button className="btn btn-primary" type="submit">Next</button>
        </div>
      </form>
    )
  }
}

GridForm.propTypes = {
  handleBack: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired
};

export default connect(state => {
  return {
    columns: state.grid.columns,
    rows: state.grid.rows
  }
}, {
  changeColumns: GridActions.changeColumns,
  changeRows: GridActions.changeRows,
})(GridForm)
