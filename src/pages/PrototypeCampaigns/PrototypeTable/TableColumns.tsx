import React from "react";
import {
  getLabelFromStr,
  sortByDate,
  sortByString,
} from "../../../utils/Helpers";
import moment from "moment";
import { Link } from "react-router-dom";
import GamePlatformIcon from "../../../partials/common/GamePlatformIcon";
import DefaultAppImg from "../../../partials/common/DefaultAppImg";
import { getDateCol } from "../../../partials/common/Table/Helper";
import Tooltip from "antd/lib/tooltip";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import { AiFillPauseCircle } from "@react-icons/all-files/ai/AiFillPauseCircle";
import { AiFillPlayCircle } from "@react-icons/all-files/ai/AiFillPlayCircle";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import Popconfirm from "antd/lib/popconfirm";
import Switch from "antd/lib/switch";
import { CAMPAIGN_STATUS } from "../../../constants/constants";

export default function getColumns(props) {
  const { data, onEdit, onDelete, onChangeStatus } = props;

  return [
    {
      title: "Name",
      render: (rd) => {
        const appUrl = "/apps/" + rd.id + "/perfomance";

        return (
          <Link to={appUrl} className="flex items-center">
            {rd.icon ? (
              <GamePlatformIcon app={rd} imgClass="w-8 h-8 rounded-full" />
            ) : (
              <DefaultAppImg
                classNames="w-8 h-8"
                dot={rd.active}
                dotClass="!h-1.5 !w-1.5 !right-[3px]"
              />
            )}
            <div className="ml-1.5">{rd.name}</div>
          </Link>
        );
      },
      // sorter: sortByString("name"),
    },
    {
      title: "Create date",
      render: getDateCol,
      // sorter: sortByDate("createdDate"), // sort be
    },
    {
      title: "Created by",
      render: (rd) => rd.createdBy,
      // sorter: sortByString("createdBy"),
    },
    {
      title: "Start date",
      // sorter: sortByDate("startDate"),
      render: (record) => {
        if (!record.startDate) return "";
        return moment(record.startDate)?.format("DD-MM-YYYY");
      },
    },
    {
      title: "End date",
      // sorter: sortByDate("endDate"),
      render: (record) => {
        if (!record.endDate) return "";
        return moment(record.endDate)?.format("DD-MM-YYYY");
      },
    },
    { title: "Status", render: (rd) => getLabelFromStr(rd.state) },
    {
      title: "Action",
      align: "center",
      render: (record) => {
        const { state } = record;
        let checked = false;

        // draft: cho edit, cho del, cho run. -> checked false
        // submitted: ko show action.
        // running: cho pause. -> checked true
        // pause: cho run, cho del. -> checked false
        // failed: cho del.
        if (state === CAMPAIGN_STATUS.submitted) return <></>;
        if (state === CAMPAIGN_STATUS.running) {
          checked = true;
        }

        return (
          <div className="flex items-center justify-center space-x-2 ml-2">
            <>
              {/* <Tooltip title="Run campaign">
                <AiFillPlayCircle
                  size={24}
                  className="text-green-700 hover:text-green-700/80 cursor-pointer"
                />
              </Tooltip>
              <Tooltip title="Pause campaign">
                <AiFillPauseCircle
                  size={24}
                  className="text-slate-600 hover:text-slate-600/80 cursor-pointer"
                />
              </Tooltip> */}

              {state !== CAMPAIGN_STATUS.failed && (
                <Tooltip title={checked ? "Pause" : "Submit"}>
                  <Popconfirm
                    placement="left"
                    title={
                      checked
                        ? "Pause this campaign?"
                        : "Submit this campaign to Unity?"
                    }
                    onConfirm={() => onChangeStatus(record, !checked)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Switch
                      style={{
                        backgroundColor: checked ? "#16a34a" : "#d6d3d1",
                      }}
                      size="small"
                      checked={checked}
                    />
                  </Popconfirm>
                </Tooltip>
              )}

              {state === CAMPAIGN_STATUS.draft && (
                <Tooltip title="Edit campaign">
                  <AiOutlineEdit
                    size={20}
                    className="text-slate-600 hover:text-antPrimary cursor-pointer"
                    onClick={() => onEdit(record)}
                  />
                </Tooltip>
              )}

              {state !== CAMPAIGN_STATUS.running && (
                <Popconfirm
                  placement="left"
                  title="Remove this campaign?"
                  onConfirm={() => onDelete(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip title="Delete campaign">
                    <DeleteOutlined className="icon-danger text-xl cursor-pointer" />
                  </Tooltip>
                </Popconfirm>
              )}
            </>
          </div>
        );
      },
    },
  ];
}
