import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table";
import Tooltip from "antd/lib/tooltip";
import { Link } from "react-router-dom";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import { AiOutlineUpload } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";
import {
  sortByBool,
  sortByString,
  sortNumberWithNullable,
} from "../../utils/Helpers";
import moment from "moment";

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
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        toast(error.message, { type: "error" });
      });
  };

  const columns = [
    {
      title: "Name",
      sorter: sortByString("name"),
      render: (record) => (
        <div className="flex items-center space-x-2 md:ml-1.5">
          <img src={record.icon} className="w-8 h-8 rounded" />
          <div>{record.name}</div>
        </div>
      ),
    },
    {
      title: "PackageId",
      sorter: sortByString("packageId"),
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.packageId}
        </div>
      ),
    },
    {
      title: "App Status",
      sorter: sortByString("consoleStatus"),
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.consoleStatus}
        </div>
      ),
    },
    {
      title: "Update Status",
      sorter: sortByString("updateStatus"),
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.updateStatus}
        </div>
      ),
    },
    {
      title: "Last Update",
      sorter: (a, b) => sortNumberWithNullable(a, b, (el) => el.lastSyncTime),
      render: (record) => (
        <div className="whitespace-nowrap md:whitespace-normal">
          {record.lastSyncTime &&
            moment(record.lastSyncTime).format("DD-MM-YYYY HH:mm")}
        </div>
      ),
    },
    {
      title: "Linked Unity",
      sorter: sortByBool("unityAppId"),
      render: (record) => {
        return (
          <>
            {record.unityAppId ? (
              <div className="flex items-center">
                <AiOutlineCheck size={16} color="green" />
                <span className="text-green-500 ml-0.5">Linked</span>
              </div>
            ) : (
              <div className="flex items-center">
                <AiOutlineClose size={14} className="text-red-500" />
                <span className="text-red-500 ml-0.5">Not Linked</span>
              </div>
              // <div className="flex items-center space-x-2">
              //   <Tooltip title="Not linked yet">
              //     <AiOutlineClose size={20} color="red" />
              //   </Tooltip>
              //   <Tooltip title="Link Unity App" arrowPointAtCenter>
              //     <AiOutlineUpload
              //       size={20}
              //       className="text-slate-600 hover:text-antPrimary cursor-pointer"
              //       onClick={() => createUnityApp(record)}
              //     />
              //   </Tooltip>
              // </div>
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
      id="app-table"
      rowKey={(record) => record.id}
      // @ts-ignore
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
