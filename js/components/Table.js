import React, {Component, PropTypes} from "react";


class Table extends Component {

  renderTh(name, index) {
    return <th key={index}>{name}</th>
  }

  renderTd(value, index) {
    return <td key={index}>{(value && Math.round(value * 100) / 100) || 'N/A'}</td>
  }

  renderTr(value, columnIndex) {
    const {data} = this.props;
    return <tr key={columnIndex}>
      <td>{value[0]}</td>
      {data.map(({data}, index) => {
        let pair = data[columnIndex] || [];
        return this.renderTd(pair[1], index)
      })}
    </tr>
  }

  render() {
    const {data} = this.props;
    let names = [], values = [];
    data.map(database => {
      names.push(database.database);
      values.push(database.data);
    });
    const longest = values.reduce((longest, current) => {
      if (!longest) return current;
      return longest.length < current.length ? current : longest;
    });

    return <table className="table">
      <thead>
      <tr>
        <th>Episode</th>
        {names.map(this.renderTh)}
      </tr>
      </thead>
      <tbody>
      {longest.map(this.renderTr.bind(this))}
      </tbody>
    </table>;
  }
}

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    database: PropTypes.number.string
  }))
};

export default Table


