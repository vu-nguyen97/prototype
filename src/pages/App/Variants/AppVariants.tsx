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
import DynamicCampName from "./DynamicCampName/DynamicCampName";
import { useQuery } from "@tanstack/react-query";
import { GET_UNITY_STORE } from "../../../api/constants.api";
import { getUnityStore } from "../../../api/common/common.api";
import { getActivedApp } from "../../../partials/common/Forms/SelectStoreApp";
import Form from "antd/lib/form";
import { Group } from "./ListingForm/interface";
import { defaultGroups } from "../../AddCampaign/constants";
import ListingGroup from "./ListingForm/ListingGroup";
import { FIELD_REQUIRED } from "../../../constants/formMessage";
import moment from "moment";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import classNames from "classnames";

export const FORM_LISTING = "FormListing";

export default function AppVariants(props) {
  const [form] = Form.useForm();
  const { isModalCreate, submitCb } = props;

  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [listStoreApps, setListStoreApps] = useState<any>([]);
  const [listCustomListing, setListCustomListing] = useState<any>([]);

  const [activeKey, setActiveKey] = useState<any>([defaultGroups[0].id]);
  const [groups, setGroups] = useState<Group[]>(defaultGroups);

  const initialValues = {
    time: getLastDay(3),
  };
  const formApp = Form.useWatch("app", form);

  const { data: unityStoreRes } = useQuery([GET_UNITY_STORE], getUnityStore, {
    staleTime: 30 * 60000,
  });

  useEffect(() => {
    if (!unityStoreRes) return;
    setListStoreApps(unityStoreRes);
  }, [unityStoreRes]);

  useEffect(() => {
    if (!formApp) return;
    const id = getActivedApp(listStoreApps, formApp)?.id;

    service.get("/store-app/" + id).then(
      (res: any) => {
        const newApp = res.results || {};
        if (!Object.keys(newApp).length) return;

        service.get("/" + newApp.consoleAppId + "/custom_listings").then(
          (res: any) => {
            setListCustomListing(res.results || []);
          },
          () => {}
        );
      },
      () => {}
    );
  }, [formApp]);

  const onFinish = (values) => {
    const { app, campaignName, time } = values;
    const id = getActivedApp(listStoreApps, app)?.id;

    const params: any = {
      time1: moment(time[0]).format("DD-MM-YYYY"),
      time2: moment(time[1]).format("DD-MM-YYYY"),
      id,
      campaignName,
    };

    // groups.forEach((group: Group) => {
    //   const {listing, id, creatives} = group
    //   if (listing) {
    //     params["listing" + id] = listing
    //     params["creatives" + id] = creatives
    //   }
    // });

    console.log("values :>> ", values);
    console.log("groups :>> ", groups, params);

    // setIsLoading(true);
    // service.post("/cpi-campaigns", params).then(
    //   (res: any) => {
    //     toast(res.message, { type: "success" });
    //     setIsLoading(false);

    //     if (isModalCreate) {
    //       form.resetFields();
    //       submitCb && submitCb();
    //       setTimeout(() => {
    //         setGroups(defaultGroups)
    //       }, 300);
    //     }
    //   },
    //   () => setIsLoading(false)
    // );
  };

  const sessionTitle = "font-bold text-lg text-black";
  const contentComp = (
    <>
      {isLoading && <Loading />}
      {!isModalCreate && <div className="page-title">Comparing Themes</div>}

      <div
        className={classNames(
          !isModalCreate && "bg-white rounded-sm shadow mt-2 mb-5 lg:p-6 p-4"
        )}
      >
        <div className="font-bold text-black">Notes :</div>
        <ul className="m-0 pl-3">
          <li>
            - The Unity Ads campaign name is automatically by combining the CPI
            Campaign name with the Listing name.
          </li>
          <li className="pl-2.5 mb-0.5">
            Example: (prttat_special_force_dark | prttat_special_force_light)
          </li>
          <li>
            - The Unity Ads budget is configured automatically by default.
          </li>
        </ul>

        <Form
          id={FORM_LISTING}
          labelAlign="left"
          form={form}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          initialValues={initialValues}
        >
          <div className={classNames(!isModalCreate && "max-w-[700px]")}>
            <div className={`${sessionTitle} mt-6 mb-1.5`}>Ads Interval:</div>
            <Form.Item
              className="ml-2 md:ml-4"
              name="time"
              label="Date time"
              rules={[{ required: true, message: FIELD_REQUIRED }]}
            >
              <DatePicker.RangePicker
                className="w-full xs:w-auto"
                open={isOpenDateRange}
                onOpenChange={(open) => setIsOpenDateRange(open)}
                disabledDate={disabledDate}
                renderExtraFooter={() => (
                  <div className="flex py-2.5">
                    {EXTRA_FOOTER.map((obj, idx) => (
                      <Tag
                        key={idx}
                        color="blue"
                        className="cursor-pointer"
                        onClick={() =>
                          onClickRangePickerFooter(
                            obj.value,
                            (v) =>
                              form.setFields([
                                { name: "time", value: v, errors: [] },
                              ]),
                            () => setIsOpenDateRange(false)
                          )
                        }
                      >
                        {obj.label}
                      </Tag>
                    ))}
                  </div>
                )}
              />
            </Form.Item>

            <div className={`${sessionTitle} mt-6`}>Campaign information</div>
            <div className="ml-2 md:ml-4">
              <DynamicCampName form={form} listStoreApps={listStoreApps} />
            </div>

            <div className={`${sessionTitle} mt-6`}>Comparing listings</div>
            <div className="mt-4 ml-2 md:ml-4">
              <ListingGroup
                form={form}
                title=""
                activeKey={activeKey}
                setActiveKey={setActiveKey}
                groups={groups}
                setGroups={setGroups}
                listings={listCustomListing}
              />
            </div>
          </div>
          {!isModalCreate && (
            <Button
              type="primary"
              className="min-w-[120px] mt-6 mb-4"
              htmlType="submit"
              form={FORM_LISTING}
            >
              Submit
            </Button>
          )}
        </Form>
      </div>
    </>
  );

  if (isModalCreate) return contentComp;

  return <Page>{contentComp}</Page>;
}

AppVariants.propTypes = {
  isModalCreate: PropTypes.bool,
  submitCb: PropTypes.func,
};
