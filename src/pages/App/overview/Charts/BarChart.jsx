import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = (props) => {
    const list = props.props;
    const data = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4'],
        datasets: [
            {
                label: list[0].appName,
                data: [list[0].retention_d0,list[0].retention_d1,list[0].retention_d2,list[0].retention_d3],
                backgroundColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
            {
                label: list[1].appName,
                data: [list[1].retention_d0,list[1].retention_d1,list[1].retention_d2,list[1].retention_d3],
                backgroundColor: 'blue',
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
                text: 'Bar Chart',
            },
        },
    };

    return (
        <div style={{backgroundColor: "white", paddingRight: 20, paddingLeft: 20, paddingBottom: 20}}>
            <Bar data={data} options={options} style={{maxHeight: 500}}/>
        </div>
    );
};

export default BarChart;
