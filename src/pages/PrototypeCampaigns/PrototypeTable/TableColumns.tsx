import React from "react";
import { sortByDate, sortByString } from "../../../utils/Helpers";
import moment from "moment";
import { Link } from "react-router-dom";
import GamePlatformIcon from "../../../partials/common/GamePlatformIcon";
import DefaultAppImg from "../../../partials/common/DefaultAppImg";
import { getDateCol } from "../../../partials/common/Table/Helper";

export default function getColumns(props) {
  const { data } = props;

  return [
    {
      title: "Name",
      render: (rd) => {
        const appUrl = "/apps/" + rd.id + "/overview";

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
    { title: "Actived", render: (rd) => rd.active?.toString() },
  ];
}
