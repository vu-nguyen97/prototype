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
import { Select } from "antd";
function Apps(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [listApp, setListApp] = useState<any>([]);
  const [listDeveloper, setListDeveloper] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState<any>([]);
  const [selectedValueName, setSelectedValueName] = useState<any>([]);

  useEffect(() => {
    service.get("/google-play-stores").then(
      (res: any) => {
        setListDeveloper(res.results);
        setSelectedValue(res.results[0]?.id);
        setSelectedValueName(res.results[0]?.name);
        setIsLoading(false);
      },
      () => { setIsLoading(false) }
    );
  }, []);

  useEffect(() => {
    setIsLoading(true);
    console.log(selectedValue);
    service.get("/store-app/"+selectedValue).then(
      (res: any) => {
        setListApp(res.results);
        setIsLoading(false)
      },
      () => { setIsLoading(false) }
    );
  }, [selectedValue]);

  const getApp = (value) => {
    setIsLoading(true);
    service.get("/store-app/"+value).then(
      (res: any) => {
        setListApp(res.results);
        setIsLoading(false)
      },
      () => { setIsLoading(false) }
    );
  }

  const handleSelectChange = (value) => {
    setSelectedValue(value);
    getApp(value);
  };

  const onSearch = (devId) => {
    setListApp(listApp.filter((app) => app.consoleAppId.includes(devId)))
  };

  return (
    <Page>
      {isLoading && <Loading />}

      <div >
        <div className="page-title">Apps</div>
        <div className="flex space-x-2 ml-2">
          <div style={{ fontSize: 20, fontWeight: "bold" }}>Choose Account</div>
          <Select value={selectedValue} onChange={handleSelectChange} placeholder={selectedValueName}>
            {listDeveloper.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <AppTable
            isLoading={isLoading}
            onSearch={onSearch}
            listData={listApp}
          />
        </div>

      </div>
    </Page>
  );
}

export default Apps;
