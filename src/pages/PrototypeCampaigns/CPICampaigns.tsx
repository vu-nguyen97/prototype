import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import AntInput from "antd/lib/input/Input";
import React, { useEffect, useState } from "react";
import Page from "../../utils/composables/Page";
import service from "../../partials/services/axios.config";
import PrototypeTable from "./PrototypeTable/PrototypeTable";
import {
  DATE_RANGE_FORMAT,
  getNearest14Days,
  onClickRangePickerFooter,
} from "../../partials/common/Forms/RangePicker";
import DatePicker from "antd/lib/date-picker";
import { CAMPAIGN_STATUS, EXTRA_FOOTER } from "../../constants/constants";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button/button";
import moment from "moment";
import Select from "antd/lib/select";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import ModalAdd from "./ModalAdd";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import SelectStoreApp, {
  getActivedApp,
} from "../../partials/common/Forms/SelectStoreApp";
import { getLabelFromStr } from "../../utils/Helpers";

function Apps() {
  const [isLoading, setIsLoading] = useState(false);
  const [listApp, setListApp] = useState<any>({});
  const [listStoreApp, setListStoreApp] = useState<any>([]);
  const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState<any>();
  const [selectedApp, setSelectedApp] = useState<any>();
  // const [createdBy, setCreatedBy] = useState("");
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [active, setActive] = useState();
  const [dateRange, setDateRange] = useState<any>(getNearest14Days());
  const [listDeveloper, setListDeveloper] = useState<any>([]);
  const storeId = useSelector(
    (state: RootState) => state.account.userData.storeId
  );
  const isAdmin = useSelector(
    (state: RootState) => state.account.userData.isAdmin
  );
  // Filters in BE
  const defaultPageSize = 20;
  const [tableFilters, setTableFilters] = useState({
    page: 0,
    size: defaultPageSize,
  });

  useEffect(() => {
    service.get("/google-play-stores").then(
      (res: any) => {
        setListDeveloper(res.results);
      },
      () => {}
    );
  }, []);

  useEffect(() => {
    const getListApp = service.get("/store-app");
    Promise.all([getListApp]).then((res: any) => {
      let chooseableList = res[0].results.filter(
        (app: any) => app.unityGameId !== 0
      );
      setListStoreApp(chooseableList);
    });
  }, []);

  useEffect(() => {
    onSearchData();
  }, [tableFilters]);

  const onSearchData = () => {
    const params = {
      startDate: moment(dateRange[0])?.format(DATE_RANGE_FORMAT),
      endDate: moment(dateRange[1])?.format(DATE_RANGE_FORMAT),
      page: tableFilters.page,
      pageSize: tableFilters.size,
      name: search,
      store: selectedValue,
      app: getActivedApp(listStoreApp, selectedApp)?.id,
      createdBy: "",
      state: active,
      storeId: isAdmin ? "" : storeId,
    };

    setIsLoading(true);
    service.get("/cpi-campaigns", { params }).then(
      (res: any) => {
        setIsLoading(false);
        setListApp(res.results);
      },
      () => setIsLoading(false)
    );
  };

  const onChangeRangePicker = (values) => {
    setDateRange(values);
  };

  const updateCb = () => {
    setTimeout(() => {
      onSearchData();
    }, 500);
  };

  const onApply = () => {
    onSearchData();
  };

  const handleSelectChange = (value) => {
    setSelectedValue(value);
  };

  const handleSelectChangeApp = (value) => {
    setSelectedApp(value);
  };

  return (
    <Page>
      <div className="flex justify-between">
        <div className="page-title">CPI Campaigns</div>
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={(e) => setIsOpenModalAddApp(true)}
          >
            New campaign
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-sm shadow mt-2">
        <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
          <AntInput
            allowClear
            placeholder="Search name"
            className="xs:!w-[180px] mx-1 2xl:!mx-2 mt-3"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            allowClear
            placeholder="Store"
            value={selectedValue}
            onChange={handleSelectChange}
            className="w-full xs:w-[150px] !mx-1 2xl:!mx-2 !mt-3"
          >
            {listDeveloper.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
          <SelectStoreApp
            placeholder="App / package"
            classNames="w-full xs:w-[200px] !mx-1 2xl:!mx-2 !mt-3"
            listApp={listStoreApp}
            activedApp={selectedApp}
            setActivedApp={handleSelectChangeApp}
          />
          <Select
            allowClear
            placeholder="Status"
            className="w-full xs:!w-[110px] !mx-1 2xl:!mx-2 !mt-3"
            value={active}
            onChange={setActive}
          >
            {Object.values(CAMPAIGN_STATUS).map((el: any, idx) => {
              return (
                <Select.Option value={el} key={idx}>
                  <div>{getLabelFromStr(el)}</div>
                </Select.Option>
              );
            })}
          </Select>

          <DatePicker.RangePicker
            className="w-full xs:w-auto !mx-1 2xl:!mx-2 !mt-3"
            open={isOpenDateRange}
            onOpenChange={(open) => setIsOpenDateRange(open)}
            value={dateRange}
            onChange={onChangeRangePicker}
            renderExtraFooter={() => (
              <div className="flex py-2.5">
                {EXTRA_FOOTER.map((obj, idx) => (
                  <Tag
                    key={idx}
                    color="blue"
                    className="cursor-pointer"
                    onClick={() =>
                      onClickRangePickerFooter(obj.value, setDateRange, () =>
                        setIsOpenDateRange(false)
                      )
                    }
                  >
                    {obj.label}
                  </Tag>
                ))}
              </div>
            )}
          />

          <Button
            type="primary"
            onClick={onApply}
            className="mx-1 2xl:!mx-2 mt-3"
          >
            Apply
          </Button>
        </div>
      </div>

      <PrototypeTable
        isLoading={isLoading}
        data={listApp}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        updateCb={updateCb}
      />
      <ModalAdd
        isOpen={isOpenModalAddApp}
        onClose={() => setIsOpenModalAddApp(false)}
        submitCb={(newCamp) => updateCb()}
        // submitCb={(newCamp) => onSearchData()}
      />
    </Page>
  );
}

export default Apps;
