import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({criteria, listReport}) => {
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
    console.log(compare_data);
    const data = {
        labels: listReport.map(item => item?.campaignName),
        datasets: [
          {
            data: compare_data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
            ],
          },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
            title: {
                display: true,
                text: 'Compare Campaign',
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
