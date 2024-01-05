import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import InputNumber from "antd/lib/input-number";
import { toast } from "react-toastify";
import {
  COUNTRY_REQUIRED,
  CURRENCY_REQUIRED,
  VALUE_REQUIRED,
} from "../../../constants/formMessage";
import {
  BID_CPI_TYPE,
  DEFAULT_BID_STEP,
  DEFAULT_BUDGET_STEP,
} from "../../../constants/constants";
import Select from "antd/lib/select";
import service from "../../../partials/services/axios.config";
import AntInput from "antd/lib/input/Input";
import SelectCountryFromList from "../../../partials/common/Forms/SelectCountryFromList";
import { COUNTRIES } from "../../../constants/countries";
import { LANGUAGES } from "../../../constants/languages";
import BidGroupForm from "../../AddCampaign/components/BidGroupForm";
import { defaultGroups } from "../../AddCampaign/constants";
import { BidGroup } from "../../AddCampaign/interface";

function ModalEdit(props) {
  const [form] = Form.useForm();
  const { isOpen, onClose, data, setIsLoading, setConfigs } = props;

  const [activeBidKey, setActiveBidKey] = useState<any>([defaultGroups[0].id]);
  const [bidGroups, setBidGroups] = useState<BidGroup[]>(defaultGroups);

  const [minMaxConfig, setMinMaxConfig] = useState({
    minTotalBudget: 0,
    maxTotalBudget: 0,
    minDailyBudget: 0,
    maxDailyBudget: 0,
    minGeoBid: 0,
    maxGeoBid: 0,
  });

  useEffect(() => {
    if (!data?.id) return;

    const {
      name,
      totalBudget,
      dailyBudget,
      totalDay,
      bids,
      language,
      minDailyBudget,
      maxDailyBudget,
      minTotalBudget,
      maxTotalBudget,
      minGeoBid,
      maxGeoBid,
    } = data;
    let bid;
    let country;
    if (bids?.length) {
      bid = bids[0].bid;
      country = bids.map((el) => el.country);
    }

    setMinMaxConfig({
      minTotalBudget,
      maxTotalBudget,
      minDailyBudget,
      maxDailyBudget,
      minGeoBid,
      maxGeoBid,
    });

    const bidGroups = data?.bids?.map((item, index) => {
      return {
        id: index,
        countries: [item.country],
        bid: item.bid,
      };
    });

    setBidGroups(bidGroups);

    form.setFieldsValue({
      name,
      totalBudget,
      dailyBudget,
      totalDay,
      bid,
      language,
      country,
      minTotalBudget,
      maxTotalBudget,
      minDailyBudget,
      maxDailyBudget,
      minGeoBid,
      maxGeoBid,
    });
  }, [data?.id]);

  useEffect(() => {
    if (!minMaxConfig) return;
    console.log(minMaxConfig);
    form.setFields([
      {
        name: "minTotalBudget",
        warnings:
          minMaxConfig.minTotalBudget > 200 ? ["Watch out this value"] : [],
      },
      {
        name: "maxTotalBudget",
        warnings:
          minMaxConfig.maxTotalBudget > 200 ? ["Watch out this value"] : [],
      },
      {
        name: "minDailyBudget",
        warnings:
          minMaxConfig.minDailyBudget > 200 ? ["Watch out this value"] : [],
      },
      {
        name: "maxDailyBudget",
        warnings:
          minMaxConfig.maxDailyBudget > 200 ? ["Watch out this value"] : [],
      },
    ]);
  }, [minMaxConfig]);

  const onFinish = (values) => {
    const { bid } = values;
    let bids: any = [];

    bidGroups.forEach((group) => {
      const { countries, bid } = group;
      if (countries?.length) {
        countries.forEach((country) => {
          bids.push({ country, bid });
        });
      }
    });

    const params = {
      ...values,
      type: "DEFAULT",
      bids,
    };

    setIsLoading(true);
    service.put("/config/" + data.id, params).then(
      (res: any) => {
        setIsLoading(false);
        onCloseModal();
        toast(res.message || "Edit config success!", { type: "success" });
        setConfigs((prev) =>
          prev.map((el) => {
            if (el.id === data.id) return { ...el, ...params };
            return el;
          })
        );
      },
      () => setIsLoading(false)
    );
  };

  const onCloseModal = () => {
    onClose();
  };

  return (
    <Form
      id="ModalEditConfig"
      labelAlign="left"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onFinish}
    >
      <Modal
        title={"Edit config"}
        open={isOpen}
        onCancel={onCloseModal}
        footer={[
          <Button key="back" htmlType="button" onClick={onCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            form="ModalEditConfig"
          >
            Save
          </Button>,
        ]}
      >
        <Form.Item
          name="name"
          label="Config name"
          rules={[{ required: true, message: VALUE_REQUIRED }]}
        >
          <AntInput allowClear placeholder="Enter a name" />
        </Form.Item>

        <Form.Item
          label="Total budget"
          name="totalBudget"
          rules={[{ required: true, message: VALUE_REQUIRED }]}
        >
          <InputNumber min={0} step={DEFAULT_BUDGET_STEP} className="!w-full" />
        </Form.Item>

        <div className="flex gap-5">
          <Form.Item
            label="Min total budget"
            name="minTotalBudget"
            rules={[
              {
                required: true,
                message: VALUE_REQUIRED,
              },
            ]}
            className="flex-1"
          >
            <InputNumber
              min={0}
              step={DEFAULT_BUDGET_STEP}
              className="!w-full"
              onChange={(e) => {
                if (!e) return;
                setMinMaxConfig((prev) => ({
                  ...prev,
                  minTotalBudget: e,
                }));
              }}
            />
          </Form.Item>

          <Form.Item
            label="Max total budget"
            name="maxTotalBudget"
            rules={[{ required: true, message: VALUE_REQUIRED }]}
            className="flex-1"
          >
            <InputNumber
              min={0}
              step={DEFAULT_BUDGET_STEP}
              className="!w-full"
              onChange={(e) => {
                if (!e) return;
                setMinMaxConfig((prev) => ({
                  ...prev,
                  maxTotalBudget: e,
                }));
              }}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Daily budget"
          name="dailyBudget"
          rules={[{ required: true, message: VALUE_REQUIRED }]}
        >
          <InputNumber min={0} step={DEFAULT_BUDGET_STEP} className="!w-full" />
        </Form.Item>

        <div className="flex gap-5">
          <Form.Item
            label="Min daily budget"
            name="minDailyBudget"
            rules={[
              {
                required: true,
                message: VALUE_REQUIRED,
              },
            ]}
            className="flex-1"
          >
            <InputNumber
              min={0}
              step={DEFAULT_BUDGET_STEP}
              className="!w-full"
              onChange={(e) => {
                if (!e) return;
                setMinMaxConfig((prev) => ({
                  ...prev,
                  minDailyBudget: e,
                }));
              }}
            />
          </Form.Item>

          <Form.Item
            label="Max daily budget"
            name="maxDailyBudget"
            rules={[{ required: true, message: VALUE_REQUIRED }]}
            className="flex-1"
          >
            <InputNumber
              min={0}
              step={DEFAULT_BUDGET_STEP}
              className="!w-full"
              onChange={(e) => {
                if (!e) return;
                setMinMaxConfig((prev) => ({
                  ...prev,
                  maxDailyBudget: e,
                }));
              }}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Total day"
          name="totalDay"
          rules={[{ required: true, message: VALUE_REQUIRED }]}
        >
          <InputNumber min={0} className="!w-full" />
        </Form.Item>

        <Form.Item
          name="language"
          label="Language"
          rules={[{ required: true, message: CURRENCY_REQUIRED }]}
        >
          <Select className="w-full">
            {LANGUAGES?.map((el) => (
              <Select.Option value={el.code} key={el.code}>
                {el.name} ({el.code.toUpperCase()})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Bid"
          name="bid"
          rules={[{ required: true, message: VALUE_REQUIRED }]}
        >
          <BidGroupForm
            form={form}
            type={BID_CPI_TYPE}
            activeKey={activeBidKey}
            setActiveKey={setActiveBidKey}
            bidGroups={bidGroups}
            setBidGroups={setBidGroups}
            allCountries={COUNTRIES}
          />
        </Form.Item>
      </Modal>
    </Form>
  );
}

ModalEdit.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setIsLoading: PropTypes.func,
  setConfigs: PropTypes.func,
  data: PropTypes.any,
};

export default ModalEdit;
