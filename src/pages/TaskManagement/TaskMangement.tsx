import React, { useState, useEffect } from "react";
import Page from "../../utils/composables/Page";
import { Select } from "antd";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import DatePicker from "antd/lib/date-picker";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button/button";
import TaskTable from "./TaskTable";
import service from "../../partials/services/axios.config";
import { getLabelFromStr } from "../../utils/Helpers";
import { EXTRA_FOOTER } from "../../constants/constants";
import {
  getLastDay,
  onClickRangePickerFooter,
} from "../../partials/common/Forms/RangePicker";

const TaskMangement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState<any>();
  const [selectedState, setSelectedState] = useState<any>();
  const [selectedType, setSelectedType] = useState<any>();

  const [listDeveloper, setListDeveloper] = useState<any>([]);
  const [listTask, setListTask] = useState<any>([]);
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [dateRange, setDateRange] = useState<any>(getLastDay(0));

  const isAdmin = useSelector(
    (state: RootState) => state.account.userData.isAdmin
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfTodayTimestamp = today.getTime();
  today.setHours(23, 59, 59, 999);
  const endOfTodayTimestamp = today.getTime();

  useEffect(() => {
    service.get("/google-play-stores").then(
      (res: any) => {
        setListDeveloper(res.results);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  }, []);

  const listType = [
    {
      id: 1,
      name: "SYNC_APPS",
      value: 1,
    },
    {
      id: 2,
      name: "CREATE_RELEASE",
      value: 2,
    },
    {
      id: 3,
      name: "CREATE_CUSTOM_LISTING",
      value: 3,
    },
    {
      id: 4,
      name: "FETCH_CUSTOM_LISTING",
      value: 4,
    },
    {
      id: 5,
      name: "CHECK_LOGIN_STATUS",
      value: 5,
    },
    {
      id: 6,
      name: "GET_MAIN_LISTING",
      value: 6,
    },
  ];

  const listState = [
    {
      id: 1,
      name: "CREATED",
      value: 1,
    },
    {
      id: 2,
      name: "RUNNING",
      value: 2,
    },
    {
      id: 3,
      name: "SUCCESS",
      value: 3,
    },
    {
      id: 4,
      name: "FAILED",
      value: 4,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    service
      .get(
        "/tasks?type=&state=&account=&start=" +
          startOfTodayTimestamp +
          "&end=" +
          endOfTodayTimestamp
      )
      .then(
        (res: any) => {
          setListTask(res.results);
          setIsLoading(false);
        },
        () => setIsLoading(false)
      );
  }, []);

  const onSearch = () => {
    const startTimestamp = dateRange[0].startOf("day").valueOf();
    const endTimestamp = dateRange[1].endOf("day").valueOf();
    setIsLoading(true);
    service
      .get(
        "/tasks?type=" +
          selectedType +
          "&state=" +
          selectedState +
          "&account=" +
          selectedValue +
          "&start=" +
          startTimestamp +
          "&end=" +
          endTimestamp
      )
      .then(
        (res: any) => {
          setListTask(res.results);
          setIsLoading(false);
        },
        () => setIsLoading(false)
      );
  };

  return (
    <Page>
      <div className="page-title">Task management</div>
      <div className="bg-white p-4 rounded-sm shadow mt-2 mb-5">
        <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
          {isAdmin && (
            <Select
              allowClear
              placeholder="Account"
              value={selectedValue}
              onChange={setSelectedValue}
              className="w-full xs:!w-[220px] !mx-1 2xl:!mx-2 !mt-3"
            >
              {listDeveloper.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          )}
          <Select
            allowClear
            value={selectedType}
            onChange={setSelectedType}
            placeholder="Type"
            className="w-full xs:!w-[160px] !mx-1 2xl:!mx-2 !mt-3"
          >
            {listType.map((item) => (
              <Select.Option key={item.id} value={item.name}>
                {getLabelFromStr(item.name)}
              </Select.Option>
            ))}
          </Select>
          <Select
            allowClear
            value={selectedState}
            onChange={setSelectedState}
            placeholder="Status"
            className="w-full xs:!w-[100px] !mx-1 2xl:!mx-2 !mt-3"
          >
            {listState.map((item) => (
              <Select.Option key={item.id} value={item.name}>
                {getLabelFromStr(item.name)}
              </Select.Option>
            ))}
          </Select>

          <DatePicker.RangePicker
            className="w-auto !mx-1 2xl:!mx-2 !mt-3"
            open={isOpenDateRange}
            onOpenChange={(open) => setIsOpenDateRange(open)}
            value={dateRange}
            onChange={setDateRange}
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
            className="mx-1 2xl:!mx-2 mt-3"
            onClick={() => onSearch()}
          >
            Apply
          </Button>
        </div>
      </div>
      <div>
        <TaskTable isLoading={isLoading} listData={listTask} />
      </div>
    </Page>
  );
};

export default TaskMangement;
