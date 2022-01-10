import React, { Component } from 'react';
import Chart from "react-apexcharts";
import Input from './Input';

class ApexChart extends Component {
  constructor(props) {
    super(props);
    this.updateCharts = this.updateCharts.bind(this);
    this.resetChart = this.resetChart.bind(this);
    this.state = {
      options: {
        chart: {
          id: "basic-line"
        },
        xaxis: {
          categories: this.props.xaxis
        }
      },
      series: [
        {
          name: this.props.name,
          data: this.props.data
        }
      ]
    };
  }

  /*
    [] reset 
    [x] remove input 
    [] add already in array  
  */

  updateCharts = (event) => {
    let input = event.target.value;
    if(input === undefined) {
      input = event.target.previousSibling.value;
    }

    const newSerie  = {
      name: input,
      data: this.props.activities.map(activity => activity[input])
    };
    const chartData = [];
    this.state.series.forEach(setOfData => {
      chartData.push(setOfData.name);
    })

    if(!chartData.includes(input)) {
      this.state.series.push(newSerie);
      this.setState({
        series: this.state.series
    })
    } else {
      let keys = Object.values(this.state.series);
      let indexToDelete;
      keys.forEach((key, index) => {
        let keyName = Object.values(key);
        if(keyName[0] === input) {
          indexToDelete = index;
        }
      })
      keys.splice(indexToDelete, 1);
      this.setState({
        series: keys
      })
    }
    this.render();
  }

  resetChart = () => {
    this.setState({
      series: [{}]
    })
  } 
  
  render() {
    return (
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type={this.props.type}
              width="1000"
              ref={this.ref}
            />   
            <button className="reset-chart" onClick={this.resetChart}>Reset</button>
            <div className="inputs">
            {this.props.activitiesLabel.map((value,id) => (
              <Input
                  value={ value }
                  key={ id }
                  onClickChange={ this.updateCharts }
              />
            ))}  
            </div>       
          </div>
     
    );
  }
}

export default ApexChart;