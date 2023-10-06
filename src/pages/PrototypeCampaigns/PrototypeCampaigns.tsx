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
import { disabledDate } from "../../utils/Helpers";
import { EXTRA_FOOTER } from "../../constants/constants";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button/button";
import moment from "moment";
import Select from "antd/lib/select";

const ListStatus = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

function Apps() {
  const [isLoading, setIsLoading] = useState(false);
  const [listApp, setListApp] = useState<any>({});

  const [search, setSearch] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [active, setActive] = useState("true");
  const [dateRange, setDateRange] = useState<any>(getLastDay(20));

  // Filters in BE
  const defaultPageSize = 20;
  const [tableFilters, setTableFilters] = useState({
    page: 0,
    size: defaultPageSize,
  });

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
      createdBy,
      active,
    };

    setIsLoading(true);
    service.get("/prototype-campaigns", { params }).then(
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

  return (
    <Page>
      {isLoading && <Loading />}

      <div className="flex justify-between">
        <div className="page-title">Prototype Campaigns</div>
      </div>

      <div className="bg-white p-4 rounded-sm shadow mt-2">
        <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
          <AntInput
            allowClear
            placeholder="Search name"
            className="xs:!w-[200px] mx-1 2xl:!mx-2 mt-3"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AntInput
            allowClear
            placeholder="Search created by"
            className="xs:!w-[200px] mx-1 2xl:!mx-2 mt-3"
            prefix={<SearchOutlined />}
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
          />
          <Select
            allowClear
            placeholder="Status"
            className="xs:!w-[110px] !mx-1 2xl:!mx-2 !mt-3"
            value={active}
            onChange={setActive}
          >
            {ListStatus.map((el: any, idx) => {
              return (
                <Select.Option value={el.value} key={idx}>
                  <div>{el.label}</div>
                </Select.Option>
              );
            })}
          </Select>
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
    </Page>
  );
}

export default Apps;
