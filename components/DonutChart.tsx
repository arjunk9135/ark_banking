'use client';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Doughnut } from 'react-chartjs-2';
  
  // Register Chart.js components
  ChartJS.register(ArcElement, Tooltip, Legend);



const DonutChart = ({ accounts }: DoughnutChartProps) => {
    const data = {
        datasets: [
            {
                label: 'Banks',
                data: [1250, 3423, 8787],
                backgroundColor: ['#0747b6', '#2265d8', '#2f91fa']
            },
        ],
        labels: ['Deutsche Bank', 'Scotia Bank','Swiss Bank']
    };

    return (
        <Doughnut
         data={data}
         options={{
            cutout:'60%',
            plugins:{
                legend:{
                    display:false
                }
            }
         }}
         />
    );
};


export default DonutChart