import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import { useQuery } from "@tanstack/react-query";
import Empty from "antd/lib/empty";
import AntInput from "antd/lib/input/Input";
import Radio from "antd/lib/radio";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getStoreApps } from "../../api/apps/apps.api";
import { LIST_STORE_APPS } from "../../api/constants.api";
import GamePlatformIcon from "../../partials/common/GamePlatformIcon";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import classNames from "classnames";
import { App } from "../../partials/interfaces/App";
import DefaultAppImg from "../../partials/common/DefaultAppImg";

const SortIds = {
  name: "0",
  nonOrganic: "1",
};
const SortData = [
  { value: SortIds.name, label: "App name" },
  { value: SortIds.nonOrganic, label: "Non-organic installs" },
];

function Apps() {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [listApp, setListApp] = useState<App[]>([]);

  const [sortType, setSortType] = useState(SortIds.name);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (state) {
      setSortType(state.sortType || SortIds.name);
      setSearch(state.search || "");
    }
    // https://stackoverflow.com/questions/40099431/how-do-i-clear-location-state-in-react-router-on-page-reload
    window.history.replaceState({}, document.title);
  }, []);

  const { data: storeAppRes, isLoading: isLoadingApp } = useQuery(
    [LIST_STORE_APPS],
    getStoreApps,
    { staleTime: 120 * 60000 }
  );

  useEffect(() => {
    setListApp(storeAppRes?.results || []);
  }, [storeAppRes]);

  const onSearchName = (e) => {
    setSearch(e.target.value);
  };

  // Không lọc app trực tiếp ở đây
  // Sử dụng ẩn hiện bằng css (biến isHidden) giúp cải thiện performance hơn (theo thực nghiệm)
  const filteredApp = listApp;
  if (filteredApp?.length) {
    filteredApp.sort((a: any, b: any) => {
      if (sortType === SortIds.name) {
        return ("" + a.name).localeCompare(b.name);
      }
      let aNonOrganic = a.installsDetail?.nonOrganicTotal;
      let bNonOrganic = b.installsDetail?.nonOrganicTotal;
      aNonOrganic = aNonOrganic === 0 ? aNonOrganic : aNonOrganic || -1;
      bNonOrganic = bNonOrganic === 0 ? bNonOrganic : bNonOrganic || -1;
      return bNonOrganic - aNonOrganic;
    });
  }

  const globalLoading = isLoading || isLoadingApp;

  return (
    <Page>
      {globalLoading && <Loading />}

      <div className="flex justify-between">
        <div className="page-title">Prototype Campaigns</div>
      </div>

      <div className="flex items-start md:items-center flex-col md:flex-row mt-2 bg-white p-4 rounded-sm shadow">
        <AntInput
          allowClear
          placeholder="App name / Package name"
          className="xs:!w-[255px]"
          prefix={<SearchOutlined />}
          value={search}
          onChange={onSearchName}
        />

        <div className="flex items-start xs:items-center flex-wrap space-x-4 mt-2 md:mt-0 md:ml-4">
          <div>Sort by</div>

          <Radio.Group
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            {SortData.map((el, idx) => (
              <Radio value={el.value} key={idx}>
                {el.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </div>

      <div className="page-section">
        Available Prototype
        {!globalLoading && filteredApp.length > 0 && (
          <span> ({filteredApp.length})</span>
        )}
      </div>

      {!globalLoading && (listApp.length === 0 || filteredApp.length === 0) && (
        <Empty />
      )}

      {filteredApp.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApp.map((app: any, idx) => {
              const appUrl = "/apps/" + app.id + "/overview";
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
                    <Link
                      to={appUrl}
                      state={{ sortType, search }}
                      className="shrink-0"
                    >
                      {app?.icon ? (
                        <GamePlatformIcon app={app} />
                      ) : (
                        <DefaultAppImg
                          classNames="w-14 h-14"
                          dot={app.active}
                        />
                      )}
                    </Link>

                    <div className="ml-5 grow truncate">
                      <Link
                        to={appUrl}
                        state={{ sortType, search }}
                        className="text-base sm:text-lg md:text-xl font-bold !text-black hover:!text-indigo-600 overflow-auto whitespace-normal line-clamp-2"
                      >
                        {app.name}
                      </Link>

                      {app.url ? (
                        <a
                          href={app.url}
                          className={packageClass}
                          title="View the game in the store"
                          target="_blank"
                        >
                          {app.storeId}
                        </a>
                      ) : (
                        <div className={packageClass}>{app.storeId}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Page>
  );
}

export default Apps;
