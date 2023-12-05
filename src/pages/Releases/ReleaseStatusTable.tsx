import Table from "antd/lib/table";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { sortByDate, sortByString } from "../../utils/Helpers";
import moment from "moment";

function ReleaseStatusTable(props) {
  const defaultPageSize = 10;
  const { listData, onEdit, onDelete, isLoading } = props;

  const [pageSize, setPageSize] = useState(defaultPageSize);

  const columns = [
    {
      title: "Store",
      sorter: (a, b) => ("" + a.store?.name).localeCompare(b.store?.name),
      render: (record) => (
        <div className="flex items-center">
          <div className="">{record.store?.name}</div>
        </div>
      ),
    },
    {
      title: "App name",
      sorter: sortByString("appName"),
      render: (record) => (
        <div className="flex items-center">
          <div className="">{record.appName}</div>
        </div>
      ),
    },
    {
      title: "Release name",
      sorter: sortByString("releaseName"),
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.releaseName}
        </div>
      ),
    },
    {
      title: "Created by",
      sorter: sortByString("actionUserEmail"),
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.actionUserEmail}
        </div>
      ),
    },
    {
      title: "Created at",
      sorter: sortByDate("createdAt"),
      render: (record) => {
        if (!record.createdAt) return "";
        return moment(record.createdAt)?.format("DD-MM-YYYY HH:mm");
      },
    },
    {
      title: "Status",
      sorter: sortByString("detailStatus"),
      render: (record) => {
        let color;
        switch (record.detailStatus) {
          case "Error":
            color = "#ef4444";
            break;
          case "Done":
            color = "#22c55e";
            break;

          case "Creating the release":
          case "Created":
          default:
            break;
        }

        return (
          <div
            className="whitespace-nowrap md:whitespace-normal"
            style={{ color }}
          >
            {record.detailStatus}
          </div>
        );
      },
    },
  ];

  const pagination = {
    hideOnSinglePage: true,
    pageSize,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <Table
      id="release_status_table"
      rowKey={(record) => record.id}
      columns={columns}
      loading={isLoading}
      dataSource={[...listData]}
      scroll={{ x: 600 }}
      pagination={pagination}
      onChange={(pagination) => {
        pagination?.pageSize && setPageSize(pagination?.pageSize);
      }}
    />
  );
}

ReleaseStatusTable.defaultProps = {
  listData: [],
};
ReleaseStatusTable.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isLoading: PropTypes.bool,
  listData: PropTypes.array,
};

export default ReleaseStatusTable;
