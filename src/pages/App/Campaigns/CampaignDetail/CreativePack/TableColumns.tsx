import React from "react";
import { ID_COL } from "../../../../../partials/common/Table/Columns/IndexCol";
// import { PerformanceColumns } from "../../../../../partials/common/Table/Columns/PerformanceCols";
import getColumnSearchProps from "../../../../../partials/common/Table/CustomSearch";
import { keepSortColumn } from "../../../../../partials/common/Table/Helper";
import { getTotalChildrenStr } from "../../../../../utils/Helpers";
import classNames from "classnames";
import Tooltip from "antd/lib/tooltip";

export const getCreativePackName = (rd, onClickName: any = null) => {
  let totalChildren = getTotalChildrenStr(rd, "creatives");
  if (!rd.creatives?.length && rd.assets?.length) {
    totalChildren = getTotalChildrenStr(rd, "assets");
  }

  const name = rd.name + totalChildren;
  const hasCreative = rd.creatives?.length || rd.assets?.length;

  return (
    <Tooltip title={name}>
      <div
        className={classNames(
          "truncate",
          hasCreative &&
            "cursor-pointer text-antPrimary hover:text-antPrimary/90"
        )}
        onClick={() => onClickName && onClickName(rd)}
        title={hasCreative && onClickName ? "Click to view list creatives" : ""}
      >
        {name}
      </div>
    </Tooltip>
  );
};

export function getColumns(props) {
  const { onSearchTable, onFilterTable, onClickName } = props;

  return [
    ID_COL,
    {
      title: "Name",
      width: 350,
      maxWidth: 600,
      render: (rd) => getCreativePackName(rd, onClickName),
      ...getColumnSearchProps({
        dataIndex: "name",
        callback: (value) => onSearchTable(value, "name"),
        customFilter: () => true,
      }),
      sorter: keepSortColumn,
    },
    // ...PerformanceColumns({ onFilterTable, isKeepSort: true }),
  ];
}
