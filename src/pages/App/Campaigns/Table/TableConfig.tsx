import {
  checkNumberValue,
  getColumnNumber,
  getShadeColor,
  getTableCellBg,
  roundNumber,
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
import { TABLE_COLUMN_COLOR } from "../../../../constants/constants";
import classNames from "classnames";

export const getColumns = (props) => {
  const { data, onSearchTable, onFilterTable, onChangeStatus } = props;

  const getStatCol = (field, title, prefix = "") => ({
    title,
    width: 140,
    render: (rd) => (
      <div className="table-cell-padding">
        {getColumnNumber(rd.data?.[field], prefix)}
      </div>
    ),
    ...searchMaxMinValue({
      dataIndex: field,
      placeholderSuffix: " ",
      onFilterTable,
      getField: (el) => el.data?.[field],
    }),
    sorter: (a, b) => sortNumberWithNullable(a, b, (el) => el.data?.[field]),
    onCell: (record) =>
      getTableCellBg(record, "", getMax(field, data), (el) => el.data?.[field]),
  });

  const getRetentionPer = (rd, field) => {
    const installDay0 = rd.data?.retentionD0;

    const dataValue = rd.data?.[field];
    return checkNumberValue(dataValue)
      ? roundNumber(dataValue / installDay0)
      : -1;
  };

  const getRetetionCol = (field, title, isD0 = false) => ({
    title,
    width: 140,
    render: (rd) => {
      const installDay0 = rd.data?.retentionD0;
      if (!installDay0) return <></>;

      const dataValue = rd.data?.[field];
      const per = checkNumberValue(dataValue)
        ? roundNumber((dataValue / installDay0) * 100) + "%"
        : "";

      return (
        <div className={classNames(isD0 && "table-cell-padding")}>
          <div>{isD0 ? "100%" : per}</div>
          <div className="text-xs">{getColumnNumber(dataValue)}</div>
        </div>
      );
    },
    ...searchMaxMinValue({
      dataIndex: field,
      placeholderSuffix: " ",
      onFilterTable,
      getField: (el) => el.data?.[field],
    }),
    sorter: (a, b) =>
      sortNumberWithNullable(a, b, (el) => getRetentionPer(el, field)),
    onCell: (record) => {
      if (isD0) {
        return getTableCellBg(
          record,
          "",
          getMax(field, data),
          (el) => el.data?.[field]
        );
      }

      return {
        className: "custom-td-bg",
        ["style"]: {
          backgroundColor: getShadeColor(
            record.data?.[field],
            record.data?.retentionD0,
            TABLE_COLUMN_COLOR[3]
          ),
        },
      };
    },
  });

  return [
    {
      title: "Name",
      width: 300,
      fixed: "left",
      sorter: sortByString("name"),
      ...getColumnSearchProps({
        dataIndex: "name",
        getField: (el) => el.name,
        callback: (value) => onSearchTable(value, "name"),
        customFilter: () => true,
      }),
      render: (rd) => (
        <Link to={rd.id} className="line-clamp-2" title={rd.name}>
          {rd.name}
        </Link>
      ),
    },
    getStatCol("install", "Installs"),
    getStatCol("cost", "Cost", "$"),
    getStatCol("ecpi", "eCpi", "$"),
    getRetetionCol("retentionD0", "Install Day", true),
    getRetetionCol("retentionD1", "RetentionD1"),
    getRetetionCol("retentionD2", "RetentionD2"),
    getRetetionCol("retentionD3", "RetentionD3"),
    {
      title: "Action",
      width: 90,
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
