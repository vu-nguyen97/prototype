import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table";
import Tooltip from "antd/lib/tooltip";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";
import { FaSpinner } from "@react-icons/all-files/fa/FaSpinner";
import "./Spinner.css";
function TaskTable(props) {
  const defaultPageSize = 10;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const { listData, isLoading } = props;
  const sortedTasks = [...listData].sort((a, b) => {
    if (a.state === "RUNNING" && b.state !== "RUNNING") {
      return -1;
    } else if (a.state !== "RUNNING" && b.state === "RUNNING") {
      return 1;
    }
    return 0;
  });
  const timeStampToDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const dateTime = date.toLocaleString();
    return dateTime;
  };

  const color = (value) => {
    switch (value) {
      case "SUCCESS":
        return "#009933";
      case "FAILED":
        return "#FF0000";
      case "RUNNING":
        return "#33CC33";
      case "CREATED":
        return "#CCCC00";
    }
    return "#000000";
  };
  const columns = [
    {
      title: "Type",
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.type}
        </div>
      ),
    },
    {
      title: "State",
      render: (record) => (
        <div
          className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3"
          style={{
            fontWeight: "bold",
            color: color(record.state),
            fontSize: 16,
            marginTop: 4,
          }}
        >
          {record.state == "SUCCESS" && (
            <FaRegCheckCircle style={{ color: "green" }} size={20} />
          )}
          {record.state == "FAILED" && (
            <MdOutlineReportProblem style={{ color: "red" }} size={20} />
          )}
          {record.state == "RUNNING" && (
            <FaSpinner
              className="spinner"
              style={{ color: "#33CC33" }}
              size={20}
            />
          )}
          <div style={{ marginLeft: 5, marginTop: 4 }}>{record.state}</div>
        </div>
      ),
    },
    {
      title: "Created At",
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {timeStampToDateTime(record.createdAt)}
        </div>
      ),
    },
  ];

  const pagination = {
    hideOnSinglePage: true,
    pageSize,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <Table
      id="chrome-standalone-containers-table"
      rowKey={(record) => record.id}
      columns={columns}
      loading={isLoading}
      dataSource={[...sortedTasks]}
      scroll={{ x: 600 }}
      pagination={pagination}
      onChange={(pagination) => {
        pagination?.pageSize && setPageSize(pagination?.pageSize);
      }}
    />
  );
}

TaskTable.defaultProps = {
  listData: [],
};
TaskTable.propTypes = {
  isLoading: PropTypes.bool,
  listData: PropTypes.array,
};

export default TaskTable;
