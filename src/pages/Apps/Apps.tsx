import React, { useEffect, useState } from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import Button from "antd/lib/button/button";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import AntInput from "antd/lib/input/Input";
import service from "../../partials/services/axios.config";
import AppTable from "./AppTable";
import { Select } from "antd";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
// import TimeAgoComponent from "../../utils/time/TimeAgoComponent";
import { toast } from "react-toastify";
// import ReactTimeAgo from 'react-time-ago';
import TimeAgoComponent from "../../utils/time/TimeAgoComponent";

function Apps(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [listApp, setListApp] = useState<any>([]);
  const [listAppRender, setListAppRender] = useState<any>([]);
  const [listDeveloper, setListDeveloper] = useState<any>([]);

  const [selectedDeveloper, setSelectedDeveloper] = useState<any>([]);

  const [selectedDeveloperId, setSelectedDeveloperId] = useState<any>([]);
  const [selectedValueName, setSelectedValueName] = useState<any>([]);

  const [lastSyncAppsAt, setLastSyncAppsAt] = useState<number>(0);

  const storeId = useSelector(
    (state: RootState) => state.account.userData.storeId
  );
  const isAdmin = useSelector(
    (state: RootState) => state.account.userData.isAdmin
  );

  useEffect(() => {
    if (isAdmin) {
      service.get("/google-play-stores").then(
        (res: any) => {
          setListDeveloper(res.results);
          setSelectedDeveloper(res.results[0]);
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        }
      );
    } else {
      service.get("/google-play-stores/" + storeId).then(
        (res: any) => {
          setListDeveloper(res.results);
          setSelectedDeveloperId(res.results?.id);
          setSelectedValueName(res.results?.name);
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!selectedDeveloper) {
      return;
    }
    setSelectedDeveloperId(selectedDeveloper.id);
    setSelectedValueName(selectedDeveloper.name);
    setLastSyncAppsAt(Number(selectedDeveloper.lastSyncAppsAt));
  }, [selectedDeveloper]);

  useEffect(() => {
    setIsLoading(true);
    service.get("/store-app/devId?devId=" + selectedDeveloperId).then(
      (res: any) => {
        setListApp(res.results);
        setListAppRender(res.results);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  }, [selectedDeveloperId]);

  const getApp = (value) => {
    setIsLoading(true);
    service.get("/store-app/devId?devId=" + value).then(
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
    setSelectedDeveloperId(value);
    getApp(value);
  };

  const handleSearch = (e) => {
    if (search === null) {
      setListAppRender(listApp);
    } else {
      setListAppRender(
        listApp.filter((app) =>
          app.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  // const onSyncApp = (record) => {
  //   setIsLoading(true);
  //   service.post(`/google-play-stores/sync-apps`,{storeId: record.id}).then(
  //     (res: any) => {
  //       toast(res.message || "Apps will be synced in the background. You will be notified when it's done!", { type: "success" });
  //       setIsLoading(false);
  //     },
  //     () => setIsLoading(false)
  //   );
  // };

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

  return (
    <Page>
      {isLoading && <Loading />}

      <div>
        <div className="page-title">Apps</div>
        <div className="bg-white p-4 rounded-sm shadow mt-2">
          <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 ">
            <Select
              value={selectedDeveloperId}
              onChange={handleSelectChange}
              placeholder={selectedValueName}
              className="xs:!w-[300px] !mx-1 2xl:!mx-2 !mt-3 w"
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
              className="xs:!w-[300px] mx-1 2xl:!mx-2 mt-3"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={handleSearch}
            />
            <div className="xs:!w-[300px] mx-1 2xl:!mx-2 mt-3 ml-50">
              <span className="flex">
                <div className="font-semibold ml-10">Last sync at: </div>
                <TimeAgoComponent createDate={lastSyncAppsAt ? lastSyncAppsAt : 0}
                />
              </span>
            </div>
            <Button
              type="primary"
              className="mx-1 2xl:!mx-2 mt-3"
              onClick={() => handleSyncApps()}
            >
              Sync now
            </Button>
          </div>
        </div>
        <div>
          <AppTable listData={listAppRender} />
        </div>
      </div>
    </Page>
  );
}

export default Apps;
