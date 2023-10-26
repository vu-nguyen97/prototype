import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table";
import Tooltip from "antd/lib/tooltip";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";

function ChromeStandaloneTable(props) {
    const defaultPageSize = 20;
    const [pageSize, setPageSize] = useState(defaultPageSize);

    const {listData, onEdit, onDelete, isLoading} = props;

    const columns = [
        {
            title: "IP",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record.ip}
                </div>
            )
        },
        {
            title: "Chrome Port",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record.chromePort}
                </div>
            )
        },
        {
            title: "VNC Port",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record.vncPort}
                </div>
            )
        },
        {
            title: "VNC PWD",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record.vncPassword}
                </div>
            )
        },
        {
            title: "Action",
            width: 140,
            render: (text, record) => {
                return (
                    <div className="flex space-x-2 ml-2">
                        <>
                            <Tooltip title="Edit container">
                                <AiOutlineEdit
                                    size={20}
                                    className="text-slate-600 hover:text-antPrimary cursor-pointer"
                                    onClick={() => onEdit(record)}
                                />
                            </Tooltip>

                            <Tooltip title="Delete container">
                                <DeleteOutlined
                                    className="icon-danger text-xl cursor-pointer"
                                    onClick={() => onDelete(record)}
                                />
                            </Tooltip>
                        </>
                    </div>
                );
            },
        }
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

ChromeStandaloneTable.defaultProps = {
    listData: [],
};
ChromeStandaloneTable.propTypes = {
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    isLoading: PropTypes.bool,
    listData: PropTypes.array,
};

export default ChromeStandaloneTable;
