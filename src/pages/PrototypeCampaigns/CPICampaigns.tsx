import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import AntInput from "antd/lib/input/Input";
import React, { useEffect, useState } from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import service from "../../partials/services/axios.config";
import PrototypeTable from "./PrototypeTable/PrototypeTable";
import {
  DATE_RANGE_FORMAT,
  getLastDay,
  onClickRangePickerFooter,
} from "../../partials/common/Forms/RangePicker";
import DatePicker from "antd/lib/date-picker";
import { disabledDate, filterSelectByDOM, filterSelectGroupByKey } from "../../utils/Helpers";
import { EXTRA_FOOTER } from "../../constants/constants";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button/button";
import moment from "moment";
import Select from "antd/lib/select";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import ModalAdd from './ModalAdd';
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import SelectStoreApp, {getActivedApp} from "../../partials/common/Forms/SelectStoreApp";
import GamePlatformIcon from "../../partials/common/GamePlatformIcon";
import { option } from "yargs";
const { Option, OptGroup } = Select;

const ListStatus = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

function Apps() {
  const [isLoading, setIsLoading] = useState(false);
  const [listApp, setListApp] = useState<any>({});
  const [listStoreApp, setListStoreApp] = useState<any>([]);
  const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState<any>("ALL"); 
  const [selectedApp, setSelectedApp] = useState<any>("ALL"); 
  const [createdBy, setCreatedBy] = useState("");
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [active, setActive] = useState("ALL");
  const [dateRange, setDateRange] = useState<any>(getLastDay(7));
  const [listDeveloper, setListDeveloper] = useState<any>([]);
  const [activedApp, setActivedApp] = useState<object[]>();
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
        () => {
        }
      );
  }, []);

  useEffect(() => {  
    const getListApp = service.get("/store-app");
    Promise.all([ getListApp]).then(
      (res: any) => {
        let chooseableList = res[0].results.filter(
          (app: any) => app.unityGameId !== null
        )
        console.log("chooseableList",chooseableList);
        setListStoreApp(chooseableList);
      },
    );
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
      store: (selectedValue=="ALL"?null:selectedValue),
      app: (selectedApp=="ALL"?null:selectedApp),
      createdBy,
      active: (active=="ALL"?null:active),
      storeId: isAdmin?"":storeId,
    };

    console.log("param:",params)
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
      {isLoading && <Loading />}

      <div className="flex justify-between">
        <div className="page-title">CPI Campaigns</div>
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={(e) => setIsOpenModalAddApp(true)}
          >
            New CPI Campaign
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
          <div className="flex items-center !mt-3 !mx-1 2xl:!mx-2">
            Store:
          <Select
            allowClear
            value={selectedValue}
            onChange={handleSelectChange}
            className="xs:!w-[170px] !ml-2 2xl:!ml-3"
          >
            <Select.Option key={0} value="ALL">
                  All
                </Select.Option>
                {listDeveloper.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
          </Select>
          </div>
          <div className="flex items-center !mt-3 !mx-1 2xl:!mx-2">
            App:
            <div style={{marginLeft: 10, width:400}}>
            <Select
              showSearch
              style={{ width: 400 }}
              value={selectedApp}
              onChange={handleSelectChangeApp}
              placeholder="Select a name"
              // optionFilterProp="children"
              filterOption={filterSelectByDOM}
              // filterOption={(input, option: any) => {console.log(">>>>", input, option);return true}}
            >
               <OptGroup label="All">
              <Select.Option key={0} value="ALL">
                  All
                </Select.Option>
               </OptGroup>

               <OptGroup label="Apps">

              {listStoreApp.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  <div className="flex items-center">
                      {item.icon && <GamePlatformIcon app={item} inputSize={true} />}
                      {item.name}
                  </div>  
                </Select.Option>
              ))}
               </OptGroup>

            </Select>
            </div>
            
          </div>
          <div className="flex items-center !mt-3 !mx-1 2xl:!mx-2">
            Status:
          <Select
            allowClear
            placeholder="Status"
            className="xs:!w-[110px] !ml-2 2xl:!ml-3"
            value={active}
            onChange={setActive}
          >
            <Select.Option key={10} value="ALL">
                  All
                </Select.Option>
            {ListStatus.map((el: any, idx) => {
              return (
                <Select.Option value={el.value} key={idx}>
                  <div>{el.label}</div>
                </Select.Option>
              );
            })}
          </Select>
          </div>
          <DatePicker.RangePicker
            className="w-full xs:w-auto mx-1 2xl:!mx-2 !mt-3"
            open={isOpenDateRange}
            onOpenChange={(open) => setIsOpenDateRange(open)}
            value={dateRange}
            onChange={onChangeRangePicker}
            disabledDate={disabledDate}
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
        data={listApp}
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
      />
      <ModalAdd
        isOpen={isOpenModalAddApp}
        onClose={() => setIsOpenModalAddApp(false)}
        setIsLoading={setIsLoading}
        listStoreApps={listStoreApp}
      />
    </Page>
  );
}

export default Apps;
