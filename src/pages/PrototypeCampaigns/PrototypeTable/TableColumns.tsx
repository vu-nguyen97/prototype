import React from "react";
import { sortByDate, sortByString } from "../../../utils/Helpers";
import moment from "moment";
import { Link } from "react-router-dom";
import GamePlatformIcon from "../../../partials/common/GamePlatformIcon";
import DefaultAppImg from "../../../partials/common/DefaultAppImg";

export default function getColumns(props) {
  const { data } = props;

  const getDate = (field, title) => ({
    title,
    sorter: sortByDate(field),
    render: (record) => {
      if (!record[field]) return "";
      return moment(record[field])?.format("DD/MM/YYYY HH:mm");
    },
  });

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
      sorter: sortByString("name"),
    },
    {
      title: "Created by",
      render: (rd) => rd.createdBy,
      sorter: sortByString("createdBy"),
    },
    {
      title: "Start date",
      render: (rd) => (new Date(rd.createdDate).toISOString().split('T')[0]),
      sorter: sortByString("createdDate"),
    },
    {
      title: "End date",
      render: (rd) => ( new Date(new Date(rd.createdDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
      sorter: sortByString("createdDate"),
    },
    { title: "Actived", render: (rd) => rd.active?.toString() },
  ];
}
