import React, { useEffect, useState } from "react";
import Page from "../../../utils/composables/Page";
import service from "../../../partials/services/axios.config";
import {
  getLastDay,
  onClickRangePickerFooter,
} from "../../../partials/common/Forms/RangePicker";
import DatePicker from "antd/lib/date-picker";
import { disabledDate } from "../../../utils/Helpers";
import { EXTRA_FOOTER } from "../../../constants/constants";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button/button";
import Loading from "../../../utils/Loading";
import { useLocation } from "react-router-dom";

export default function AppVariants() {
  const location = useLocation();
  const packageId = location.state?.packageId;
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [dateRange, setDateRange] = useState<any>(getLastDay(0));
  const [isLoading, setIsLoading] = useState(true);
  const [listCustomListing, setListCustomListing] = useState<any>({});
  const [app, setApp] = useState<any>({});

  const onChangeRangePicker = (dates) => {
    setDateRange(dates);
  };

  useEffect(() => {
    console.log("?????", packageId);
    setIsLoading(true);
    service.get("/store-app/" + packageId).then(
      (res: any) => {
        const newApp = res.results || {};
        setApp(newApp);

        if (!Object.keys(newApp).length) return setIsLoading(false);
        service.get("/" + newApp.consoleAppId + "/custom_listings").then(
          (res: any) => {
            setListCustomListing(res.results);
            setIsLoading(false);
          },
          () => setIsLoading(false)
        );
      },
      () => setIsLoading(false)
    );
  }, []);

  return (
    <Page>
      {isLoading && <Loading />}
      <div className="page-title">Comparing Themes</div>
      <div className="bg-white p-4 rounded-sm shadow mt-2 mb-5">
        <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2 -mt-3">
          <div className="flex items-center !mt-3 !mx-1 2xl:!mx-2">
            Ads Interval:
            <DatePicker.RangePicker
              className="w-full xs:w-auto !ml-2 2xl:!ml-3"
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

          <Button type="primary" className="mx-1 2xl:!mx-2 mt-3">
            Set
          </Button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-sm shadow mt-2 mb-5">
        <h1 style={{ fontWeight: "bold", fontSize: 20 }}>Notes :</h1>
        <h1 style={{ fontSize: 15 }}>
          -The Unity Ads campaign name is automatically by combining the CPI
          Campaign name with the Listing name.
        </h1>
        <h1 style={{ fontSize: 15 }}>
          Example: (prttat_special_force_dark | prttat_special_force_light)
        </h1>
        <h1 style={{ fontSize: 15 }}>
          -The Unity Ads budget is configured automatically by default.
        </h1>
      </div>
      <div></div>
    </Page>
  );
}
