import React from 'react';
import { Bar } from 'react-chartjs-2';
const StackBarChart = ({listPerformance, criteria}) => {
    const list = listPerformance;
    let compare_data_list = [];
    switch (criteria){
        case "1": compare_data_list = [list[0].impression, list[1].impression];
            break;
        case "2": compare_data_list = [list[0].click, list[1].click];
            break;
        case "3": compare_data_list = [list[0].install, list[1].install];
            break;
    }
    const data = {
        labels: [list[0].appName, list[1].appName],
        datasets: [
            {
                label: list[0].appName,
                data: [compare_data_list[0]],
                backgroundColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
            {
                label: list[1].appName,
                data: [compare_data_list[1]],
                backgroundColor: 'blue',
                fill: false,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Stack Bar Chart',
            },
        },
    };

    return (
        <div style={{backgroundColor: "white", paddingRight: 20, paddingLeft: 20, paddingBottom: 20}}>
            <Bar data={data} options={options} style={{maxHeight: 500}}/>
        </div>
    );
};

export default StackBarChart;
