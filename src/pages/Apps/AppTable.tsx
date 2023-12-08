import Table from "antd/lib/table";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { toast } from "react-toastify";
import service from "../../partials/services/axios.config";
import {
  sortByBool,
  sortByString,
  sortNumberWithNullable,
} from "../../utils/Helpers";
import { Link } from "react-router-dom";
import Tooltip from "antd/lib/tooltip";

function AppTable(props) {
  const defaultPageSize = 10;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const { listData, isLoading, setLoadingPage, linkUnityCb } = props;

  const createUnityApp = (record) => {
    setLoadingPage(true);
    service
      .post("/create-unity-app", {
        store: "google",
        storeId: record.packageId,
      })
      .then(
        (res: any) => {
          setLoadingPage(false);
          toast(res.message, { type: "success" });
          linkUnityCb(res.results);
        },
        () => setLoadingPage(false)
      );
  };

  const columns = [
    {
      title: "Name",
      sorter: sortByString("name"),
      render: (record) => (
        <Link
          to={`/apps/${record.consoleAppId}/main-store-listing`}
          className="flex items-center space-x-2 md:ml-1.5 !text-antPrimary hover:!text-antPrimary/90"
        >
          <img src={record.icon} className="w-8 h-8 rounded" />
          <div>{record.name}</div>
        </Link>
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
              <div className="flex items-center cursor-pointer">
                <Tooltip title="Link this app to Unity">
                  <span
                    className="text-blue-400 ml-0.5 cursor-pointer underline"
                    onClick={() => createUnityApp(record)}
                  >
                    Link now
                  </span>
                </Tooltip>
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
    />
  );
}

AppTable.defaultProps = {
  listData: [],
};
AppTable.propTypes = {
  isLoading: PropTypes.bool,
  listData: PropTypes.array,
  setLoadingPage: PropTypes.func,
  linkUnityCb: PropTypes.func,
};

export default AppTable;
