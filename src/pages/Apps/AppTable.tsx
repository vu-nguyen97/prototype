import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table";
import Input from "antd/lib/input/Input";
import Tooltip from "antd/lib/tooltip";
import { AiOutlineFilter } from "@react-icons/all-files/ai/AiOutlineFilter";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import {AiOutlineSearch} from "@react-icons/all-files/ai/AiOutlineSearch"
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import {AiFillEye} from "@react-icons/all-files/ai/AiFillEye";
import { Select } from "antd";
function AppTable(props) {
    const defaultPageSize = 10;
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [searchByDevId, setSearchByDevId] = useState("");
    const {listData, onSearch, isLoading} = props;

    const columns = [
        {
            title: "Name",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record.name}
                </div>
            )
        },
        {
            title: "PackageId",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record.packageId}
                </div>
            )
        },
        {
            title: "App Status",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record.consoleStatus}
                </div>
            )
        },
        {
            title: "Update Status",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record.updateStatus}
                </div>
            )
        },
        {
            title: "Last Update",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record.lastUpdate}
                </div>
            )
        },
        // {
        //     title: (
        //         <div className="flex space-x-2 ml-2" style={{ position: 'relative' }}>
        //             <div >DeveloperId</div>
        //             <Input placeholder="Search App By DeveloperId" onChange={(e) => setSearchByDevId(e.target.value)}/>
        //             <Tooltip title="Search App">
        //             <AiOutlineSearch
        //             size={30}
        //             className="text-slate-600 hover:text-antPrimary cursor-pointer"
        //             onClick={()=>onSearch(searchByDevId)}/>
        //             </Tooltip>
        //         </div>
        //     ),
        //     render: (record) => (
        //         <div className="whitespace-nowrap md:whitespace-normal">
        //             {record.consoleAppId}
        //         </div>
        //     )
        // },
        {
            title: "Action",
            width: 140,
            render: (record) => {
                return (
                    <div className="flex space-x-2 ml-2">
                        <>
                            <Tooltip title="View app details">
                                <AiFillEye
                                    className="text-slate-600 hover:text-antPrimary cursor-pointer"
                                    size={20}
                                    onClick={() => {
                                        window.open(
                                            `/apps/${record.consoleAppId}/main-store-listing`, "_current"
                                        )
                                    }}
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
        />
    );
}

AppTable.defaultProps = {
    listData: [],
};
AppTable.propTypes = {
    onSearch: PropTypes.func,
    isLoading: PropTypes.bool,
    listData: PropTypes.array,
};

export default AppTable;
