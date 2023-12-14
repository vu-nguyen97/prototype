import React, { useEffect, useState } from "react";
import Page from "../../../utils/composables/Page";
import service from "../../../partials/services/axios.config";
import {
  DATE_RANGE_FORMAT,
  getCampDay,
  onClickRangePickerFooter,
} from "../../../partials/common/Forms/RangePicker";
import DatePicker from "antd/lib/date-picker";
import { EXTRA_FOOTER } from "../../../constants/constants";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button/button";
import Loading from "../../../utils/Loading";
import DynamicCampName from "./DynamicCampName/DynamicCampName";
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
import message from "antd/lib/message";
import Modal from "antd/lib/modal";

export const FORM_LISTING = "FormListing";

export default function AppVariants(props) {
  const [form] = Form.useForm();
  const { submitCb, store, isOpen, onClose } = props;

  const [inited, setInited] = useState(false);
  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [listStoreApps, setListStoreApps] = useState<any>([]);
  const [listCustomListing, setListCustomListing] = useState<any>([]);
  const [listStores, setListStores] = useState<any>([]);

  const [activeKey, setActiveKey] = useState<any>([defaultGroups[0].id]);
  const [groups, setGroups] = useState<Group[]>(defaultGroups);

  const initialValues = {
    time: getCampDay(),
  };
  const formApp = Form.useWatch("app", form);

  useEffect(() => {
    if (inited) return;
    if (!isOpen && isOpen !== undefined) return;

    setIsLoading(true);
    const getUnityApps = service.get("/store-app");
    const getStores = service.get("/google-play-stores");

    Promise.all([getUnityApps, getStores]).then(
      (res: any) => {
        const newStores = res[1].results || [];
        setListStores(newStores);
        form.setFieldValue("store", store || newStores[0]?.id);

        setListStoreApps(
          res[0].results?.filter((app: any) => app.unityGameId !== 0) || []
        );
        setIsLoading(false);
        setInited(true);
      },
      () => setIsLoading(false)
    );
  }, [isOpen]);

  useEffect(() => {
    form.setFieldValue("store", store || listStores[0]?.id);
  }, [submitCb]);

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

  const onCloseModal = () => {
    onClose();
    form.resetFields();
    setActiveKey([defaultGroups[0].id]);
    setGroups(defaultGroups);
  };

  const onFinish = (values) => {
    const { app, campaignName, time, store } = values;
    const id = getActivedApp(listStoreApps, app)?.id;

    if (groups?.length === 1) {
      return message.error("Please create at least two group listings!");
    }

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
        processPromisesSequentially(groups, campId);
      },
      () => setIsLoading(false)
    );
  };

  async function processPromisesSequentially(groups, campId) {
    const totalPromises = groups.length;
    let completedPromises = 0;

    for (const item of groups) {
      const formData = new FormData();
      formData.append("customListingId", item.listing);
      for (const file of item.creatives) {
        formData.append("files", file);
      }

      try {
        const response = await service.post(
          `/cpi-campaigns/app-variants?campaignId=${campId}`,
          formData
        );
        completedPromises++;
        if (completedPromises === totalPromises) {
          setIsLoading(false);
          toast("Your campaign has been successfully created!", {
            type: "success",
          });

          if (submitCb) {
            form.resetFields();
            submitCb();
            setGroups(defaultGroups);
            setActiveKey([defaultGroups[0].id]);
            onCloseModal();
          }
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
  }

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
              <DynamicCampName form={form} listStores={listStores} />
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

  if (submitCb)
    return (
      <Modal
        title="Add new campaign"
        width={900}
        open={isOpen}
        maskClosable={false}
        onCancel={onCloseModal}
        footer={[
          <Button key="back" htmlType="button" onClick={onCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            form={FORM_LISTING}
          >
            Save
          </Button>,
        ]}
      >
        {contentComp}
      </Modal>
    );

  return <Page>{contentComp}</Page>;
}

AppVariants.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  submitCb: PropTypes.func,
  store: PropTypes.string,
};
