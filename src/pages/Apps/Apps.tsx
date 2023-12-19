import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import { Select } from "antd";
import AntInput from "antd/lib/input/Input";
import React, { useEffect, useState } from "react";
import TimeAgo from "react-timeago";
import { toast } from "react-toastify";
import SyncNow from "../../partials/common/SyncNow";
import service from "../../partials/services/axios.config";
import Loading from "../../utils/Loading";
import Page from "../../utils/composables/Page";
import AppTable from "./AppTable";

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
    setSyncing(true);
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
        () => {
          setSyncing(false);
          setIsLoading(false);
        }
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
              className="w-full xs:!w-[280px] !mx-1 2xl:!mx-2 !mt-3"
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

        <div className="my-3 min-h-[26px] flex items-center">
          <SyncNow
            syncTime={<TimeAgo date={lastSyncAppsAt} />}
            onClick={handleSyncApps}
            right={false}
            syncing={syncing}
            small
          />
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
