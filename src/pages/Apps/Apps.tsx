import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import { Select } from "antd";
import Button from "antd/lib/button/button";
import AntInput from "antd/lib/input/Input";
import React, { useEffect, useState } from "react";
import TimeAgo from "react-timeago";
import { toast } from "react-toastify";
import service from "../../partials/services/axios.config";
import Page from "../../utils/composables/Page";
import AppTable from "./AppTable";
import Loading from "../../utils/Loading";
import { Client } from "@stomp/stompjs";


// @ts-ignore
const SOCKET_URL = `${import.meta.env.VITE_WS_HOST}/ws-falcon-bss-prtt`;


function Apps(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  const [search, setSearch] = useState("");
  const [listApp, setListApp] = useState<any>([]);
  const [listAppRender, setListAppRender] = useState<any>([]);
  const [listDeveloper, setListDeveloper] = useState<any>([]);

  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>();
  const [lastSyncAppsAt, setLastSyncAppsAt] = useState<number>();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const onConnected = () => {
      setIsLoading(true);
      client.subscribe(`/topic/selenium-clients`, function (msg) {
        if (msg.body) {
          const jsonBody = JSON.parse(msg.body);
          if (!jsonBody) return;
          console.log('/topic/selenium-clients', jsonBody);
          if(jsonBody.id === selectedDeveloperId && jsonBody.type && jsonBody.type === SYNC_APPS){            
            setSyncing(true);
          }else{
            setSyncing(false);
          }
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

  useEffect(() => {
    setIsLoading(true);
    service.get("/google-play-stores").then(
      (res: any) => initData(res.results),
      () => setIsLoading(false)
    );
  }, []);

  const initData = (listData) => {
    if (!listData?.length) {
      setIsLoading(false);
      return setLastSyncAppsAt(0);
    }

    setListDeveloper(listData);
    setSelectedDeveloperId(listData[0].id);
    setLastSyncAppsAt(Number(listData[0].lastSyncAppsAt));
    // setSyncing(listData[0].is)

    return getApp(listData[0].id);
  };

  const getApp = (value) => {
    setIsLoading(true);
    service.get("/store-app/devId?devId=" + value).then(
      (res: any) => {
        setListApp(res.results || []);
        setListAppRender(res.results || []);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  };

  const handleSelectChange = (value) => {
    setSelectedDeveloperId(value);
    getApp(value);
  };

  const handleSearch = (value, list = listApp) => {
    if (value === null || value === "") {
      setListAppRender(list);
    } else {
      setListAppRender(
        list.filter((app) =>
          app.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleSyncApps = () => {
    setIsLoading(true);
    service
      .post(`/google-play-stores/` + selectedDeveloperId + `/sync-apps`)
      .then(
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

  const linkUnityCb = (res) => {
    if (!res?.storeId) return;

    const newListApp = listApp.map((el: any) => {
      if (el.packageId === res.storeId) {
        return { ...el, unityAppId: res.id, unityGameId: res.gameId };
      }
      return el;
    });
    setListApp(newListApp);
    handleSearch(search, newListApp);
  };

  return (
    <Page>
      {loadingPage && <Loading />}
      <div>
        <div className="page-title">Apps</div>
        <div className="bg-white p-4 rounded-sm shadow mt-2">
          <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
            <Select
              placeholder="Store name"
              value={selectedDeveloperId}
              onChange={handleSelectChange}
              className="w-full xs:!w-[280px] !mx-1 2xl:!mx-2 !mt-3 w"
            >
              {listDeveloper.map((item) => (
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
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex justify-start items-center my-3 min-h-[24px]">
          <span className="flex mr-2">
            <div className="font-semibold mr-1">Last sync:</div>
            <TimeAgo date={lastSyncAppsAt} />
          </span>
          <Button
            type="primary"
            onClick={() => handleSyncApps()}
            size="small"
            className="!text-xs2"
            disabled={syncing}
          >
            Sync now
          </Button>
        </div>
        <AppTable
          listData={listAppRender}
          isLoading={isLoading}
          setLoadingPage={setLoadingPage}
          linkUnityCb={linkUnityCb}
        />
      </div>
    </Page>
  );
}

export default Apps;
