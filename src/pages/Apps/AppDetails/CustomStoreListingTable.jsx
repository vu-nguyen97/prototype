import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table";
import Tooltip from "antd/lib/tooltip";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import { capitalizeWord, sortByString } from "../../../utils/Helpers";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import Popconfirm from "antd/lib/popconfirm";
import ListImages from "../../../partials/common/ListImages";

function CustomStoreListingTable(props) {
  const defaultPageSize = 10;
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const { listData, onEdit, onDelete, isLoading } = props;

  const columns = [
    {
      title: "Listing Name",
      render: (record) => (
        <div className="flex items-center">
          <div>
            <div className="font-semibold">{record.listingName}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      render: (record) => <div>{capitalizeWord(record.type)}</div>,
    },
    // {
    //   title: "Images",
    //   render: (record) => (
    //     <ListImages />
    //   ),
    // },
    {
      title: "Custom URL",
      render: (record) => (
        <div className="truncate">
          <a href={record.customUrl} target="_blank" rel="noreferrer">
            {record.customUrl}
          </a>
        </div>
      ),
    },
    // {
    //   title: "Action",
    //   width: 140,
    //   render: (text, record) => {
    //     return (
    //       <div className="flex space-x-2 ml-2">
    //         {/* <>
    //           <Tooltip title="Edit store listing">
    //             <AiOutlineEdit
    //               size={20}
    //               className="text-slate-600 hover:text-antPrimary cursor-pointer"
    //               onClick={() => onEdit(record)}
    //             />
    //           </Tooltip>
    //         </> */}
    //         <Popconfirm
    //           placement="left"
    //           title="Remove this listing?"
    //           onConfirm={() => onDelete(record)}
    //           okText="Yes"
    //           cancelText="No"
    //         >
    //           <DeleteOutlined className="icon-danger text-xl cursor-pointer" />
    //         </Popconfirm>
    //       </div>
    //     );
    //   },
    // },
  ];

  const pagination = {
    hideOnSinglePage: true,
    pageSize,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <Table
      id="custom-store-listing-table"
      rowKey={(record) => record.id}
      columns={columns}
      loading={isLoading}
      dataSource={[...listData]}
      scroll={{ x: 800 }}
      size="middle"
      pagination={pagination}
      onChange={(pagination) => {
        pagination?.pageSize && setPageSize(pagination?.pageSize);
      }}
    />
  );
}

CustomStoreListingTable.defaultProps = {
  listData: [],
};
CustomStoreListingTable.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isLoading: PropTypes.bool,
  listData: PropTypes.array,
};

export default CustomStoreListingTable;
