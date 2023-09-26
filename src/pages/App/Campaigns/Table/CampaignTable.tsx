import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Table from "antd/lib/table/Table";
import { getColumns } from "./TableConfig";
import {
  checkContainText,
  checkRangeValue,
  setRangeValue,
} from "../../../../utils/helper/TableHelpers";
import service from "../../../../partials/services/axios.config";
import { toast } from "react-toastify";

function CampaignTable(props) {
  const { data, setData, isLoading, setIsLoading } = props;
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

  const onChangeStatus = (rd) => {
    let url = "/campaign/active";
    if (rd.enabled) {
      url = "/campaign/pause";
    }
    setIsLoading(true);
    service.put(url, null, { params: { campaignId: rd.id } }).then(
      (res: any) => {
        const newData = data.map((el) => (el.id === rd.id ? res.results : el));
        setData(newData);
        toast(res.message, { type: "success" });
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  };

  useEffect(() => {
    setColumns(
      getColumns({
        data,
        onSearchTable,
        onFilterTable,
        onChangeStatus,
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
      loading={isLoading}
      bordered
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
  setData: PropTypes.func,
  setIsLoading: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default CampaignTable;
