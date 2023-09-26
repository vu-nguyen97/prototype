import moment from "moment";
import {
  capitalizeWord,
  getColumnNumber,
  getTableCellBg,
  sortByDate,
  sortByString,
  sortNumberWithNullable,
} from "../../../../utils/Helpers";
import getColumnSearchProps from "../../../../partials/common/Table/CustomSearch";
import searchMaxMinValue from "../../../../partials/common/Table/SearchMaxMinValue";
import { Link } from "react-router-dom";
import React from "react";
import Tooltip from "antd/lib/tooltip";
import Popconfirm from "antd/lib/popconfirm";
import Switch from "antd/lib/switch";
import { getMax } from "../../../../partials/common/Table/Helper";

export const getColumns = (props) => {
  const { data, onSearchTable, onFilterTable, onChangeStatus } = props;

  const getDate = (field, title) => ({
    title,
    sorter: sortByDate(field),
    render: (record) => {
      if (!record[field]) return "";
      return moment(record[field])?.format("DD/MM/YYYY HH:mm");
    },
  });

  return [
    {
      title: "Name",
      sorter: sortByString("name"),
      ...getColumnSearchProps({
        dataIndex: "name",
        getField: (el) => el.name,
        callback: (value) => onSearchTable(value, "name"),
        customFilter: () => true,
      }),
      render: (rd) => (
        <Link to={rd.id} className="truncate" title={rd.name}>
          {rd.name}
        </Link>
      ),
    },
    {
      title: "Total budget",
      render: (rd) => getColumnNumber(rd.defaultBudget?.totalBudget, "$"),
      sorter: (a, b) =>
        sortNumberWithNullable(a, b, (el) => el.defaultBudget?.totalBudget),
      ...searchMaxMinValue({
        getField: (r) => r.defaultBudget?.totalBudget,
        dataIndex: "totalBudget",
        placeholderSuffix: " ",
        onFilterTable,
      }),
    },
    {
      title: "Daily budget",
      render: (rd) => getColumnNumber(rd.defaultBudget?.dailyBudget, "$"),
      sorter: (a, b) =>
        sortNumberWithNullable(a, b, (el) => el.defaultBudget?.dailyBudget),
      ...searchMaxMinValue({
        getField: (r) => r.defaultBudget?.dailyBudget,
        dataIndex: "dailyBudget",
        placeholderSuffix: " ",
        onFilterTable,
      }),
    },
    {
      title: "Billing Type",
      render: (rd) => capitalizeWord(rd.billingType),
      sorter: sortByString("billingType"),
    },
    {
      title: "Goal",
      render: (rd) => capitalizeWord(rd.goal),
      sorter: sortByString("goal"),
    },
    {
      title: "Cost",
      render: (rd) => (
        <div className="px-2">{getColumnNumber(rd.data?.cost, "$")}</div>
      ),
      ...searchMaxMinValue({
        dataIndex: "cost",
        placeholderSuffix: " ",
        onFilterTable,
        getField: (el) => el.data?.cost,
      }),
      sorter: (a, b) => sortNumberWithNullable(a, b, (el) => el.data?.cost),
      onCell: (record) =>
        getTableCellBg(record, "", getMax("cost", data), (el) => el.data?.cost),
    },
    {
      title: "eCpi",
      render: (rd) => (
        <div className="px-2">{getColumnNumber(rd.data?.ecpi, "$")}</div>
      ),
      ...searchMaxMinValue({
        dataIndex: "eCpi",
        placeholderSuffix: " ",
        onFilterTable,
        getField: (el) => el.data?.ecpi,
      }),
      sorter: (a, b) => sortNumberWithNullable(a, b, (el) => el.data?.ecpi),
      onCell: (record) =>
        getTableCellBg(record, "", getMax("ecpi", data), (el) => el.data?.ecpi),
    },
    // getDate("createdAt", "Created at"),
    // getDate("scheduleStart", "Schedule start"),
    // getDate("scheduleEnd", "Schedule end"),
    {
      title: "Action",
      align: "center",
      render: (record) => {
        const isRunning = !!record.enabled;

        return (
          <div className="flex items-center justify-center space-x-2">
            <Tooltip title={isRunning ? "Pause" : "Run"}>
              <Popconfirm
                placement="left"
                title={`${isRunning ? "Pause" : "Run"} this campaign?`}
                onConfirm={() => onChangeStatus(record)}
                okText="Yes"
                cancelText="No"
              >
                <Switch
                  style={{ backgroundColor: isRunning ? "#16a34a" : "#d6d3d1" }}
                  size="small"
                  checked={isRunning}
                />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};
