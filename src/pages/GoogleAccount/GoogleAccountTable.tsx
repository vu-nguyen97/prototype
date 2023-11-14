import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table";
import Tooltip from "antd/lib/tooltip";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import {AiFillEye} from "@react-icons/all-files/ai/AiFillEye";
import {AiOutlineReload} from "@react-icons/all-files/ai/AiOutlineReload";
import {AiOutlineLogin} from "@react-icons/all-files/ai/AiOutlineLogin";
import {AiOutlineCheckCircle} from "@react-icons/all-files/ai/AiOutlineCheckCircle"
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import { Link } from 'react-router-dom';
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";

function GoogleAccountTable(props) {
    const defaultPageSize = 20;
    const [pageSize, setPageSize] = useState(defaultPageSize);

    const {listData, onEdit, onDelete, onSyncApp, isLoading} = props;
    const onUpdateStatus = (record) => {
        service.post("/google-play-stores/"+record?.id+"/check-state",{account: record?.email}).then(
        (res: any) => {
        toast(res.message || "check state success!", { type: "success" });
      },
    );
    const timeout = setTimeout(() => {
        // Code to execute after the delay
        console.log('Delayed code executed');
        window.location.reload();
    }, 5000);
    return () => {clearTimeout(timeout); window.location.reload();};
    }
    
    const onOpenVnc = (value) => {
        const state = {ip: value.container.ip, vncPort: value.container.vncPort,  vncPassword: value.container.vncPassword}
        const queryString = new URLSearchParams(state).toString();
        window.open("/vnc-viewer?" + queryString, '_blank');
        onStopTask();
    }

    const onStopTask = () => {
        console.log("stop task");
        service.post("/stop-task").then(
        (res: any) => {
        toast(res.message || "stop task success!", { type: "success" });
      },
    );
    }

    const columns = [
        {
            title: "Account",
            render: (record) => (
                <div className="flex items-center">
                    <div>
                        <div className="font-semibold text-black text-base">
                            {record.name}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Email",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record.email}
                </div>
            ),
        },
        {
            title: "IP",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record?.container?.ip}
                </div>
            )
        },
        {
            title: "Chrome Port",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record?.container?.chromePort}
                </div>
            )
        },
        {
            title: "VNC Port",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record?.container?.vncPort}
                </div>
            )
        },
        {
            title: "VNC PWD",
            render: (record) => (
                <div className="whitespace-nowrap md:whitespace-normal">
                    {record?.container?.vncPassword}
                </div>
            )
        },
        {
            title: "Action",
            width: 140,
            render: (text, record) => {
                return (
                    (record?.state == "LOGIN_REQUIRE")?(
                        <div className="flex space-x-2 ml-2">
                        <>
                            <Tooltip title="Login">
                                <AiOutlineLogin
                                    size={20}
                                    className="text-slate-600 hover:text-antPrimary cursor-pointer"
                                    onClick={()=>{onOpenVnc(record)}}
                                />
                            </Tooltip>
                            <Tooltip title="Logged In Check">
                                <AiOutlineCheckCircle
                                    size={20}
                                    className="text-slate-600 hover:text-antPrimary cursor-pointer"
                                    onClick={()=>onUpdateStatus(record)}
                                />
                            </Tooltip>
                        </>
                    </div>
                    ):
                    (<div className="flex space-x-2 ml-2">
                        <>
                            <Tooltip title="Open">
                                <AiFillEye
                                    size={20}
                                    className="text-slate-600 hover:text-antPrimary cursor-pointer"
                                    onClick={()=>{onOpenVnc(record)}}
                                />
                            </Tooltip>
                            <Tooltip title="Edit account">
                                <AiOutlineEdit
                                    size={20}
                                    className="text-slate-600 hover:text-antPrimary cursor-pointer"
                                    onClick={() => onEdit(record)}
                                />
                            </Tooltip>

                            <Tooltip title="Delete account">
                                <DeleteOutlined
                                    size={20}
                                    className="icon-danger text-xl cursor-pointer"
                                    onClick={() => onDelete(record)}
                                />
                            </Tooltip>

                            <Tooltip title="Sync app">
                                <AiOutlineReload
                                    size={20}
                                    className="icon-danger text-xl cursor-pointer"
                                    onClick={() => onSyncApp(record)}
                                />
                            </Tooltip>
                        </>
                    </div>)
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
            id="custom-store-listing-table"
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

GoogleAccountTable.defaultProps = {
    listData: [],
};
GoogleAccountTable.propTypes = {
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onSyncApp: PropTypes.func,
    isLoading: PropTypes.bool,
    listData: PropTypes.array,
};

export default GoogleAccountTable;
