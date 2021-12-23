import React, { useRef, useState, createRef, useEffect, useCallback } from 'react';

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title
} from 'chart.js';

import { Line, Doughnut, Bar, Chart } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);



export default function CustomChartJS(props) {
  const [chartRef, setChartRef] = useState({}); 

  useEffect(() => {
    setChartRef(ChartJS.instances);
  }, [chartRef]);


  return (
            <Chart 
              type="line"
              data={ props.data } 
              ref={ chartRef } 
            />
  );
}