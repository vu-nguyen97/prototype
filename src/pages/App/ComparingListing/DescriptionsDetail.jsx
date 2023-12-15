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
import { Descriptions } from "antd";

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
        width: undefined,
      }}
    >
      <></>
    </Descriptions.Item>
  );

  const screenBp = 500;
  const pageWidth = window.innerWidth;
  const mobileScreen = pageWidth < screenBp;
  const desktopScreen = pageWidth > 1400;

  const span1 = desktopScreen ? 1 : pageWidth < 768 ? 3 : 2;
  const span2 = desktopScreen ? 2 : pageWidth < 768 ? 3 : 1;

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
      labelStyle={{
        fontWeight: 600,
        width: mobileScreen ? 90 : 160,
      }}
    >
      <Descriptions.Item label="Store name" span={3}>
        <div className="xs:text-base font-semibold">{storeName}</div>
      </Descriptions.Item>
      <Descriptions.Item
        label="App"
        span={3}
        labelStyle={{ lineHeight: "24px" }}
      >
        <div className="flex xs:items-center space-x-1 xs:space-x-2.5">
          {storeApp?.icon && (
            <img
              src={storeApp?.icon}
              alt=" "
              className="w-7 h-7 xs:w-10 xs:h-10 rounded img-cover"
            />
          )}
          <div>
            <div className="xs:text-lg font-bold">{storeApp?.name}</div>
            <div className="text-xs2">{storeApp?.packageId}</div>
          </div>
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Campaign name" span={3}>
        <div className="font-semibold">{appState?.name}</div>
      </Descriptions.Item>
      <Descriptions.Item label="Created by" span={span1}>
        <div>{appState?.createdBy}</div>
      </Descriptions.Item>
      <Descriptions.Item
        label="Created date"
        span={span2}
        labelStyle={pageWidth < 768 ? undefined : { width: undefined }}
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
      <Descriptions.Item label="Country bid" span={span1}>
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
      {pageWidth > 768 ? (
        <Descriptions.Item span={span2}>
          <div>
            <div className="flex items-center">
              <div className="font-semibold mr-3">Total budget</div>
              {unityAds?.totalBudget && `$${unityAds?.totalBudget}`}
            </div>
            <div className="flex items-center">
              <div className="font-semibold mr-3">Daily budget</div>
              {unityAds?.dailyBudget && `$${unityAds?.dailyBudget}`}
            </div>
          </div>
        </Descriptions.Item>
      ) : (
        <>
          <Descriptions.Item span={3} label="Total budget">
            {unityAds?.totalBudget && `$${unityAds?.totalBudget}`}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Daily budget">
            {unityAds?.dailyBudget && `$${unityAds?.dailyBudget}`}
          </Descriptions.Item>
        </>
      )}
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
