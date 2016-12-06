import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import * as StatisticsActions from '../../actions/StatisticsActions';
import Spinner from '../../components/Spinner';
import Table from '../../components/Table';
import Chart from '../../components/Chart';

class StatisticsForm extends Component {
  constructor(props) {
    super(props);

    this.renderDatabase = this.renderDatabase.bind(this);
    this.renderDatabases = this.renderDatabases.bind(this);
    this.renderSelectedDatabase = this.renderSelectedDatabase.bind(this);
    this.renderSelectedDatabases = this.renderSelectedDatabases.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  handleClick(database) {
    this.props.addDatabase(database);
    this.props.fetchData(database);
  }

  renderDatabase(value, index) {
    return <li key={index} role="presentation" className="bg-success" onClick={() => this.handleClick(value)}>
      <a href="#" className="text-success">{value.slice(5)} <span className="glyphicon glyphicon-plus"
                                                                  aria-hidden="true"/></a>
    </li>
  }

  renderDatabases(databases) {
    return <ul className="nav nav-pills" role="tablist">
      {databases.sort().map(this.renderDatabase)}
    </ul>
  }

  renderSelectedDatabase(value, index) {
    return <li key={index} role="presentation">
      <a href="#"
         className={this.props.markedDatabases.indexOf(value) >= 0 ? "bg-warning" : "bg-primary"}
         onClick={() => this.props.markDatabase(value)}>
        {value.slice(5)}
        <span className="glyphicon glyphicon-pencil" aria-hidden="true"/>
        <span onClick={() => this.props.removeDatabase(value)} className="glyphicon glyphicon-remove"
              aria-hidden="true"/>
      </a>
    </li>
  }

  renderSelectedDatabases(databases) {
    return <ul className="nav nav-pills" role="tablist">
      {databases.sort().map(this.renderSelectedDatabase)}
    </ul>
  }

  componentDidMount() {
    const {isFetching, databases, fetchDatabases} = this.props;
    if (!isFetching && databases === null) {
      fetchDatabases();
    }
  }

  renderActions(markedDatabases) {
    return <div>
      <label htmlFor="merge">Name for Merge:</label>
      <input type="text" id="merge" ref="mergeName"/>
      <button className="btn btn-primary"
         href="#"
         onClick={() => this.props.mergeData(this.refs.mergeName.value, markedDatabases, this.props.data)}>
        Merge
      </button>
      </div>
  }

  render() {
    const {databases, selectedDatabases, markedDatabases, data, isFetching} = this.props;

    if (isFetching || !databases) {
      return <Spinner />
    } else if (!isFetching && databases.length === 0) {
      return <span>No Databases found.</span>
    } else if (data === null) {
      return <div>
        {this.renderDatabases(databases)}
      </div>
    } else if (data.length === 0) {
      return <div>
        {this.renderDatabases(databases)}
        <span>No Content found</span>
      </div>
    } else if (data.length > 0) {
      return <div>
        {this.renderDatabases(databases)}
        {this.renderSelectedDatabases(selectedDatabases)}
        {markedDatabases.length > 0 && this.renderActions(markedDatabases)}
        <Chart data={data}/>
        <Table data={data}/>
      </div>
    } else {
      return <span>This is a Desert</span>
    }
  }
}

StatisticsForm.propTypes = {};

export default connect(state => {
  return {
    databases: state.statistics.databases,
    data: state.statistics.data,
    isFetching: state.statistics.isFetching,
    selectedDatabases: state.statistics.selectedDatabases,
    markedDatabases: state.statistics.markedDatabases
  }
}, {
  fetchDatabases: StatisticsActions.fetchDatabases,
  addDatabase: StatisticsActions.addDatabase,
  removeDatabase: StatisticsActions.removeDatabase,
  markDatabase: StatisticsActions.markDatabase,
  mergeData: StatisticsActions.mergeData,
  fetchData: StatisticsActions.fetchData
})(StatisticsForm)
