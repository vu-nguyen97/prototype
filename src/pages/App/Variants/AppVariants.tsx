import Button from "antd/lib/button/button";
import DatePicker from "antd/lib/date-picker";
import Form from "antd/lib/form";
import InputNumber from "antd/lib/input-number";
import Modal from "antd/lib/modal";
import Select from "antd/lib/select";
import Tag from "antd/lib/tag";
import classNames from "classnames";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BID_CPI_TYPE, EXTRA_FOOTER } from "../../../constants/constants";
import { COUNTRIES } from "../../../constants/countries";
import { FIELD_REQUIRED } from "../../../constants/formMessage";
import {
  DATE_RANGE_FORMAT,
  getCampDay,
  onClickRangePickerFooter,
} from "../../../partials/common/Forms/RangePicker";
import { getActivedApp } from "../../../partials/common/Forms/SelectStoreApp";
import service from "../../../partials/services/axios.config";
import Loading from "../../../utils/Loading";
import Page from "../../../utils/composables/Page";
import BidGroupForm from "../../AddCampaign/components/BidGroupForm";
import { defaultGroups } from "../../AddCampaign/constants";
import { BidGroup } from "../../AddCampaign/interface";
import DynamicCampName from "./DynamicCampName/DynamicCampName";
import ListingGroup from "./ListingForm/ListingGroup";
import { Group } from "./ListingForm/interface";

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
  const [listAdsConfigs, setListAdsConfigs] = useState<any>([]);

  const [selectedConfigTemplateIndex, setSelectedConfigTemplateIndex] =
    useState<any>(-1);

  const [activeKey, setActiveKey] = useState<any>([defaultGroups[0].id]);
  const [groups, setGroups] = useState<Group[]>(defaultGroups);

  const [activeBidKey, setActiveBidKey] = useState<any>([defaultGroups[0].id]);
  const [bidGroups, setBidGroups] = useState<BidGroup[]>(defaultGroups);

  const initialValues = {
    time: getCampDay(),
  };
  const formApp = Form.useWatch("app", form);

  useEffect(() => {
    if (inited) {
      form.setFieldValue("adsConfig", listAdsConfigs[0]?.id);
      return;
    }
    if (!isOpen && isOpen !== undefined) return;

    setIsLoading(true);
    const getUnityApps = service.get("/store-app");
    const getStores = service.get("/google-play-stores");
    const getAdsConfigs = service.get("/configs");

    Promise.all([getUnityApps, getStores, getAdsConfigs]).then(
      (res: any) => {
        const newStores = res[1].results || [];
        setListStores(newStores);
        form.setFieldValue("store", store || newStores[0]?.id);

        setListStoreApps(
          res[0].results?.filter((app: any) => app.unityGameId !== 0) || []
        );
        setIsLoading(false);
        setInited(true);
        setListAdsConfigs(res[2].results || []);
        form.setFieldValue("adsConfig", res[2].results[0]?.id);
      },
      () => setIsLoading(false)
    );
  }, [isOpen]);

  useEffect(() => {
    if (selectedConfigTemplateIndex === -1) return;
    const bidGroups = listAdsConfigs[selectedConfigTemplateIndex]?.bids?.map(
      (item, index) => {
        return {
          id: index,
          countries: [item.country],
          bid: item.bid,
        };
      }
    );

    setBidGroups(bidGroups);

    form.setFieldsValue({
      dailyBudget: listAdsConfigs[selectedConfigTemplateIndex]?.dailyBudget,
      totalBudget: listAdsConfigs[selectedConfigTemplateIndex]?.totalBudget,
    });
  }, [selectedConfigTemplateIndex]);

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
            console.log("custom_listings", res.results);

            // Create a new object with the specified ID and name
            const newObject = {
              id: "main_listing",
              listingName: "Main Listing",
            };

            const existingResults = res.results
              ? res.results.map((listing: any) => ({
                  ...listing,
                  listingName: "Custom - " + listing.listingName,
                }))
              : [];

            // Insert the new object at index 0
            existingResults.unshift(newObject);

            // Update the state with the modified array
            setListCustomListing(existingResults);
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
    setSelectedConfigTemplateIndex(-1);
    setBidGroups(defaultGroups);
    setActiveKey([defaultGroups[0].id]);
    setGroups(defaultGroups);
  };

  const onFinish = (values) => {
    const {
      app,
      campaignName,
      time,
      store,
      adsConfig,
      dailyBudget,
      totalBudget,
    } = values;
    const id = getActivedApp(listStoreApps, app)?.id;

    const countriesBid: any[] = [];
    bidGroups.forEach((el: BidGroup) => {
      const { countries, bid } = el;
      if (countries?.length) {
        countries.forEach((country) => {
          countriesBid.push({ country, bid });
        });
      }
    });

    const params: any = {
      scheduleStart: moment(time[0]).format(DATE_RANGE_FORMAT),
      scheduleEnd: moment(time[1]).format(DATE_RANGE_FORMAT),
      appId: id,
      name: campaignName,
      dailyBudget,
      totalBudget,
      bids: countriesBid,
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

  const onResetGroup = () => {
    setGroups(defaultGroups);
    setActiveKey([defaultGroups[0].id]);
    setListCustomListing([]);
  };

  const sessionTitle = "font-bold text-lg text-black";
  const contentComp = (
    <>
      {isLoading && <Loading />}
      {!submitCb && <div className="page-title">Campagin listing</div>}

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
              <DynamicCampName
                form={form}
                listStores={listStores}
                onResetGroup={onResetGroup}
              />
            </div>

            <Form.Item
              className="mt-4 md:ml-4"
              label={"Ads config template"}
              name="configTemplate"
            >
              <Select onSelect={setSelectedConfigTemplateIndex}>
                {listAdsConfigs.map((item, index) => (
                  <Select.Option key={item.id} value={index}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              className="mt-4 md:ml-4"
              name="dailyBudget"
              label="Daily budget"
              rules={[{ required: true, message: FIELD_REQUIRED }]}
            >
              <InputNumber
                className="!w-full"
                min={
                  selectedConfigTemplateIndex > -1 &&
                  (listAdsConfigs[selectedConfigTemplateIndex].minDailyBudget
                    ? listAdsConfigs[selectedConfigTemplateIndex].minDailyBudget
                    : 0)
                }
                max={
                  selectedConfigTemplateIndex > -1 &&
                  (listAdsConfigs[selectedConfigTemplateIndex].maxDailyBudget
                    ? listAdsConfigs[selectedConfigTemplateIndex].maxDailyBudget
                    : 100)
                }
              />
            </Form.Item>

            <Form.Item
              className="mt-4 md:ml-4"
              name="totalBudget"
              label="Total budget"
              rules={[{ required: true, message: FIELD_REQUIRED }]}
            >
              <InputNumber
                className="!w-full"
                min={
                  selectedConfigTemplateIndex > -1 &&
                  (listAdsConfigs[selectedConfigTemplateIndex].minTotalBudget
                    ? listAdsConfigs[selectedConfigTemplateIndex].minTotalBudget
                    : 0)
                }
                max={
                  selectedConfigTemplateIndex > -1 &&
                  (listAdsConfigs[selectedConfigTemplateIndex].maxTotalBudget
                    ? listAdsConfigs[selectedConfigTemplateIndex].maxTotalBudget
                    : 500)
                }
              />
            </Form.Item>

            <Form.Item className="mt-4 md:ml-4" name="bid">
              <BidGroupForm
                form={form}
                type={BID_CPI_TYPE}
                activeKey={activeBidKey}
                setActiveKey={setActiveBidKey}
                bidGroups={bidGroups}
                setBidGroups={setBidGroups}
                allCountries={COUNTRIES}
                min={
                  selectedConfigTemplateIndex > -1 &&
                  (listAdsConfigs[selectedConfigTemplateIndex].minGeoBid
                    ? listAdsConfigs[selectedConfigTemplateIndex].minGeoBid
                    : 0)
                }
                max={
                  selectedConfigTemplateIndex > -1 &&
                  (listAdsConfigs[selectedConfigTemplateIndex].maxGeoBid
                    ? listAdsConfigs[selectedConfigTemplateIndex].maxGeoBid
                    : 10)
                }
              />
            </Form.Item>

            <div className={`${sessionTitle} mt-6`}>Campaign listings</div>
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
