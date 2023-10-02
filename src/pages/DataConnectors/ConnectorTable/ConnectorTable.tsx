import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table";
import Tooltip from "antd/lib/tooltip";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import { capitalizeWord, sortByString } from "../../../utils/Helpers";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";

function ConnectorTable(props) {
  const defaultPageSize = 20;
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const { isAdmin, listData, onEdit, onDelete, isLoading } = props;

  const columns: any = [
    {
      title: "Name",
      sorter: (a, b) => ("" + a.network?.name).localeCompare(b.network?.name),
      render: (record) => (
        <div className="flex items-center">
          {record.network?.imageUrl && (
            <img
              alt=" "
              src={record.network.imageUrl}
              className="h-8 w-8 rounded mr-2 shrink-0"
            />
          )}
          <div>
            <div className="font-semibold text-black text-base">
              {record.network?.name}
            </div>
            <div className="italic text-xs">{record.name}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      sorter: (a, b) =>
        ("" + a.network?.networkType?.name).localeCompare(
          b.network?.networkType?.name
        ),
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.network?.networkType?.name}
        </div>
      ),
    },
    {
      title: "Status",
      sorter: sortByString("status"),
      render: (record) => capitalizeWord(record.status),
    },
  ];

  if (isAdmin) {
    columns.push({
      title: "Action",
      width: 140,
      render: (text, record, idx) => {
        return (
          <div className="flex space-x-2 ml-2">
            <>
              <Tooltip title="Edit connector">
                <AiOutlineEdit
                  size={20}
                  className="text-slate-600 hover:text-antPrimary cursor-pointer"
                  onClick={() => onEdit(record)}
                />
              </Tooltip>

              <Tooltip title="Delete connector">
                <DeleteOutlined
                  className="icon-danger text-xl cursor-pointer"
                  onClick={() => onDelete(record)}
                />
              </Tooltip>
            </>
          </div>
        );
      },
    });
  }

  const pagination = {
    hideOnSinglePage: true,
    pageSize,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <Table
      id="connector-table"
      getPopupContainer={() => document.getElementById("connector-table")!}
      rowKey={(record) => record.id + record.totalApps}
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

ConnectorTable.defaultProps = {
  listData: [],
};
ConnectorTable.propTypes = {
  isAdmin: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isLoading: PropTypes.bool,
  listData: PropTypes.array,
};

export default ConnectorTable;
