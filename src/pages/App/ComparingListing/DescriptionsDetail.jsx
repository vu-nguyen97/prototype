import React from "react";
import DatePicker from "antd/lib/date-picker";
import { EXTRA_FOOTER } from "../../../constants/constants";
import Tag from "antd/lib/tag";
import { onClickRangePickerFooter } from "../../../partials/common/Forms/RangePicker";
import moment from "moment";
import {
  getCountryNameFromCode,
  getLabelFromStr,
} from "../../../utils/Helpers";
import Descriptions from "antd/lib/descriptions";

export default function DescriptionsDetail(props) {
  const {
    listStores,
    appState,
    isOpenDateRange,
    setIsOpenDateRange,
    dateRange,
    setDateRange,
  } = props;

  const getSectionTitle = (title) => (
    <Descriptions.Item
      label={title}
      span={3}
      labelStyle={{
        lineHeight: "24px",
        fontSize: 22,
        marginTop: 32,
        marginBottom: 10,
      }}
    >
      <></>
    </Descriptions.Item>
  );

  const storeApp = appState?.storeApp || {};
  const storeName =
    listStores?.find((el) => el.id === storeApp?.consoleDeveloperId)?.name ||
    "";
  const unityAds = appState.appVariants?.[0]?.unityAds;
  const countryBids = unityAds?.countryBids || [];

  return (
    <Descriptions
      className=""
      size="small"
      colon={false}
      labelStyle={{ fontWeight: 600, minWidth: 140 }}
    >
      <Descriptions.Item label="Store name" span={3}>
        <div className="text-base font-semibold">{storeName}</div>
      </Descriptions.Item>
      <Descriptions.Item
        label="App"
        span={3}
        labelStyle={{ lineHeight: "24px" }}
      >
        <div className="flex items-center space-x-2.5">
          {storeApp?.icon && (
            <img
              src={storeApp?.icon}
              alt=" "
              className="w-10 h-10 rounded img-cover"
            />
          )}
          <div>
            <div className="text-lg font-bold">{storeApp?.name}</div>
            <div className="text-xs2">{storeApp?.packageId}</div>
          </div>
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Campaign name" span={3}>
        <div className="font-semibold">{appState?.name}</div>
      </Descriptions.Item>
      <Descriptions.Item label="Created by" span={1}>
        <div>{appState?.createdBy}</div>
      </Descriptions.Item>
      <Descriptions.Item
        label="Created date"
        span={2}
        labelStyle={{ minWidth: undefined }}
      >
        <div className="">
          {appState?.createdDate &&
            moment(appState?.createdDate).format("DD-MM-YYYY HH:mm:ss")}
        </div>
      </Descriptions.Item>
      <Descriptions.Item
        label="Status"
        span={3}
        labelStyle={{ lineHeight: "24px" }}
      >
        <div className="font-bold text-base text-red-800">
          {getLabelFromStr(appState?.state)}
        </div>
      </Descriptions.Item>

      {getSectionTitle("Unity informations")}
      <Descriptions.Item label="Campaign type" span={3}>
        <div className="">{getLabelFromStr(unityAds?.billingType)}</div>
      </Descriptions.Item>
      <Descriptions.Item label="Campaign goal" span={3}>
        {getLabelFromStr(unityAds?.goal)}
      </Descriptions.Item>
      <Descriptions.Item label="Country bid" span={1}>
        {countryBids?.length > 0 && (
          // flex flex-wrap items-center space-x-2 line-clamp-6
          <div className="flex flex-col space-y-1">
            {countryBids.map(({ country, bid }, idx) => {
              return (
                <div key={idx}>
                  <span
                    className={`fi fi-${country.toLowerCase()} w-5 h-3 mr-1`}
                  />
                  {getCountryNameFromCode(country)}:
                  <span className="ml-1 font-semibold">$</span>
                  <span className="font-semibold">{bid}</span>
                  {/* {idx !== countryBids?.length - 1 && ","} */}
                </div>
              );
            })}
          </div>
        )}
      </Descriptions.Item>
      <Descriptions.Item span={2}>
        <div>
          <div className="flex items-center">
            <div className="font-semibold mr-3">Daily budget</div>
            {unityAds?.totalBudget && `$${unityAds?.totalBudget}`}
          </div>
          <div className="flex items-center">
            {/* <div>Total budget</div> */}
            <div className="font-semibold mr-3">Daily budget</div>
            {unityAds?.dailyBudget && `$${unityAds?.dailyBudget}`}
          </div>
        </div>
      </Descriptions.Item>
      <Descriptions.Item
        label="Ads Interval"
        labelStyle={{ lineHeight: "32px" }}
        span={3}
      >
        <DatePicker.RangePicker
          className="w-full xs:w-auto"
          open={isOpenDateRange}
          onOpenChange={(open) => setIsOpenDateRange(open)}
          value={dateRange}
          onChange={setDateRange}
          disabled
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
      </Descriptions.Item>
    </Descriptions>
  );
}
