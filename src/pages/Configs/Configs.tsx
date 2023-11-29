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
import Button from "antd/lib/button/button";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import ModalAddAndEdit from "./Modal/ModalAddAndEdit";
import ModalEdit from "./Modal/ModalEdit";

export default function Configs() {
  const [configs, setConfigs] = useState([]);
  const defaultPageSize = 10;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [columns, setColumns] = useState(getColumns({}));
  const [isLoading, setIsLoading] = useState(false);
  const [record, setRecord] = useState([])
  const [searchData, setSearchData] = useState<any>({});
  const [filterByMaxMin, setFilterByMaxMin] = useState<any>({});
  const [isOpenModalEdit, setIsOpenModalEdit] = useState<any>(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

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
        onOpenModalEdit
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

  const onOpenModalEdit = (value) => {
    setRecord(value);
    setIsOpenModalEdit(true);
  }

  const onSubmitConfig = () => {};

  const onEditConfig = (value) => {
    console.log(value)
    // setIsLoading(true);
    // service.put("/config/"+record.id,value).then(
    //   (res: any) => {
    //     setConfigs(res.results);
    //     setIsLoading(false);
    //   },
    //   () => setIsLoading(false)
    // );
  }

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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={(e) => setIsOpenAddModal(true)}
        >
          Add Config
        </Button>
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

      <ModalAddAndEdit
        isOpen={isOpenAddModal}
        onClose={() => setIsOpenAddModal(false)}
        setIsLoading={setIsLoading}
        onSubmit={onSubmitConfig}
      />

      <ModalEdit
        isOpen={isOpenModalEdit}
        onClose={() => setIsOpenModalEdit(false)}
        setIsLoading={setIsLoading}
        onFinish={onEditConfig}
        data={record}
      />

    </Page>
  );
}
