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
import Input from "antd/lib/input/Input";
import { AiOutlineSearch } from "@react-icons/all-files/ai/AiOutlineSearch";
import AppTable from "./AppTable";
import { Select } from "antd";
function Apps(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [listApp, setListApp] = useState<any>([]);
  const [listAppRender, setListAppRender] = useState<any>([]);
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
      () => {
        setIsLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    setIsLoading(true);
    console.log(selectedValue);
    service.get("/store-app?devId=" + selectedValue).then(
      (res: any) => {
        setListApp(res.results);
        setListAppRender(res.results);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  }, [selectedValue]);

  const getApp = (value) => {
    setIsLoading(true);
    service.get("/store-app?devId=" + value).then(
      (res: any) => {
        setListApp(res.results);
        setListAppRender(res.results);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  const handleSelectChange = (value) => {
    setSelectedValue(value);
    getApp(value);
  };

  const onSearch = (value) => {
    if (value == null) {
      setListAppRender(listApp);
    } else {
      setListAppRender(
        listApp.filter((app) =>
          app.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <Page>
      {isLoading && <Loading />}

      <div>
        <div className="page-title">Apps</div>
        <div
          className="bg-white p-4 rounded-sm shadow mt-2"
          style={{ marginBottom: 20 }}
        >
          <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
            <Select
              value={selectedValue}
              onChange={handleSelectChange}
              placeholder={selectedValueName}
              className="xs:!w-[110px] !mx-1 2xl:!mx-2 !mt-3"
            >
              {listDeveloper.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
            <AntInput
              allowClear
              placeholder="Search name"
              className="xs:!w-[200px] mx-1 2xl:!mx-2 mt-3"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button
              type="primary"
              className="mx-1 2xl:!mx-2 mt-3"
              onClick={() => onSearch(search)}
            >
              Apply
            </Button>
          </div>
        </div>

        <div>
          <AppTable
            onSearch={onSearch}
            listData={listAppRender}
          />
        </div>
      </div>
    </Page>
  );
}

export default Apps;
