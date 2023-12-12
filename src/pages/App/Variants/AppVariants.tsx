import React, { useEffect, useState } from "react";
import Page from "../../../utils/composables/Page";
import service from "../../../partials/services/axios.config";
import {
  DATE_RANGE_FORMAT,
  getCampDay,
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
  const { submitCb } = props;

  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [listStoreApps, setListStoreApps] = useState<any>([]);
  const [listCustomListing, setListCustomListing] = useState<any>([]);

  const [activeKey, setActiveKey] = useState<any>([defaultGroups[0].id]);
  const [groups, setGroups] = useState<Group[]>(defaultGroups);

  const initialValues = {
    time: getCampDay(),
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
      scheduleStart: moment(time[0]).format(DATE_RANGE_FORMAT),
      scheduleEnd: moment(time[1]).format(DATE_RANGE_FORMAT),
      appId: id,
      name: campaignName,
    };

    if (!submitCb) return; // check and remove

    setIsLoading(true);
    service.post("/cpi-campaigns", params).then(
      (res: any) => {
        const campId = res.results?.id;
        if (!campId) return setIsLoading(false);

        const listPromises: any = [];
        groups.forEach((item: Group, index) => {
          const formData = new FormData();

          formData.append("customListingId", item.listing!);
          item.creatives.forEach((file, fileIndex) => {
            formData.append("files", file);
          });

          const newPromise = service.post(
            `/cpi-campaigns/app-variants?campaignId=${campId}`,
            formData
          );
          listPromises.push(newPromise);
        });

        Promise.all(listPromises).then(
          (appVariantsRes: any) => {
            setIsLoading(false);
            toast("Your campaign has been successfully created!", {
              type: "success",
            });

            if (submitCb) {
              form.resetFields();
              submitCb(res.results);
              setGroups(defaultGroups);
              setActiveKey([defaultGroups[0].id]);
            }
          },
          () => setIsLoading(false)
        );
      },
      () => setIsLoading(false)
    );
  };

  const sessionTitle = "font-bold text-lg text-black";
  const contentComp = (
    <>
      {isLoading && <Loading />}
      {!submitCb && <div className="page-title">Comparing Themes</div>}

      <div
        className={classNames(
          !submitCb && "bg-white rounded-sm shadow mt-2 mb-5 lg:p-6 p-4"
        )}
      >
        <div className="font-bold text-black">Notes :</div>
        <ul className="m-0 pl-3">
          <li>
            - The Unity Ads campaign name is automatically by combining the CPI
            Campaign name with the Listing name.
          </li>
          <li className="xs:pl-2.5 mb-0.5">
            <span className="font-semibold">Example:</span>{" "}
            (prttat_special_force_dark | prttat_special_force_light)
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
          <div className={classNames(!submitCb && "max-w-[700px]")}>
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
            <div className="md:ml-4">
              <DynamicCampName form={form} listStoreApps={listStoreApps} />
            </div>

            <div className={`${sessionTitle} mt-6`}>Comparing listings</div>
            <div className="mt-4 md:ml-4">
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
          {/* {!submitCb && (
            <Button
              type="primary"
              className="min-w-[120px] mt-6 mb-4"
              htmlType="submit"
              form={FORM_LISTING}
            >
              Submit
            </Button>
          )} */}
        </Form>
      </div>
    </>
  );

  if (submitCb) return contentComp;

  return <Page>{contentComp}</Page>;
}

AppVariants.propTypes = {
  submitCb: PropTypes.func,
};
