import React from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import { ColorTooltip } from "../../../../utils/chart/ExternalTooltip";
import Loading from "../../../../utils/Loading";
import {
  getLineChartSkeleton,
  getChartSkeletonOpt,
} from "../../../../utils/chart/Chart";
import moment from "moment";
import { CHART_COLORS } from "../../../../constants/constants";
import Empty from "antd/lib/empty";

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
        display: true,
        text: "Day",
      },
    },
    y: {
      title: {
        display: true,
        text: "Value",
      },
    },
  },
  plugins: {
    tooltip: {
      enabled: false,
      external: (context) => ColorTooltip(context, "line"),
    },
    legend: {
      position: "bottom",
      labels: {
        boxHeight: 2,
        boxWidth: 40,
      },
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

const getBarChartData = (listData, field) => {
  const labels = [
    ...new Set(
      listData.map((el) =>
        el.dateTime ? moment(el.dateTime)?.format("DD-MM") : ""
      )
    ),
  ].sort((a: any, b: any) => moment(a).diff(moment(b)));

  const datasets = [
    ...new Set(listData.map((report) => report?.listingName)),
  ].map((name, idx) => {
    const maxColor = CHART_COLORS.length;
    const color = idx < maxColor ? CHART_COLORS[idx] : getRandomColor();

    return {
      label: name,
      data: listData
        .filter((report) => report?.listingName === name)
        .map((report) => report[field]),
      fill: false,
      tension: 0.1,
      pointRadius: 0,
      pointHoverRadius: 3,
      pointBackgroundColor: color,
      borderColor: color,
      borderWidth: 2,
      backgroundColor: "transparent",
    };
  });

  return { labels, datasets };
};

function LineChart(props) {
  const { isLoading, data, field } = props;

  let chartData;
  let options;

  if (!data?.length && isLoading) {
    chartData = getLineChartSkeleton();
    options = getChartSkeletonOpt();
  } else {
    chartData = getBarChartData(data, field);
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

LineChart.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  field: PropTypes.string,
};

export default LineChart;
