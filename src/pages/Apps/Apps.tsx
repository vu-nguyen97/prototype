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
import AppTable from "./AppTable";
function Apps(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
  const [listApp, setListApp] = useState<any>([]);  
 
  useEffect(() => {
    setIsLoading(true);
    service.get("/store-app").then(
      (res: any) => {
        console.log("List App",res.results);
        setListApp(res.results);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  }, []);


const onSearch = (devId) => {
  setListApp(listApp.filter((app) => app.consoleAppId.includes(devId)))
}

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

      <div >
        <div className="page-title">Apps</div>

        <div>
          <AppTable
            isLoading = {isLoading}
            onSearch={onSearch}
            listData={listApp}
        />
        </div>
        
      </div>

      <ModalAdd
        isOpen={isOpenModalAddApp}
        onClose={() => setIsOpenModalAddApp(false)}
        setIsLoading={setIsLoading}
        setListApp={setListApp}
      />
    </Page>
  );
}

export default Apps;
