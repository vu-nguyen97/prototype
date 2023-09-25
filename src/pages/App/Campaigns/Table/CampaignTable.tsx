import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table/Table";
import { getColumns } from "./TableConfig";
import {
  checkContainText,
  checkRangeValue,
  setRangeValue,
} from "../../../../utils/helper/TableHelpers";

function CampaignTable(props) {
  const { data } = props;
  const defaultPageSize = 20;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [columns, setColumns] = useState(getColumns({}));

  const [filterByMaxMin, setFilterByMaxMin] = useState<any>({});
  const [searchData, setSearchData] = useState<any>({});

  const onFilterTable = (data) => {
    setRangeValue(data, filterByMaxMin, setFilterByMaxMin);
  };

  const onSearchTable = (value, field) => {
    setSearchData({ ...searchData, [field]: value });
  };

  useEffect(() => {
    setColumns(
      getColumns({
        onSearchTable,
        onFilterTable,
      })
    );
  }, [data]);

  const onChangeTable = (pagination) => {
    if (pagination?.pageSize && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
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
    pageSize,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <Table
      id="CampaignTable"
      className="mt-6"
      getPopupContainer={() => document.getElementById("CampaignTable")!}
      rowKey={(record) => record.id}
      dataSource={filteredData}
      // @ts-ignore
      columns={columns}
      scroll={{ x: 600 }}
      pagination={pagination}
      onChange={onChangeTable}
    />
  );
}

CampaignTable.propTypes = {
  data: PropTypes.array,
};

export default CampaignTable;
