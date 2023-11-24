import React, { useState, useEffect } from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import GoogleAccountTable from "./GoogleAccountTable";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import ModalAddGPStore from "./ModalAddGPStore";
import Button from "antd/lib/button";
import ModalEditGPStore from "./ModalEditGPStore";
import ModalConfirmDeleteGPStore from "./ModalConfirmDeleteGPStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

const GoogleAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listGPStore, setListGPStore] = useState<any>([]);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [editedStore, setEditedStore] = useState<any>({});
  const [deleteStore, setDeleteStore] = useState<any>({});
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] =
    useState(false);
  const navigate = useNavigate();
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
    console.log(record);
    setEditedStore(record);
    setIsOpenModalEdit(true);
  };

  const onDelete = (record) => {
    setDeleteStore(record);
    setIsOpenModalConfirmDelete(true);
  };

  const onSyncApp = (record) => {
    setIsLoading(true);
    service.post("/play-store/sync-apps",{storeId: record.id}).then(
      (res: any) => {
        toast(res.message || "Apps will be synced in the background. You will be notified when it's done!", { type: "success" });
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  };

  return (
    <Page>
      {isLoading && <Loading />}
      <div>
        <div>
          <div className="flex justify-between">
            <div className="page-title">Developer Accounts</div>

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
        </div>
        <div className="mt-2">
          <GoogleAccountTable
            onEdit={onEditData}
            onDelete={onDelete}
            onSyncApp={onSyncApp}
            listData={listGPStore}
            
          />
        </div>
      </div>

      <ModalAddGPStore
        isOpen={isOpenModalAdd}
        onClose={() => setIsOpenModalAdd(false)}
        setIsLoading={setIsLoading}
      />

      <ModalEditGPStore
        isOpen={isOpenModalEdit}
        onClose={() => setIsOpenModalEdit(false)}
        setIsLoading={setIsLoading}
        data={editedStore}
      />
      <ModalConfirmDeleteGPStore
        isOpen={isOpenModalConfirmDelete}
        onClose={() => setIsOpenModalConfirmDelete(false)}
        setIsLoading={setIsLoading}
        data={deleteStore}
      />
    </Page>
  );
};

export default GoogleAccount;
