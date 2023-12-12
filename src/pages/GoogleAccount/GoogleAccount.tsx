import React, { useState, useEffect } from "react";
import Page from "../../utils/composables/Page";
import GoogleAccountTable from "./GoogleAccountTable";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import ModalAddGPStore from "./ModalAddGPStore";
import Button from "antd/lib/button";
import ModalEditGPStore from "./ModalEditGPStore";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import Loading from "../../utils/Loading";

const GoogleAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [listGPStore, setListGPStore] = useState<any>([]);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [editedStore, setEditedStore] = useState<any>({});

  useEffect(() => {
    setIsLoading(true);
    service.get("/google-play-stores").then(
      (res: any) => {
        setListGPStore(res.results);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  }, []);

  const onEditData = (record) => {
    setEditedStore(record);
    setIsOpenModalEdit(true);
  };

  const onDelete = (record) => {
    setLoadingPage(true);
    service.delete("/google-play-stores/" + record.id).then(
      (res: any) => {
        toast(res.message || "Delete developer account successfully!", {
          type: "success",
        });
        setLoadingPage(false);
        setListGPStore(listGPStore.filter((el) => el.id !== record.id));
      },
      () => setLoadingPage(false)
    );
  };

  const onSyncApp = (record) => {
    console.log(record);
    setIsLoading(true);
    service.post(`/google-play-stores/`+record.id+`/sync-apps`).then(
      (res: any) => {
        toast(
          res.message ||
            "Apps will be synced in the background. You will be notified when it's done!",
          { type: "success" }
        );
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  };

  return (
    <Page>
      {loadingPage && <Loading />}
      <div className="flex justify-between">
        <div className="page-title">Developer accounts</div>

        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={(e) => setIsOpenModalAdd(true)}
          >
            New
          </Button>
        </div>
      </div>
      <div className="mt-2">
        <GoogleAccountTable
          isLoading={isLoading}
          onEdit={onEditData}
          onDelete={onDelete}
          onSyncApp={onSyncApp}
          listData={listGPStore}
        />
      </div>

      <ModalAddGPStore
        isOpen={isOpenModalAdd}
        onClose={() => setIsOpenModalAdd(false)}
        setIsLoading={setLoadingPage}
        setListGPStore={setListGPStore}
      />
      <ModalEditGPStore
        isOpen={isOpenModalEdit}
        onClose={() => {
          setIsOpenModalEdit(false);
          setEditedStore({});
        }}
        setIsLoading={setLoadingPage}
        data={editedStore}
        setListGPStore={setListGPStore}
      />
    </Page>
  );
};

export default GoogleAccount;
