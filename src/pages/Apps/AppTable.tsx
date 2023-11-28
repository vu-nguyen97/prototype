import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table";
import Tooltip from "antd/lib/tooltip";
import { AiFillEye } from "@react-icons/all-files/ai/AiFillEye";
import { Link } from "react-router-dom";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import { AiOutlineUpload } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";
function AppTable(props) {
  const defaultPageSize = 10;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const { listData, isLoading } = props;

  const createUnityApp = (record) => {
    service
      .post("/create-unity-app", {
        store: "google",
        storeId: record.packageId,
      })
      .then((res: any) => {
        toast(res.message, { type: "success" });
      })
      .catch((error) => {
        toast(error.message, { type: "error" });
      });
  };

  const columns = [
    {
      title: "Name",
      render: (record) => (
        <div className="flex space-x-2 ml-2">
          <img
            src={record.icon}
            style={{ width: 22, height: 22, marginRight: 10 }}
          />
          {record.name}
        </div>
      ),
    },
    {
      title: "PackageId",
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.packageId}
        </div>
      ),
    },
    {
      title: "App Status",
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.consoleStatus}
        </div>
      ),
    },
    {
      title: "Update Status",
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.updateStatus}
        </div>
      ),
    },
    {
      title: "Last Update",
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.lastUpdate}
        </div>
      ),
    },
    {
      title: "Linked Unity",
      render: (record) => {
        return (
          <>
            {record.unityAppId ? (
              <div className="flex items-center gap-4">
                <AiOutlineCheck size={20} color="green" />
                <span className="text-green-500 font-bold">Linked</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Tooltip title="Not linked yet">
                  <AiOutlineClose size={20} color="red" />
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title="Link Unity App"
                  arrowPointAtCenter
                >
                  <AiOutlineUpload
                    size={20}
                    className="text-slate-600 hover:text-antPrimary cursor-pointer"
                    onClick={() => createUnityApp(record)}
                  />
                </Tooltip>
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "Linked Appsflyer",
      render: (record) => {
        return (
          <>
            {record.appsFlyerId ? (
              <div className="flex items-center gap-4">
                <AiOutlineCheck size={20} color="green" />
                <span className="text-green-500 font-bold">Linked</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <AiOutlineClose size={20} color="red" />
                <span className="text-red-500 font-bold">Not linked yet</span>
              </div>
            )}
          </>
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
      className="mt-6"
      id="app-table"
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
      onRow={(record) => ({
        onClick: () => {
          window.location.href = `/apps/${record.consoleAppId}/main-store-listing`;
        },
        style: { cursor: "pointer" },
      })}
    />
  );
}

AppTable.defaultProps = {
  listData: [],
};
AppTable.propTypes = {
  isLoading: PropTypes.bool,
  listData: PropTypes.array,
};

export default AppTable;
