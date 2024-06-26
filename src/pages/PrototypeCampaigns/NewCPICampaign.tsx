import React, { useState, useEffect } from "react";
import Page from "../../utils/composables/Page";
import Loading from "../../utils/Loading";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import AntInput from "antd/lib/input/Input";
import DatePicker from "antd/lib/date-picker";
import { disabledDate } from "../../utils/Helpers";
import { EXTRA_FOOTER } from "../../constants/constants";
import {
  DATE_RANGE_FORMAT,
  getLastDay,
  onClickRangePickerFooter,
} from "../../partials/common/Forms/RangePicker";
import Tag from "antd/lib/tag";
const NewCPICampaign = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenDateRange, setIsOpenDateRange] = useState(false);
    const [dateRange, setDateRange] = useState<any>(getLastDay(0));
    const onChangeRangePicker = (dates) => {
        setDateRange(dates);
      };
    return (
        <Page>
          {isLoading && <Loading />}
          <div>
            <div className="flex justify-between">
            <div className="page-title">New CPI Campaigns</div>
          </div>
          <div
          className="bg-white p-4 rounded-sm shadow mt-2"
          style={{ marginBottom: 20 }}
        >
          <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
            <div style={{fontSize: 17, marginTop: 10, marginRight: 5, paddingLeft: 5}}>Campaign Name:</div>
            <AntInput
              allowClear
              placeholder="Enter Campaign Name"
              className="xs:!w-[300px] mx-1 2xl:!mx-2 mt-3"
            />
            <div style={{fontSize: 17, marginTop: 10, marginRight: 5, paddingLeft: 5}}>Ads Interval:</div>
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
          </div>
        </div>
        <div
          className="bg-white p-4 rounded-sm shadow mt-2"
          style={{ marginBottom: 20, fontWeight: "bold", fontSize: 15 }}
        >
            <h1 style={{fontSize: 20,fontWeight: "bold"}}>Notes:</h1>
            <h1>-The Unity Ads campaign name is automatically generated by combining the CPI campaign name with the Listing name.</h1>
            <h1 style={{marginLeft: 10}}>Example: ( prttat_special_force_dark | prttat_special_force_light )</h1>
            <h1>-The Unity Ads budget is configured automatically by default</h1>
        </div>
        
          </div>
        </Page>
    )
}

export default NewCPICampaign;