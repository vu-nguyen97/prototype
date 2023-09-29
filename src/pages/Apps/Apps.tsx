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

function Apps(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
  const [listApp, setListApp] = useState<any>([]);

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
