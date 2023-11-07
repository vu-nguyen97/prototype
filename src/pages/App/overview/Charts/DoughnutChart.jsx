import React from 'react';
import { Doughnut } from 'react-chartjs-2';
const DoughnutChart = ({listReport, criteria}) => {
    let compare_data = [];
    switch (criteria){
        case "1": compare_data = listReport.map(item => item?.impression);
        break;
        case "2": compare_data = listReport.map(item => item?.click);
        break;
        case "3": compare_data = listReport.map(item => item?.install);
        break;
        case "4": compare_data = listReport.map(item => item?.cost);
        break;
    }
    const data = {
        labels: listReport.map(item => item?.name),
        datasets: [
            {
                label: 'Compare Campaign',
                data: compare_data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(23, 42, 222, 0.2)',
                    'rgba(89, 21, 67, 0.2)',
                    'rgba(122, 220, 145, 0.2)',
                    'rgba(65, 76, 67, 0.2)',
                    'rgba(123, 231, 100, 0.2)',
                    'rgba(17, 16, 15, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(23, 42, 222, 1)',
                    'rgba(89, 21, 67, 1)',
                    'rgba(122, 220, 145, 1)',
                    'rgba(65, 76, 67, 1)',
                    'rgba(123, 231, 100, 1)',
                    'rgba(17, 16, 15, 1)',
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
                text: 'Compare Campaign',
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
