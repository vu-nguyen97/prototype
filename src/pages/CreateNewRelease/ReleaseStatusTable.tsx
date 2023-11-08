import Table from "antd/lib/table";
import PropTypes from "prop-types";
import React, { useState } from "react";

function ReleaseStatusTable(props) {
  const defaultPageSize = 10;
  const [pageSize, setPageSize] = useState(defaultPageSize);
 
  const { listData, onEdit, onDelete, isLoading } = props;

  const columns = [
    {
      title: "App Name",
      render: (record) => (
        <div className="flex items-center">
          <div>
            <div className="font-semibold text-black text-base">
              {record.appName}
            </div>
          </div>
        </div>
      ),
      width: '33%',
    },
    {
      title: "Release Name",
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.releaseName}
        </div>
      ),
      width: '33%',
    },
    {
      title: "Status",
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.status}
        </div>
      ),
      width: '34%',
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
      size="middle"
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
