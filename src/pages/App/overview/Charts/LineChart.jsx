import React from 'react';
import { Line } from 'react-chartjs-2';
const LineChart = (props) => {
    const list = props.props;
    const data = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4'],
        datasets: [
            {
                label: list[0].appName,
                data: [list[0].retention_d0,list[0].retention_d1,list[0].retention_d2,list[0].retention_d3],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
            {
                label: list[1].appName,
                data: [list[1].retention_d0,list[1].retention_d1,list[1].retention_d2,list[1].retention_d3],
                borderColor: 'blue',
                fill: false,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Line Chart',
            },
        },
    };

    return (
        <div  className="w-full h-full relative" style={{backgroundColor: "white", paddingRight: 20, paddingLeft: 20, paddingBottom: 20}}>
            <Line data={data} options={options} style={{maxHeight: 500}}/>
        </div>
    );
};

export default LineChart;
