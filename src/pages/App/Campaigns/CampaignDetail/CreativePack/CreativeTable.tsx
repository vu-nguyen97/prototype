import React, { useState } from "react";
import Table from "antd/lib/table";
import { getLabelFromStr, sortByString } from "../../../../../utils/Helpers";
import { checkContainText } from "../../../../../utils/helper/TableHelpers";
import getColumnSearchProps from "../../../../../partials/common/Table/CustomSearch";
import { NameColumn } from "../../../../../partials/common/Table/Columns/NameColumn";

function CreativeTable(props) {
  const { data, setPreviewData, setImgPreview } = props;

  const [tableFilters, setTableFilters] = useState({
    size: 10,
    page: 0,
  });
  const [searchData, setSearchData] = useState<any>({});

  const onSearchTable = (value, field) => {
    setSearchData({ ...searchData, [field]: value });
  };

  const columns = [
    {
      title: "Name",
      render: (rd) => (
        <div className="flex items-center justify-between">
          <>{NameColumn(rd, setPreviewData, setImgPreview)}</>
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
      render: (rd) => getLabelFromStr(rd.type),
      sorter: sortByString("type"),
      ...getColumnSearchProps({
        dataIndex: "type",
        getField: (el) => el.type,
        callback: (value) => onSearchTable(value, "type"),
        customFilter: () => true,
      }),
    },
    {
      title: "Language",
      render: (rd) => rd.language && rd.language.toUpperCase(),
      sorter: sortByString("language"),
      ...getColumnSearchProps({
        dataIndex: "language",
        getField: (el) => el.language,
        callback: (value) => onSearchTable(value, "language"),
        customFilter: () => true,
      }),
    },
  ];

  const onChange = (pagination, filters) => {
    const { pageSize, current } = pagination;
    setTableFilters({ size: pageSize, page: current - 1 });
  };

  const filteredData = data?.filter((el) => {
    let result = true;
    const isContainText = checkContainText(searchData, el);

    if (!isContainText) {
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
      onChange={onChange}
      pagination={pagination}
    />
  );
}

export default CreativeTable;
