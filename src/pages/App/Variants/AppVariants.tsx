import React, { useEffect, useRef, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getCpiCampaignById } from "../../../api/common/common.api";
import { GET_STORE_APP_BY_ID } from "../../../api/constants.api";
import Tabs from "antd/lib/tabs";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import VariantDetail from "./VariantDetail";

export default function AppVariants() {
  const urlParams = useParams();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const newTabIndex = useRef(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [dateRange, setDateRange] = useState<any>(getLastDay(2));
  const [themes, setThemes] = useState<any>([]);

  const [tab, setTab] = useState<string>();
  const [items, setItems] = useState<any>([]);

  const { data: storeAppRes } = useQuery(
    [GET_STORE_APP_BY_ID, urlParams.appId],
    getCpiCampaignById,
    {
      staleTime: 5 * 60000,
      enabled: !!urlParams.appId,
    }
  );

  useEffect(() => {
    const appVariants = storeAppRes?.results?.appVariants || [];
    const filteredVariants = appVariants.filter((el) => el.id);
    
    console.log(filteredVariants?.length)

    setThemes(filteredVariants);

    console.log(filteredVariants);
    

    const newItems = filteredVariants.map((el, idx) => ({
      key: el.id,
      label: el.name,
      children: <VariantDetail data={el} idx={idx} />,
    }));
    // Fake
    newItems.push({
      key: "newTab",
      label: "New App Variant",
      children: <VariantDetail idx={newItems.length} init={true} />,
    });
    console.log(newItems)
    setItems(newItems);
    setTab(newItems[0].key);
    

    // if (filteredVariants?.length) {

    //   console.log("go")
      
    //   const newItems = filteredVariants.map((el, idx) => ({
    //     key: el.id,
    //     label: el.name,
    //     children: <VariantDetail data={el} idx={idx} />,
    //   }));
    //   // Fake
    //   newItems.push({
    //     key: "newTab",
    //     label: "New App Variant",
    //     children: <VariantDetail idx={newItems.length} init={true} />,
    //   });
    //   setItems(newItems);
    //   setTab(newItems[1].key);
    //   // setTab(getActivedTab(filteredThemes));
    // }
  }, [storeAppRes]);

  const getActivedTab = (listThemes = themes) => {
    const themeId = searchParams.get("themeId");
    const defaultTab = listThemes[0]?.id;

    if (!listThemes?.length) return defaultTab;

    const activedTab = listThemes.find((theme) => theme.id === themeId);
    if (activedTab?.id === tab) return tab;

    return activedTab?.id || defaultTab;
  };

  const onChangeRangePicker = (values) => {
    setDateRange(values);
  };

  const onChangeTab = (themeId) => {
    if (tab === themeId) return;
    setTab(themeId);
  };

  const onEdit = (targetKey, action) => {
    if (action === "add") {
      addTab();
    } else {
      remove(targetKey);
    }
  };

  const addTab = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      key: newActiveKey,
      label: "New App Variant",
      children: <VariantDetail idx={items.length} init={true} />,
    });
    setItems(newPanes);
    setTab(newActiveKey);
  };

  const remove = (targetKey) => {
    let newActiveKey = tab;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setTab(newActiveKey);
  };

  const onApply = () => {
    console.log("aaa");
  };

  return (
    <Page>
      {isLoading && <Loading />}

      <div className="flex justify-between">
        <div className="page-title">App Variants</div>

        <div className="flex space-x-2">
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={(e) => {}}
            // onClick={(e) => setIsOpenModalAddApp(true)}
          >
            
          </Button> */}
        </div>
      </div>

      {/* <div className="flex items-center flex-wrap -mx-1 2xl:-mx-2">
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
      </div> */}

      <div className="mt-2">
        {themes?.length >= 0 && (
          <Tabs
            type="editable-card"
            items={items}
            activeKey={tab}
            onChange={onChangeTab}
            onEdit={onEdit}
          />
        )}
      </div>
    </Page>
  );
}
