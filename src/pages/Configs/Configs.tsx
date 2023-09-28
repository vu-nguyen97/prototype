import React, { useEffect, useState } from "react";
import Page from "../../utils/composables/Page";
import service from "../../partials/services/axios.config";
import Table from "antd/lib/table/Table";
import { getColumns } from "./TableColumns";
import {
  checkContainText,
  checkRangeValue,
  setRangeValue,
} from "../../utils/helper/TableHelpers";

export default function Configs() {
  const [configs, setConfigs] = useState([]);
  const defaultPageSize = 10;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [columns, setColumns] = useState(getColumns({}));
  const [isLoading, setIsLoading] = useState(false);

  const [searchData, setSearchData] = useState<any>({});
  const [filterByMaxMin, setFilterByMaxMin] = useState<any>({});

  useEffect(() => {
    setIsLoading(true);
    service.get("/configs").then(
      (res: any) => {
        setConfigs(res.results);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  }, []);

  useEffect(() => {
    setColumns(
      getColumns({
        configs,
        onSearchTable,
        onFilterTable,
      })
    );
  }, [configs]);

  const onSearchTable = (value, field) => {
    setSearchData({ ...searchData, [field]: value });
  };

  const onFilterTable = (data) => {
    setRangeValue(data, filterByMaxMin, setFilterByMaxMin);
  };

  const onChangeTable = (pagination) => {
    if (pagination?.pageSize && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
  };

  const filteredData = configs?.filter((el) => {
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
    <Page>
      <div className="flex justify-between">
        <div className="page-title">Configs</div>
      </div>

      <Table
        className="mt-3"
        id="ConfigTable"
        getPopupContainer={() => document.getElementById("ConfigTable")!}
        // @ts-ignore
        columns={columns}
        dataSource={filteredData}
        rowKey={(rd) => rd.id}
        scroll={{ x: 600 }}
        loading={isLoading}
        pagination={pagination}
        onChange={onChangeTable}
      />
    </Page>
  );
}
