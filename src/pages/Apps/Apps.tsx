import React, { useEffect, useState } from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import Button from "antd/lib/button/button";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import AntInput from "antd/lib/input/Input";
import { ModalAdd } from "./ModalAdd";
import Empty from "antd/lib/empty";
import service from "../../partials/services/axios.config";
import classNames from "classnames";
import StoreAppIcon from "../../partials/common/StoreAppIcon";
import { Link } from "react-router-dom";
import Icon from "antd/es/icon";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { addStoreApp } from "../../utils/helper/ReactQueryHelpers";
import { toast } from "react-toastify";
import Tooltip from "antd/lib/tooltip";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import { AiOutlineUpload } from "@react-icons/all-files/ai/AiOutlineUpload";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import ModalConfirmDelete from "../../partials/common/ModalConfirmDelete";
function Apps(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
  const [listApp, setListApp] = useState<any>([]);
  const [isOpenConfirmDeleteModal, setIsOpenConfirmDeleteModal] =
    useState(false);
  const [deletedAppName, setDeletedAppName] = useState<any>();
  const [deletedAppId, setDeletedAppId] = useState<any>({});
  useEffect(() => {
    setIsLoading(true);
    service.get("/store-app").then(
      (res: any) => {
        setListApp(res.results);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  }, []);

  const onDelete = (appName, appId) => {
    setIsOpenConfirmDeleteModal(true);
    setDeletedAppName(appName);
    setDeletedAppId(appId);
  };
  const onSubmitDelete = (appId) => {
    setIsOpenConfirmDeleteModal(true);
    setIsLoading(true);
    service.delete("/store-app/delete", { params: { appId } }).then(
      (res: any) => {
        const newApps = listApp.filter((item) => item.id !== res.results?.id);
        setListApp(newApps);
        setIsOpenModalAddApp(false);
        toast(res.message, { type: "success" });
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  };

  const createUnityApp = (app) => {
    setIsLoading(true);
    service.post("/create-unity-app", { store: app.store, storeId: app.storeId, adomain: app.adomain })
    .then((res: any) => {
        toast(res.message, { type: "success" });
        app.unityAppId = res.results.id;
        app.unityGameId = res.results.gameId;
        setIsLoading(false);
    })
    .catch((error) => {
        // Here you can handle your error
        setIsLoading(false);
    });
}
  // Không lọc app trực tiếp ở đây
  // Sử dụng ẩn hiện bằng css (biến isHidden) giúp cải thiện performance hơn (theo thực nghiệm)
  const filteredApp = listApp;

  return (
    <Page>
      {isLoading && <Loading />}

      <div className="flex justify-between">
        <div className="page-title">Apps</div>

        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={(e) => setIsOpenModalAddApp(true)}
          >
            New App
          </Button>
        </div>
      </div>

      <div className="flex items-start md:items-center flex-col md:flex-row mt-2 bg-white p-4 rounded-sm shadow">
        <AntInput
          allowClear
          placeholder="App name / Package name"
          className="xs:!w-[255px]"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="page-section">
        Available Apps
        {!isLoading && filteredApp.length > 0 && (
          <span> ({filteredApp.length})</span>
        )}
      </div>

      {!isLoading && (listApp.length === 0 || filteredApp.length === 0) && (
        <Empty />
      )}

      {filteredApp.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApp.map((app: any, idx) => {
              const packageClass = "!text-slate-400 truncate";

              const name = app.name?.toLowerCase() || "";
              const storeId = app.storeId?.toLowerCase() || "";
              const searchText = search.toLowerCase();
              let isHidden = false;
              if (!name.includes(searchText) && !storeId.includes(searchText)) {
                isHidden = true;
              }

              return (
                <div
                  // Dùng id của app thay vì idx sẽ giúp tối ưu số lần render
                  key={app.id}
                  className={classNames(
                    isHidden
                      ? "hidden"
                      : "flex items-center bg-white p-5 rounded-sm"
                  )}
                >
                  <div className="flex items-center grow truncate">
                    <div className="shrink-0">
                      <StoreAppIcon app={app} />
                    </div>

                    <div className="ml-5 grow truncate">
                      <div className="text-base sm:text-lg md:text-xl font-bold !text-black overflow-auto whitespace-normal line-clamp-2">
                        {app.name}
                      </div>
                      <div>{app.storeId}</div>
                      <button
                        onClick={() =>
                          (window.location.href = "/apps/" + app.id + "/main-store-listing")
                        }
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        App Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <ModalAdd
        isOpen={isOpenModalAddApp}
        onClose={() => setIsOpenModalAddApp(false)}
        setIsLoading={setIsLoading}
        setListApp={setListApp}
      />
      <ModalConfirmDelete
        isOpen={isOpenConfirmDeleteModal}
        onClose={() => setIsOpenConfirmDeleteModal(false)}
        onSubmit={() => onSubmitDelete(deletedAppId)}
        targetName={deletedAppName}
      />
    </Page>
  );
}

export default Apps;
