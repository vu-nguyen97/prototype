import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import BarChart from "./Charts/BarChart";
import LineChart from "./Charts/LineChart";
import PieChart from "./Charts/PieChart";
import StackbarChart from "./Charts/StackbarChart";
import Page from "../../utils/composables/Page";
import Dropdown from "antd/lib/dropdown/dropdown";
import MoreOutlined from "@ant-design/icons/lib/icons/MoreOutlined";
import {
  ChartIds,
  getSupportedCharts,
} from "../../partials/common/Switcher/ChartSwitcher";

function Overview(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [barChartData, setBarChartData] = useState<any>([]);

  const [selectedChart, setSelectedChart] = useState<string>(ChartIds.bar);

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setBarChartData(fakedData);
    }, 500);
  }, []);

  const listActivedChart = getSupportedCharts(selectedChart);
  let chartEl = <BarChart isLoading={isLoading} data={barChartData} />;

  switch (selectedChart) {
    case ChartIds.stackedBar:
      chartEl = <StackbarChart isLoading={isLoading} data={barChartData} />;
      break;
    case ChartIds.line:
      chartEl = <LineChart isLoading={isLoading} data={barChartData} />;
      break;
    case ChartIds.pie:
      chartEl = <PieChart isLoading={isLoading} data={barChartData} />;
      break;

    case ChartIds.bar:
    default:
      chartEl = <BarChart isLoading={isLoading} data={barChartData} />;
      break;
  }

  return (
    <Page>
      <div className="mb-4" id="OverviewPage">
        Overview
      </div>

      <div className="overview-section mt-4">
        <header className="section-header">
          <div className="flex items-center space-x-2">
            <div className="hidden xs:block">Show top</div>

            <Dropdown
              className="!ml-0 xs:!ml-2"
              menu={{
                selectable: true,
                // selectedKeys: [filter],
                items: [
                  { key: "key1", label: "Label1" },
                  { key: "key2", label: "Label2" },
                ],
                onClick: (item) => console.log(item.key),
              }}
              trigger={["click"]}
            >
              <button className="custom-btn-light">
                Choose
                {/* Add state: E.g. {activedFilter?.name || "Choose"} */}
              </button>
            </Dropdown>
          </div>

          <Dropdown
            menu={{
              selectable: true,
              selectedKeys: [selectedChart],
              items: listActivedChart,
              onClick: (item) => setSelectedChart(item.key),
            }}
            trigger={["click"]}
          >
            <button className="btn-light icon !px-1.5 !py-2">
              <MoreOutlined />
            </button>
          </Dropdown>
        </header>

        <div className="h-[420px]">{chartEl}</div>
      </div>
    </Page>
  );
}

Overview.propTypes = {};

export default Overview;

const fakedData = [
  {
    data: [
      {
        date: "2023-10-10T00:00:00.000+00:00",
        nonOrganic: 76747,
        organic: 9756,
        total: 86503,
      },
      {
        date: "2023-10-11T00:00:00.000+00:00",
        nonOrganic: 76747,
        organic: 9756,
        total: 86503,
      },
      {
        date: "2023-10-12T00:00:00.000+00:00",
        nonOrganic: 76747,
        organic: 9756,
        total: 86503,
      },
      {
        date: "2023-10-13T00:00:00.000+00:00",
        nonOrganic: 76747,
        organic: 9756,
        total: 86503,
      },
      {
        date: "2023-10-14T00:00:00.000+00:00",
        nonOrganic: 76747,
        organic: 9756,
        total: 86503,
      },
      {
        date: "2023-10-15T00:00:00.000+00:00",
        nonOrganic: 76747,
        organic: 9756,
        total: 86503,
      },
      {
        date: "2023-10-16T00:00:00.000+00:00",
        nonOrganic: 76747,
        organic: 9756,
        total: 86503,
      },
      {
        date: "2023-10-17T00:00:00.000+00:00",
        nonOrganic: 76747,
        organic: 9756,
        total: 86503,
      },
    ],
    name: "App 1",
    nonOrganicTotal: 454892,
    organicTotal: 60132,
    total: 515024,
  },
  {
    data: [
      {
        date: "2023-10-10T00:00:00.000+00:00",
        nonOrganic: 2885,
        organic: 586,
        total: 3471,
      },
      {
        date: "2023-10-11T00:00:00.000+00:00",
        nonOrganic: 2885,
        organic: 586,
        total: 3471,
      },
      {
        date: "2023-10-12T00:00:00.000+00:00",
        nonOrganic: 2885,
        organic: 586,
        total: 3471,
      },
      {
        date: "2023-10-13T00:00:00.000+00:00",
        nonOrganic: 2885,
        organic: 586,
        total: 3471,
      },
      {
        date: "2023-10-14T00:00:00.000+00:00",
        nonOrganic: 2885,
        organic: 586,
        total: 3471,
      },
      {
        date: "2023-10-15T00:00:00.000+00:00",
        nonOrganic: 2885,
        organic: 586,
        total: 3471,
      },
      {
        date: "2023-10-16T00:00:00.000+00:00",
        nonOrganic: 2885,
        organic: 586,
        total: 3471,
      },
      {
        date: "2023-10-17T00:00:00.000+00:00",
        nonOrganic: 2885,
        organic: 586,
        total: 3471,
      },
    ],
    name: "App 2",
    nonOrganicTotal: 19559,
    organicTotal: 3342,
    total: 22901,
  },
];
