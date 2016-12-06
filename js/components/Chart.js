import React, {Component, PropTypes} from "react";
import {core as ZingChart} from 'zingchart-react';


class Chart extends Component {

  render() {
    const {data} = this.props;

    if (data.length === 0) return;

    const chartConfig = {
      type: "line",
      series: data.map(({database, data}) => {
        return {
          text: database.slice(5),
          values: data
        }
      }),
      "legend":{
        "background-color":"#ffe6e6",
        "border-width":2,
        "border-color":"red",
        "border-radius":"5px",
        "layout": data.length.toString() + "x1",
        "x":"82%",
        "y":"25%",
        "width": "15%",
      },
      // "legend":{
      //   "layout": "1x" + data.length,
      //   "x":"10%",
      //   "y":"85%",
      //   "item":{
      //     "offset-x": "5px",
      //     "margin": "0"
      //   }
      // },
      // "plotarea":{
      //   "margin-bottom":"20%"
      // },
      "plotarea":{
        "margin-right":"25%",
      },
      plot: {
        "marker":{
          "visible":false
        }
      },
      theme: "light",
      title: {
        text: "Winrate every 10000 games"
      },
      "scale-y": {
        zooming: true,
        "max-value": 100,
        "min-value": 0
      }
    };
    return <ZingChart id="statistics-chart" height="600" width="100%" data={chartConfig}/>;
  }
}

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    database: PropTypes.number.string
  }))
};

export default Chart


