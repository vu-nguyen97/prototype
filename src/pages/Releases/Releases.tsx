import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import { Client } from "@stomp/stompjs";
import { Button } from "antd";
import AntInput from "antd/lib/input/Input";
import Modal from "antd/lib/modal";
import Select from "antd/lib/select";
import React, { useEffect, useState } from "react";
import service, { SOCKET_URL } from "../../partials/services/axios.config";
import Page from "../../utils/composables/Page";
import ModalAddRelease from "./ModalAddRelease/ModalAddRelease";
import ReleaseStatusTable from "./ReleaseStatusTable";
import AppTemplate from "./Templates/AppTemplate";

function Releases() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddRelease, setIsAddRelease] = useState(false);
  const [releaseStatus, setReleaseStatus] = useState<any>([]);
  const [templateData, setTemplateData] = useState<any>();
  const [listStores, setListStores] = useState<any>([]);

  const [filteredData, setFilteredData] = useState<any>([]);

  const [selectedStore, setSelectedStore] = useState<string>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getTemplateData = service.get("/default-app-content-settings");
    const getReleaseData = service.get("/release-status");
    const getStores = service.get("/google-play-stores");

    setIsLoading(true);
    Promise.all([getTemplateData, getReleaseData, getStores]).then(
      (res: any) => {
        setIsLoading(false);
        setTemplateData(res[0].results);
        setListStores(res[2].results);

        const newTableData = res[1].results;
        if (!newTableData?.length) return;
        const newData = newTableData.map((el: any) => ({
          ...el,
          store: res[2].results?.find(
            (store: any) => el.developerId === store.id
          ),
        }));
        setReleaseStatus(newData);
        console.log('releaseStatus :>> ', newData);
      },
      () => setIsLoading(false)
    );

    const onConnected = () => {
      client.subscribe("/topic/release-status", function (msg) {
        if (msg.body) {
          const jsonBody = JSON.parse(msg.body);
          setReleaseStatus(prevState => 
            prevState.map((el) =>
              el.id === jsonBody.id
                ? { ...el, detailStatus: jsonBody.status }
                : el
            )
          );
        }
      });
    };

    const onDisconnected = () => {};

    const client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: onConnected,
      onDisconnect: onDisconnected,
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const addNewRelease = () => {
    setIsAddRelease(true);
  };

  const showTemplateInfo = () => {
    Modal.info({
      icon: <></>,
      closable: true,
      maskClosable: true,
      width: 900,
      content: <AppTemplate templateData={templateData} />,
    });
  };

  useEffect(() => {
    setFilteredData(releaseStatus);
    if (search || selectedStore) {
      setFilteredData(
        releaseStatus.filter((data) => {
          if (selectedStore && data.developerId !== selectedStore) return false;
          if (
            search &&
            (!data.appName ||
              !data.appName.toLowerCase()?.includes(search.toLowerCase()))
          ) {
            return false;
          }
          return true;
        })
      );
    }
  }, [releaseStatus, search, selectedStore]);

  return (
    <Page>
      <div className="flex justify-between flex-col xs:flex-row">
        <div className="page-title">Releases</div>
        <div className="mt-1 sm:mt-0">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addNewRelease}
          >
            New release
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-sm shadow mt-2">
        <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
          <Select
            allowClear
            placeholder="Store name"
            value={selectedStore}
            onChange={setSelectedStore}
            className="w-full xs:!w-[280px] !mx-1 2xl:!mx-2 !mt-3"
          >
            {listStores.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
          <AntInput
            allowClear
            placeholder="Search by app name"
            className="xs:!w-[260px] mx-1 2xl:!mx-2 mt-3"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="my-4">
        <span className="font-semibold">Note:</span> All releases will utilize{" "}
        <span className="text-link" onClick={showTemplateInfo}>
          this app content template
        </span>{" "}
        for submission to the Google Play Store.
      </div>

      <ReleaseStatusTable listData={filteredData} isLoading={isLoading} />

      <ModalAddRelease
        isOpen={isAddRelease}
        listStores={listStores}
        onClose={() => setIsAddRelease(false)}
      />
    </Page>
  );
}

export default Releases;
