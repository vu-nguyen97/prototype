import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table";
import { FaMugHot } from "@react-icons/all-files/fa/FaMugHot";
import { FaSpinner } from "@react-icons/all-files/fa/FaSpinner";
import { FaLinkSlash } from "react-icons/fa6";
import TimeAgoComponent from "../../utils/time/TimeAgoComponent";

function SeleniumClientsTable(props) {
  const defaultPageSize = 20;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const { listData, onEdit, onDelete, onSyncApp, isLoading } = props;

  const columns = [
    {
      title: "ID",
      render: (record) => (
        <div className="flex items-center">
          <div>
            <div className=" text-black text-base">{record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Account",
      render: (record) => (
        <div className="font-bold text-black whitespace-nowrap md:whitespace-normal" style={{ fontSize: "1rem" }} >
          {record.name}
        </div>
      ),
    },
    {
      title: "State",
      render: (record) => formatState(record?.state),
    },
    {
      title: "Last Ping",
      render: (record) => (
        <TimeAgoComponent createDate={record?.lastPing}/>
      ),
    },
  ];

  const formatState = (_state: string) => {
    if (_state === "IDLE" || _state === "idle") {
      return (
        <div className="bold flex">
          <FaMugHot fontSize="1.5rem" className="text-gray-600"/>
          <span className="font-semibold  text-gray-600 ml-5 mt-1">{_state}</span>
        </div>
      );
    }
    if (_state === "PROCESSING" || _state === "processing") {
      return (
        <div className="bold flex">
          <FaSpinner className="spin text-green-600" fontSize="1.5rem"
          />
          <span className="font-semibold text-green-600 ml-5 mt-1">{_state}</span>
        </div>
      );
    }
    if (_state === "LOGIN_REQUIRE" || _state === "login_require") {
      return (
        <div className="bold flex">
          <FaLinkSlash className=" text-red-600 bounce" fontSize="1.5rem" />
          <span className="font-semibold text-red-600 ml-5 mt-1">{_state}</span>
        </div>
      );
    }
  };

  const pagination = {
    hideOnSinglePage: true,
    pageSize,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <Table
      id="selenium-clients-table"
      rowKey={(record) => record.id}
      columns={columns}
      loading={isLoading}
      dataSource={[...listData]}
      scroll={{ x: 600 }}
      size="middle"
      pagination={pagination}
      onChange={(pagination) => {
        pagination?.pageSize && setPageSize(pagination?.pageSize);
      }}
    />
  );
}

SeleniumClientsTable.defaultProps = {
  listData: [],
};
SeleniumClientsTable.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onSyncApp: PropTypes.func,
  isLoading: PropTypes.bool,
  listData: PropTypes.array,
};

export default SeleniumClientsTable;
