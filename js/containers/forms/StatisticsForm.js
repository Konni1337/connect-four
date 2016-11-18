import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {core as ZingChart} from 'zingchart-react';
import * as StatisticsActions from '../../actions/StatisticsActions';
import Spinner from '../../components/Spinner';

class StatisticsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {selected: -1};
    this.handleChange = this.handleChange.bind(this);
    this.renderDatabaseSelect = this.renderDatabaseSelect.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({
      selected: value
    });
    if (value >= 0) this.props.fetchData(this.props.databases[value]);
  }

  renderDatabaseOption(value, index) {
    return <option key={index} value={index}>{value}</option>
  }

  renderDatabaseSelect(databases) {
    return (
      <select ref='databases' className="form-control" value={this.state.selected} onChange={this.handleChange}>
        {this.state.selected === -1 && <option value={-1}>Select a database</option>}
        {databases.map(this.renderDatabaseOption)}
      </select>
    )
  }

  componentDidMount() {
    const {isFetching, databases, fetchDatabases} = this.props;
    if (!isFetching && databases === null) {
      fetchDatabases();
    }
  }

  render() {
    const {databases, data, isFetching} = this.props;

    if (isFetching || !databases) {
      return <Spinner />
    } else if (!isFetching && databases.length === 0) {
      return <span>No Databases found.</span>
    } else if (data === null) {
      return <div>
        {this.renderDatabaseSelect(databases)}
      </div>
    } else if (data.length === 0) {
      return <div>
        {this.renderDatabaseSelect(databases)}
        <span>No Content found</span>
      </div>
    } else if (data.length > 0) {
      const chartConfig = {
        type: "line",
        series: [
          {
            text: "First Series",
            values: data
          }
        ],
        legend: "true",
        theme: "light",
        title: "Winrate every 1000 games",
        "scale-y": {
          zooming: true
        }
      };
      return <div>
        {this.renderDatabaseSelect(databases)}
        <ZingChart id="statistics-chart" height="300" width="600" data={chartConfig}/>
      </div>;
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
    isFetching: state.statistics.isFetching
  }
}, {
  fetchDatabases: StatisticsActions.fetchDatabases,
  fetchData: StatisticsActions.fetchData
})(StatisticsForm)
