import React, { useEffect, useState } from "react";
import Page from "../../../utils/composables/Page";
import service from "../../../partials/services/axios.config";
import { useParams } from "react-router-dom";
import CampaignTable from "./Table/CampaignTable";
import Select from "antd/lib/select";
import Button from "antd/lib/button/button";
import { useQuery } from "@tanstack/react-query";
import { GET_STORE_APP_BY_ID } from "../../../api/constants.api";
import { getCpiCampaignById } from "../../../api/common/common.api";
import {
  DATE_RANGE_FORMAT,
  getLastDay,
  onClickRangePickerFooter,
} from "../../../partials/common/Forms/RangePicker";
import moment from "moment";
import DatePicker from "antd/lib/date-picker";
import { disabledDate, sortNumberWithNullable } from "../../../utils/Helpers";
import { EXTRA_FOOTER } from "../../../constants/constants";
import Tag from "antd/lib/tag";

function Campaigns(props) {
  const urlParams = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [appState, setAppState] = useState<any>({});

  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [dateRange, setDateRange] = useState<any>(getLastDay(2));
  const [activedThemes, setActivedThemes] = useState([]);

  const { data: storeAppRes } = useQuery(
    [GET_STORE_APP_BY_ID, urlParams.appId],
    getCpiCampaignById,
    {
      staleTime: 5 * 60000,
      enabled: !!urlParams.appId,
    }
  );

  useEffect(() => {
    setAppState(storeAppRes?.results || {});
  }, [storeAppRes]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    const params = {
      appIds: urlParams.appId,
      startDate: moment(dateRange[0])?.format(DATE_RANGE_FORMAT),
      endDate: moment(dateRange[1])?.format(DATE_RANGE_FORMAT),
      themeIds: activedThemes.join(","),
    };
    service.get("/campaigns", { params }).then(
      (res: any) => {
        const newData = res.results;
        newData.sort((a, b) =>
          sortNumberWithNullable(b, a, (el) => el.data?.install)
        );
        setCampaigns(newData);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  };

  const onChangeRangePicker = (values) => {
    setDateRange(values);
  };

  return (
    <Page>
      <div className="flex justify-between">
        <div className="page-title">Campaigns</div>
      </div>

      <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2">
        <Select
          allowClear
          mode="multiple"
          maxTagCount="responsive"
          placeholder="Select themes"
          className="xs:!w-[200px] !mx-1 2xl:!mx-2 !mt-3"
          value={activedThemes}
          onChange={setActivedThemes}
        >
          {appState?.themes?.length > 0 &&
            appState.themes.map((el: any, idx) => {
              return (
                <Select.Option value={el.id} key={idx}>
                  <div>{el.name}</div>
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
          onClick={getData}
          className="mx-1 2xl:!mx-2 mt-3"
        >
          Apply
        </Button>
      </div>

      <CampaignTable
        data={campaigns}
        setData={setCampaigns}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Page>
  );
}

export default Campaigns;
