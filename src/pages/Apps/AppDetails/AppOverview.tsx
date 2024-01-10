import { DatePicker, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { EXTRA_FOOTER } from "../../../constants/constants";
import {
  getLast14Day,
  onClickRangePickerFooter,
} from "../../../partials/common/Forms/RangePicker";
import service from "../../../partials/services/axios.config";
import Page from "../../../utils/composables/Page";
import RetentionLineChart from "./RetentionLineChart";

export default function AppOverview() {
  const urlParams = useParams();

  const retentionPeriods = [1, 2, 3, 4, 5, 6, 7, 14, 21, 30];

  const [isLoading, setIsLoading] = useState(false);
  const [retentionMetrics, setRetentionMetrics] = useState<number[]>([]);
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);

  const [dateRange, setDateRange] = useState<any>(getLast14Day());

  useEffect(() => {
    if (!dateRange) return;

    fetchMetrics();
  }, [dateRange]);

  const fetchMetrics = async () => {
    try {
      const appId = urlParams.appId as string;

      setIsLoading(true);
      const res: any = await service.get("/store-app/" + appId + "/metrics", {
        params: {
          startDate: moment(dateRange[0]).format("YYYY-MM-DD"),
          endDate: moment(dateRange[1]).format("YYYY-MM-DD"),
        },
      });

      setRetentionMetrics(
        retentionPeriods.map((item) => res.results["Retention Rate Day " + item] * 100)
      );
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message);
    }
  };

  const onChangeRangePicker = (values) => {
    if (moment(values[1]).diff(values[0]) > 1000 * 60 * 60 * 24 * 31) {
      setDateRange([
        values[0],
        moment(values[0]).add(1000 * 60 * 60 * 24 * 31),
      ]);
      return;
    }
    setDateRange(values);
  };

  return (
    <Page>
      <div className="page-title">Overview</div>
      <div className="bg-white p-4 rounded-sm mb-4">
        <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2">
          <DatePicker.RangePicker
            className="w-full xs:w-auto !mx-1 2xl:!mx-2"
            open={isOpenDateRange}
            onOpenChange={(open) => setIsOpenDateRange(open)}
            value={dateRange}
            onChange={onChangeRangePicker}
            disabledDate={(current) =>
              current && current > moment().endOf("day")
            }
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
        </div>
      </div>

      <div className="text-center bg-white p-4 rounded-sm">
        <div className="text-xl text-black font-bold">Retention</div>
        <div className="min-h-[400px] h-[500px]">
          <RetentionLineChart data={retentionMetrics} isLoading={isLoading} />
        </div>
      </div>
    </Page>
  );
}
