import React from "react";
import getColumnSearchProps from "../../partials/common/Table/CustomSearch";
import {
  getColumnNumber,
  sortByString,
  sortNumberWithNullable,
} from "../../utils/Helpers";
import Tooltip from "antd/lib/tooltip";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import Popconfirm from "antd/lib/popconfirm";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import searchMaxMinValue from "../../partials/common/Table/SearchMaxMinValue";

export const getColumns = (props) => {
  const { onSearchTable, onFilterTable, onOpenModalEdit } = props;

  return [
    {
      title: "Name",
      dataIndex: "name",
      sorter: sortByString("name"),
      ...getColumnSearchProps({
        dataIndex: "name",
        getField: (el) => el.name,
        callback: (value) => onSearchTable(value, "name"),
        customFilter: () => true,
      }),
    },
    {
      title: "Total budget",
      render: (rd) => getColumnNumber(rd.totalBudget, "$"),
      ...searchMaxMinValue({
        dataIndex: "totalBudget",
        placeholderSuffix: " ",
        onFilterTable,
        getField: (el) => el.totalBudget,
      }),
      sorter: (a, b) => sortNumberWithNullable(a, b, (el) => el.totalBudget),
    },
    {
      title: "Daily budget",
      render: (rd) => getColumnNumber(rd.dailyBudget, "$"),
      ...searchMaxMinValue({
        dataIndex: "dailyBudget",
        placeholderSuffix: " ",
        onFilterTable,
        getField: (el) => el.dailyBudget,
      }),
      sorter: (a, b) => sortNumberWithNullable(a, b, (el) => el.totalBudget),
    },
    {
      title: "Total day",
      render: (rd) => rd.totalDay,
      sorter: (a, b) => sortNumberWithNullable(a, b, (el) => el.totalDay),
      ...searchMaxMinValue({
        dataIndex: "totalDay",
        placeholderSuffix: " ",
        onFilterTable,
        getField: (el) => el.totalDay,
      }),
    },
    {
      title: "Language",
      render: (rd) => rd.language && rd.language.toUpperCase(),
      sorter: sortByString("language"),
      ...getColumnSearchProps({
        dataIndex: "language",
        getField: (el) => el.language,
        callback: (value) => onSearchTable(value, "language"),
        customFilter: () => true,
      }),
    },
    {
      title: "Country bid",
      render: (rd) => {
        const countryBid = rd.bids?.map((el) => el.country + ": $" + el.bid);

        return <div>{countryBid.join(", ")}</div>;
      },
    },
    {
      title: "Action",
      render: (record) => (
        <div className="flex space-x-2 ml-2">
          <Tooltip title="Edit">
            <AiOutlineEdit
              size={20}
              className="text-slate-600 hover:text-antPrimary cursor-pointer"
              onClick={() =>  onOpenModalEdit(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
};
