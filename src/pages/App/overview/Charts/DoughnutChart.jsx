import React from 'react';
import { Doughnut } from 'react-chartjs-2';
const DoughnutChart = ({listPerformance, criteria}) => {
    const list = listPerformance;
    let compare_data = [];
    switch (criteria){
        case "1": compare_data = [list[0].impression, list[1].impression];
            break;
        case "2": compare_data = [list[0].click, list[1].click];
            break;
        case "3": compare_data = [list[0].install, list[1].install];
            break;
    }
    const data = {
        labels: [list[0].appName, list[1].appName],
        datasets: [
            {
                label: '# of impression',
                data: compare_data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
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
                text: 'Doughnut Chart',
            },
        },
    };

    return (
        <div style={{backgroundColor: "white", paddingRight: 20, paddingLeft: 20, paddingBottom: 20}}>
            <Doughnut data={data} options={options} style={{maxHeight: 500}}/>
        </div>
    );
};

export default DoughnutChart;
