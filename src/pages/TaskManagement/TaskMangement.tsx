import React, {useState, useEffect} from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import { Select } from "antd";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import DatePicker from "antd/lib/date-picker";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button/button";
import TaskTable from "./TaskTable";
import service from "../../partials/services/axios.config";
import { disabledDate } from "../../utils/Helpers";
import { EXTRA_FOOTER } from "../../constants/constants";
import {
  DATE_RANGE_FORMAT,
  getLastDay,
  onClickRangePickerFooter,
} from "../../partials/common/Forms/RangePicker";
const TaskMangement = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedValue, setSelectedValue] = useState<any>("ALL");
    const [selectedState, setSelectedState] = useState<any>("ALL");
    const [selectedType, setSelectedType] = useState<any>("ALL");
    const [selectedValueName, setSelectedValueName] = useState<any>("ALL");
    const [listDeveloper, setListDeveloper] = useState<any>([]);
    const [listTask, setListTask] = useState<any>([]);
    const [isOpenDateRange, setIsOpenDateRange] = useState(false);
    const [dateRange, setDateRange] = useState<any>(getLastDay(0));
    const isAdmin = useSelector(
        (state: RootState) => state.account.userData.isAdmin
    );
    const storeId = useSelector(
        (state: RootState) => state.account.userData.storeId
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfTodayTimestamp = today.getTime();
    today.setHours(23, 59, 59, 999);
    const endOfTodayTimestamp = today.getTime();
    
    useEffect(() => {
        if(isAdmin){
          service.get("/google-play-stores").then(
            (res: any) => {
              setListDeveloper(res.results);
              setIsLoading(false);
            },
            () => {
              setIsLoading(false);
            }
          );
        }else{
          service.get("/google-play-stores/"+storeId).then(
            (res: any) => {
              setListDeveloper(res.results);
              setSelectedValue(res.results?.id);
              setSelectedValueName(res.results?.name);
              setIsLoading(false);
            },
            () => {
              setIsLoading(false);
            }
          );
        }
        
    }, []);
    const listType = [
        {
            id: 0,
            name: "ALL",
            value: 0
        },

        {
            id: 1,
            name: "SYNC_APPS",
            value: 1
        },

        {
            id: 2,
            name: "CREATE_RELEASE",
            value: 2
        },

        {
            id: 3,
            name: "CREATE_CUSTOM_LISTING",
            value: 3
        },

        {
          id: 4,
          name: "FETCH_CUSTOM_LISTING",
          value: 4
        },

        {
          id: 5,
          name: "CHECK_LOGIN_STATUS",
          value: 5
        },

        {
          id: 6,
          name: "GET_MAIN_LISTING",
          value: 6
        }

    ];
    
    const listState = [
        {
            id: 0,
            name: "ALL",
            value: 0
        },

        {
            id: 1,
            name: "CREATED",
            value: 1
        },

        {
            id: 2,
            name: "RUNNING",
            value: 2
        },

        {
            id: 3,
            name: "SUCCESS",
            value: 3
        },

        {
            id: 4,
            name: "FAILED",
            value: 4
        }
    ];

    useEffect(() => {
        setIsLoading(true);
        service.get("/tasks?type=&state=&account=&start="+startOfTodayTimestamp+"&end="+endOfTodayTimestamp).then(
          (res: any) => {
            setListTask(res.results);
            setIsLoading(false);
          },
          () => setIsLoading(false)
        );
    }, []);

    const handleSelectChange = (value) => {
        setSelectedValue(value);
    };

    const handleSelectChangeState = (value) => {
        setSelectedState(value);
    };

    const handleSelectChangeType = (value) => {
      setSelectedType(value);
    };

    const onChangeRangePicker = (dates) => {
      setDateRange(dates);
    };

    const onSearch = () => {

      const startTimestamp = dateRange[0].startOf("day").valueOf();
      const endTimestamp = dateRange[1].endOf("day").valueOf();
      console.log(startTimestamp);
      console.log(endTimestamp);
      setIsLoading(true);
      service.get("/tasks?type="+selectedType+"&state="+selectedState+"&account="+selectedValue+"&start="+startTimestamp+"&end="+endTimestamp).then(
        (res: any) => {
          setListTask(res.results);
          setIsLoading(false);
        },
        () => setIsLoading(false)
      );
    };
    
    return(
        <Page>
            {/* {isLoading && <Loading />} */}
        <div>
            <h1 style={{fontSize: 40, fontWeight: "bold"}}>Task Management</h1>
        </div>
        <div
          className="bg-white p-4 rounded-sm shadow mt-2"
          style={{ marginBottom: 20 }}
        >
          <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
            {isAdmin&&(
              <div style={{fontSize: 17, marginTop: 10, marginRight: 5}}>Account:</div>
            )}
            {isAdmin&&(
            <div>
            <Select
              value={selectedValue}
              onChange={handleSelectChange}
              placeholder={selectedValueName}
              className="xs:!w-[110px] !mx-1 2xl:!mx-2 !mt-3"
            >
              <Select.Option key = {0} value = "ALL">
                ALL
              </Select.Option>
              {listDeveloper.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
            </div>)}
            <div style={{fontSize: 17, marginTop: 10, marginRight: 5, paddingLeft: 5}}>State:</div>
            <Select
              value={selectedState}
              onChange={handleSelectChangeState}
              placeholder={selectedState}
              className="xs:!w-[110px] !mx-1 2xl:!mx-2 !mt-3"
            >
              {listState.map((item) => (
                <Select.Option key={item.id} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
            <div style={{fontSize: 17, marginTop: 10, marginRight: 5, paddingLeft: 5}}>Type:</div>
            <Select
              value={selectedType}
              onChange={handleSelectChangeType}
              placeholder={selectedType}
              className="xs:!w-[110px] !mx-1 2xl:!mx-2 !mt-3"
            >
              {listType.map((item) => (
                <Select.Option key={item.id} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
            <div style={{fontSize: 17, marginTop: 10, marginRight: 5, paddingLeft: 5}}>Time:</div>
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
              className="mx-1 2xl:!mx-2 mt-3"
              onClick={() => onSearch()}
            >
              Apply
            </Button>
          </div>
        </div>
        <div>
            <TaskTable
                isLoading={isLoading}
                listData={listTask}
            />
        </div>
        </Page>
    )
}

export default TaskMangement;
