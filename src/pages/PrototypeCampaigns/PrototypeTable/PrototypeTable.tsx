import React, { useEffect, useState } from "react";
import Table from "antd/lib/table/Table";
import getColumns from "./TableColumns";
import ModalEdit from "./ModalEdit";
import Loading from "../../../utils/Loading";
import service from "../../../partials/services/axios.config";
import { toast } from "react-toastify";

function PrototypeTable(props) {
  const { data, isLoading, tableFilters, setTableFilters, updateCb } = props;
  const [columns, setColumns] = useState(getColumns({}));

  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [editedRd, setEditedRd] = useState<any>({});

  useEffect(() => {
    setColumns(getColumns({ data, onEdit, onDelete, onChangeStatus }));
  }, [data]);

  const onChangeTable = (pagination) => {
    const { pageSize, current } = pagination;

    if (pageSize !== tableFilters.size || current - 1 !== tableFilters.page) {
      setTableFilters({ size: pageSize, page: current - 1 });
    }
  };

  const onEdit = (rd) => {
    setEditedRd(rd);
  };

  const onChangeStatus = (rd, isRunAction) => {
    const text = isRunAction ? "run" : "stop";
    setIsLoadingPage(true);
    service.put(`/cpi-campaigns/${text}/${rd.id}`).then(
      (res: any) => {
        setIsLoadingPage(false);
        toast(res.message, { type: "success" });
        updateCb();
      },
      () => setIsLoadingPage(false)
    );
  };

  const onDelete = (rd) => {
    setIsLoadingPage(true);
    service.delete(`/cpi-campaigns/${rd.id}`).then(
      (res: any) => {
        setIsLoadingPage(false);
        toast(res.message, { type: "success" });
        updateCb();
      },
      () => setIsLoadingPage(false)
    );
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
      {isLoadingPage && <Loading />}
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

      <ModalEdit
        isOpen={!!editedRd?.id}
        onClose={() => setEditedRd({})}
        data={editedRd}
        updateCb={updateCb}
        setIsLoading={setIsLoadingPage}
      />
    </div>
  );
}

export default PrototypeTable;
