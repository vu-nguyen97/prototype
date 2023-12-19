import React, { useEffect, useState } from "react";
import service from "../../../../partials/services/axios.config";
import {
  DATE_RANGE_FORMAT,
  getLast7Day,
  onClickRangePickerFooter,
} from "../../../../partials/common/Forms/RangePicker";
import {
  capitalizeWord,
  disabledDate,
  getBeforeTime,
} from "../../../../utils/Helpers";
import {
  EXTRA_FOOTER,
  NOTIFICATION_TYPES,
} from "../../../../constants/constants";
import Tag from "antd/lib/tag";
import DatePicker from "antd/lib/date-picker";
import moment from "moment";
import Button from "antd/lib/button/button";
import Pagination from "antd/lib/pagination/Pagination";
import { Link } from "react-router-dom";
import { getExternalUrl } from "../../../../utils/ProtectedRoutes";
import { getNotificationTypeIcon } from "../../../../partials/header/Notifications";
import Select from "antd/lib/select";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import AntInput from "antd/lib/input/Input";
import Empty from "antd/lib/empty";
import Loading from "../../../../utils/Loading";
import classNames from "classnames";

function DetailNotifications(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [dateRange, setDateRange] = useState<moment.Moment[]>(getLast7Day());
  const [type, setType] = useState();
  const [searchText, setSearchText] = useState<string>();

  const defaultPageSize = 10;
  const [tableData, setTableData] = useState<any>();
  const [tableFilters, setTableFilters] = useState({
    page: 1,
    size: defaultPageSize,
  });

  const onChangeRangePicker = (values) => {
    setDateRange(values);
  };

  useEffect(() => {
    getData();
  }, [tableFilters]);

  const getData = () => {
    const params = {
      size: tableFilters.size,
      page: tableFilters.page - 1,
      startDate: moment(dateRange[0])?.format(DATE_RANGE_FORMAT),
      endDate: moment(dateRange[1])?.format(DATE_RANGE_FORMAT),
      description: searchText,
      type,
    };

    setIsLoading(true);
    service.get("/notification", { params }).then(
      (res: any) => {
        setIsLoading(false);
        setTableData(res.results);
      },
      () => setIsLoading(false)
    );
  };

  const onChangePagination = (page, size) => {
    setTableFilters({ page, size });
  };

  const listData = Array.isArray(tableData?.content) ? tableData.content : [];

  return (
    <div>
      {isLoading && <Loading />}

      <div className="bg-white p-4 rounded-sm shadow mt-2">
        <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
          <AntInput
            allowClear
            placeholder="Search text"
            className="w-full xs:!w-[230px] !mx-1 2xl:!mx-2 !mt-3"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            className="w-full xs:w-[180px] !mx-1 2xl:!mx-2 !mt-3"
            placeholder="Select type"
            allowClear
            value={type}
            onChange={setType}
          >
            {Object.values(NOTIFICATION_TYPES).map((typeStr) => (
              <Select.Option key={typeStr}>
                {capitalizeWord(typeStr)}
              </Select.Option>
            ))}
          </Select>
          <DatePicker.RangePicker
            className="!mx-1 2xl:!mx-2 !mt-3"
            open={isOpenDateRange}
            onOpenChange={(open) => setIsOpenDateRange(open)}
            // @ts-ignore
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
            className="!mt-2 !mx-1 2xl:!mx-2"
            onClick={getData}
          >
            Search
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 pt-3.5 rounded-sm shadow mt-4">
        <div className="page-section !mt-0">
          Available Notifications
          {!isLoading && tableData?.totalElements > 0 && (
            <span> ({tableData?.totalElements})</span>
          )}
        </div>

        <div
          className={classNames(
            (!listData?.length || listData?.length > 2) && "min-h-[130px]"
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {listData.length > 0 &&
              listData.map((data, idx) => {
                return (
                  <div
                    className="border shadow px-4 py-3.5 rounded-md"
                    key={idx}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-base text-slate-800 mb-2">
                          {getNotificationTypeIcon(data)}
                          {!data.type && "📣"}
                          <span className="ml-0.5">{data.createdBy}: </span>
                          <span>{data.title}</span>
                        </div>

                        <div className="mt-2 px-2 lg:px-3">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: data.description,
                            }}
                          />
                          <div className="text-xs2 font-medium text-slate-400 mt-1.5">
                            {getBeforeTime(data.createdDate)}
                          </div>
                        </div>
                      </div>

                      {data.externalLink && (
                        <Link
                          className="block py-2 px-1 hover:underline"
                          to={getExternalUrl(data.externalLink)}
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {!isLoading && listData.length === 0 && <Empty />}
        </div>

        <div className="flex justify-end mt-3">
          <Pagination
            hideOnSinglePage
            total={tableData?.totalElements}
            pageSize={tableFilters.size}
            current={tableFilters.page}
            onChange={onChangePagination}
          />
        </div>
      </div>
    </div>
  );
}

DetailNotifications.propTypes = {};

export default DetailNotifications;
