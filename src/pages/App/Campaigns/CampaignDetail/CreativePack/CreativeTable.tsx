import React, { useState } from "react";
import Table from "antd/lib/table";
import { ACTIVE_STATUS } from "../../../../../constants/constants";
import {
  getLabelFromStr,
  sortByDate,
  sortByString,
  sortNumberWithNullable,
} from "../../../../../utils/Helpers";
import moment from "moment";
import {
  checkContainText,
  checkRangeValue,
  setRangeValue,
} from "../../../../../utils/helper/TableHelpers";
import getColumnSearchProps from "../../../../../partials/common/Table/CustomSearch";
import { showListData } from "../../../../../utils/helper/UIHelper";
import { NameColumn } from "../../../../../partials/common/Table/Columns/NameColumn";
// import { perCreativeCols } from "../ColumnsHelpers";

function CreativeTable(props) {
  const { data, setPreviewData, setImgPreview } = props;

  const [tableFilters, setTableFilters] = useState({
    size: 10,
    page: 0,
  });
  const [filterByMaxMin, setFilterByMaxMin] = useState<any>({});
  const [searchData, setSearchData] = useState<any>({});

  const onSearchTable = (value, field) => {
    setSearchData({ ...searchData, [field]: value });
  };

  const onFilterTable = (data) => {
    setRangeValue(data, filterByMaxMin, setFilterByMaxMin);
  };

  const columns = [
    {
      title: "Name",
      width: 200,
      render: (rd) => (
        <div className="flex items-center justify-between">
          <>{NameColumn(rd, setPreviewData, setImgPreview)}</>
          {/* Todo: current status = 'approved' */}
          {rd.status === ACTIVE_STATUS && <div className="actived-dot" />}
        </div>
      ),
      sorter: sortByString("name"),
      ...getColumnSearchProps({
        dataIndex: "name",
        getField: (el) => el.name,
        callback: (value) => onSearchTable(value, "name"),
        customFilter: () => true,
      }),
    },
    {
      title: "Type",
      width: 80,
      render: (rd) => getLabelFromStr(rd.type),
      sorter: sortByString("type"),
      ...getColumnSearchProps({
        dataIndex: "type",
        getField: (el) => el.type,
        callback: (value) => onSearchTable(value, "type"),
        customFilter: () => true,
      }),
    },
    // ...perCreativeCols({ onFilterTable }),
  ];

  const onChange = (pagination, filters) => {
    const { pageSize, current } = pagination;
    setTableFilters({ size: pageSize, page: current - 1 });
  };

  const filteredData = data?.filter((el) => {
    let result = true;

    const isContainText = checkContainText(searchData, el);
    const checkValue = checkRangeValue(filterByMaxMin, el);

    if (!isContainText || !checkValue) {
      result = false;
    }

    return result;
  });

  const pagination = {
    pageSize: tableFilters?.size,
    current: tableFilters?.page + 1,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <Table
      // @ts-ignore
      columns={columns}
      dataSource={filteredData}
      rowKey={(record) => record.id}
      scroll={{ x: 600 }}
      // scroll={{ x: 2400 }}
      onChange={onChange}
      pagination={pagination}
    />
  );
}

export default CreativeTable;
