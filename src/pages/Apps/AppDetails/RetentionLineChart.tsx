import React from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import moment from "moment";
import Empty from "antd/lib/empty";
import { CHART_COLORS } from "../../../constants/constants";
import Loading from "../../../utils/Loading";
import {
  getLineChartSkeleton,
  getChartSkeletonOpt,
} from "../../../utils/chart/Chart";
import { ColorTooltip } from "../../../utils/chart/ExternalTooltip";

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export const LineChartConfigs = {
  layout: {
    padding: {
      top: 0,
      bottom: 5,
      left: 0,
      right: 20,
    },
  },
  scales: {
    x: {
      title: {
        display: false,
        text: "Day",
      },
    },
    y: {
      title: {
        display: false,
        text: "Value",
      },
      min: 0,
      max: 100,
    },
  },
  plugins: {
    tooltip: {
      enabled: false,
      external: (context) => ColorTooltip(context, "line"),
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 200,
};

const getBarChartData = (data) => {
  const retentionPeriods = [1, 2, 3, 4, 5, 6, 7, 14, 21, 30];

  const labels = [
    "D1",
    "D2",
    "D3",
    "D4",
    "D5",
    "D6",
    "D7",
    "D14",
    "D21",
    "D30",
  ];

  const datasets = [
    {
      label: "Retention",
      data: data,
      fill: false,
      tension: 0.1,
      pointRadius: 1,
      pointHoverRadius: 3,
      pointBackgroundColor: "#017bba",
      borderColor: "#0284c7",
      borderWidth: 2,
      backgroundColor: "transparent",
    },
  ];

  return { labels, datasets };
};

function RetentionLineChart(props) {
  const { isLoading, data } = props;

  let chartData;
  let options;

  if (!data?.length && isLoading) {
    chartData = getLineChartSkeleton();
    options = getChartSkeletonOpt();
  } else {
    chartData = getBarChartData(data);
    options = LineChartConfigs;
  }

  return (
    <div className="w-full h-full relative">
      {isLoading && <Loading isFixed={false} />}

      {!isLoading && chartData?.labels?.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <Empty />
        </div>
      )}

      {chartData?.labels?.length !== 0 && (
        <Line
          // @ts-ignore
          options={options}
          data={chartData}
        />
      )}
    </div>
  );
}

RetentionLineChart.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
};

export default RetentionLineChart;
