import React, { Component } from 'react';
import Chart from "react-apexcharts";
import Input from './Input';

class ApexChart extends Component {
  constructor(props) {
    super(props);
    this.updateCharts = this.updateCharts.bind(this);

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

  updateCharts = (e) => {
    console.log(e.target.value);
    let target = e.target.value;
    const newSerie  = {
      name: target,
      data: this.props.activities.map(activity => activity[target])
    };
    this.state.series.push(newSerie);
    this.setState({
      series: this.state.series
    })
    this.render();
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