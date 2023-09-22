import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import classNames from "classnames";
import moment from "moment";
import React from "react";
import { getCountryNameFromCode } from "../../../utils/Helpers";
import { SortData, SortMap } from "./interface";
import { ASCEND, DESCEND } from "../../../constants/constants";

export const getRowSelection = (
  selectedRecords,
  setSelectedRecords,
  listData,
  fieldId = "id"
) => {
  return {
    selectedRowKeys: selectedRecords,
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      let newListIds: any = [...selectedRecords];

      if (selected) {
        newListIds.push(record[fieldId]);
      } else {
        newListIds = newListIds.filter((el) => el !== record[fieldId]);
      }
      setSelectedRecords(newListIds);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      let listIds = [];
      if (selected) {
        listIds = listData.map((el) => el[fieldId]);
      }
      setSelectedRecords(listIds);
    },
  };
};

export const filterIcon = (filtered) => (
  <SearchOutlined
    className={classNames("text-lg mt-px", filtered && "text-antPrimary")}
  />
);

export const getDateCol = (record) => (
  <div className="whitespace-nowrap md:whitespace-normal">
    {moment(record?.createdDate)?.format("DD-MM-YYYY HH:mm:ss")}
  </div>
);

export const getSortedData = (listData, sortData: SortData) => {
  const sortedData = [...listData];

  if (sortData?.sorter) {
    if (sortData.sortType === ASCEND) {
      sortedData.sort((a, b) => sortData.sorter(a, b));
    }
    if (sortData.sortType === DESCEND) {
      sortedData.sort((a, b) => sortData.sorter(b, a));
    }
  }

  return sortedData;
};

export const keepSortColumn = (a, b, sortOrder) =>
  sortOrder === ASCEND ? 1 : -1;

/**
 * List handle functions for infinite scroll table
 */
export const onChangeInfiniteTable = (
  pagination,
  filters,
  sorter,
  extra,
  sortMap: SortMap[],
  setSortData
) => {
  if (!sorter?.column?.title) {
    return setSortData({});
  }
  const activedSort = sortMap.find(
    (el: any) => el.title === sorter?.column?.title
  );

  if (!activedSort) return;
  setSortData({
    sortType: sorter.order,
    sorter: activedSort?.sorter,
  });
};

export function sortByString(a, b, attr) {
  if (!attr) {
    return 1; // keep position of current data
  }

  // https://stackoverflow.com/questions/51165/how-to-sort-strings-in-javascript
  return ("" + a[attr]).localeCompare(b[attr]);
}

export const sortByCountry = (a, b) => {
  const aData = getCountryNameFromCode(a.country);
  const bData = getCountryNameFromCode(b.country);

  return ("" + aData).localeCompare(bData);
};

/**
 * End: infinite scroll table
 */
