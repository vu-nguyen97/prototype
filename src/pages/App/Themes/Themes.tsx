import React, { useEffect, useState } from "react";
import Page from "../../../utils/composables/Page";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
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
import { useQuery } from "@tanstack/react-query";
import { getStoreAppById } from "../../../api/common/common.api";
import { GET_STORE_APP_BY_ID } from "../../../api/constants.api";
import Tabs from "antd/lib/tabs";

export default function Themes() {
  const urlParams = useParams();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [dateRange, setDateRange] = useState<any>(getLastDay(2));
  const [themes, setThemes] = useState<any>([]);

  const [tab, setTab] = useState();
  const [items, setItems] = useState<any>([]);

  const { data: storeAppRes } = useQuery(
    [GET_STORE_APP_BY_ID, urlParams.appId],
    getStoreAppById,
    {
      staleTime: 5 * 60000,
      enabled: !!urlParams.appId,
    }
  );

  useEffect(() => {
    const themes = storeAppRes?.results?.themes || [];

    if (themes?.length) {
      setThemes(themes);
      setItems(
        themes.map((el, idx) => ({
          key: el.id,
          label: el.name,
          children: <div className="p-4 sm:p-6">{el.name}</div>,
        }))
      );
    }
  }, [storeAppRes]);

  useEffect(() => {
    const themeId = searchParams.get("themeId");

    if (!themes?.length) return;
    const activedTab = themes.find((theme) => theme.id === themeId);

    if (activedTab?.id === tab) return;
    setTab(activedTab?.id || themes[0].id);
  }, [window.location.search, themes]);

  const onChangeRangePicker = (values) => {
    setDateRange(values);
  };

  const onChangeTab = (themeId) => {
    console.log("tabUrl :>> ", themeId);
    if (tab === themeId) return;

    navigate({
      search: createSearchParams({ themeId }).toString(),
    });
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
        {themes?.length > 0 && (
          <Tabs
            type="card"
            items={items}
            activeKey={tab}
            onChange={onChangeTab}
          />
        )}
      </div>
    </Page>
  );
}
