import React from "react";
import { ID_COL } from "../../../../../partials/common/Table/Columns/IndexCol";
import getColumnSearchProps from "../../../../../partials/common/Table/CustomSearch";
import { keepSortColumn } from "../../../../../partials/common/Table/Helper";
import { capitalizeWord } from "../../../../../utils/Helpers";
import { ACTIVE_STATUS } from "../../../../../constants/constants";
import { NameColumn } from "../../../../../partials/common/Table/Columns/NameColumn";

export function getColumns(props) {
  const { onSearchTable, setPreviewData, setImgPreview } = props;

  return [
    ID_COL,
    {
      title: "Name",
      render: (rd) => {
        return (
          <div className="flex items-center justify-between">
            <>{NameColumn(rd, setPreviewData, setImgPreview)}</>
            {rd.status === ACTIVE_STATUS && <div className="actived-dot" />}
          </div>
        );
      },
      ...getColumnSearchProps({
        dataIndex: "name",
        callback: (value) => onSearchTable(value, "name"),
        customFilter: () => true,
      }),
      sorter: keepSortColumn,
    },
    {
      title: "Type",
      render: (rd) => capitalizeWord(rd.type),
      sorter: keepSortColumn,
      ...getColumnSearchProps({
        dataIndex: "type",
        callback: (value) => onSearchTable(value, "type"),
        customFilter: () => true,
      }),
    },
    {
      title: "Language",
      render: (rd) => rd.language && rd.language.toUpperCase(),
      sorter: keepSortColumn,
      ...getColumnSearchProps({
        dataIndex: "language",
        callback: (value) => onSearchTable(value, "language"),
        customFilter: () => true,
      }),
    },
  ];
}
