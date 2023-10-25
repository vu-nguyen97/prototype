import React, { useEffect, useState } from "react";
import Table from "antd/lib/table/Table";
import getColumns from "./TableColumns";

function PrototypeTable(props) {
  const { data, isLoading, tableFilters, setTableFilters } = props;
  const [columns, setColumns] = useState(getColumns({}));

  useEffect(() => {
    setColumns(getColumns({ data }));
  }, [data]);

  const onChangeTable = (pagination) => {
    const { pageSize, current } = pagination;

    if (pageSize !== tableFilters.size || current - 1 !== tableFilters.page) {
      setTableFilters({ size: pageSize, page: current - 1 });
    }
  };

  const pagination = {
    pageSize: tableFilters.size,
    current: tableFilters.page + 1,
    total: data?.totalElements,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };
  const id = "PrototypeTable";

  return (
      <div>
    <Table
      id={id}
      className="mt-6"
      getPopupContainer={() => document.getElementById(id)!}
      rowKey={(record) => record.id}
      loading={isLoading}
      // @ts-ignore
      columns={columns}
      dataSource={data?.content || []}
      scroll={{ x: 1550 }}
      pagination={pagination}
      onChange={onChangeTable}
    />
      </div>
  );
}

export default PrototypeTable;
