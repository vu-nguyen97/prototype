import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

const LineChart = ({listReport, criteria}) => {
    function getRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    const data = {
        labels:  [...new Set(listReport.map(report => moment(report.dateTime).format('MM-DD')))].sort((a, b) => moment(a, 'MM-DD').diff(moment(b, 'MM-DD'))),
        datasets: [...new Set(listReport.map(report => report?.campaignName))].map(name => {
          return {
            label: name,
            data: listReport.filter(report => report?.campaignName === name).map(report => ((criteria==0)?report?.impression:(criteria==1)?report?.click:(criteria==2)?report?.install:report?.cost)),
            fill: false,
            borderColor: getRandomColor()
          };
        })
      };
      const options = {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Day',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Value',
            },
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
