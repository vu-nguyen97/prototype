import React, { useEffect, useState } from "react";
import Page from "../../../utils/composables/Page";
import { useParams } from "react-router-dom";
import service from "../../../partials/services/axios.config";
import moment from "moment";
import {
  DATE_RANGE_FORMAT,
  getLastDay,
  onClickRangePickerFooter,
} from "../../../partials/common/Forms/RangePicker";
import DatePicker from "antd/lib/date-picker";
import { disabledDate } from "../../../utils/Helpers";
import { EXTRA_FOOTER } from "../../../constants/constants";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button/button";
import Loading from "../../../utils/Loading";
import ThemeCard from "./ThemeCard";

export default function Themes() {
  const urlParams = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [dateRange, setDateRange] = useState<any>(getLastDay(2));
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    const params = {
      appId: urlParams.appId,
      startDate: moment(dateRange[0])?.format(DATE_RANGE_FORMAT),
      endDate: moment(dateRange[1])?.format(DATE_RANGE_FORMAT),
    };
    service.get("/themes", { params }).then((res: any) => {
      console.log("res :>> ", res);
      setThemes(res.results);
    });
  }, []);

  const onChangeRangePicker = (values) => {
    setDateRange(values);
  };

  const onApply = () => {
    console.log("aaa");
  };

  return (
    <Page>
      {isLoading && <Loading />}

      <div className="flex justify-between">
        <div className="page-title">Themes</div>
      </div>

      <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2">
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

      <div className="mt-6">
        {themes?.length > 0 &&
          themes.map((el, idx) => {
            return <ThemeCard data={el} key={idx} />;
          })}
      </div>
    </Page>
  );
}
