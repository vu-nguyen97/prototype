import Button from "antd/lib/button";
import Form from "antd/lib/form";
import InputNumber from "antd/lib/input-number";
import AntInput from "antd/lib/input/Input";
import Modal from "antd/lib/modal/Modal";
import Select from "antd/lib/select";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  BID_CPI_TYPE,
  DEFAULT_BUDGET_STEP,
} from "../../../constants/constants";
import { COUNTRIES } from "../../../constants/countries";
import {
  CURRENCY_REQUIRED,
  VALUE_REQUIRED,
} from "../../../constants/formMessage";
import { LANGUAGES } from "../../../constants/languages";
import service from "../../../partials/services/axios.config";
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
    if (!isOpen) return;
    form.setFieldsValue({
      ...data,
    });
    setMinMaxConfig({
      minTotalBudget: Number(data.minTotalBudget),
      maxTotalBudget: Number(data.maxTotalBudget),
      minDailyBudget: Number(data.minDailyBudget),
      maxDailyBudget: Number(data.maxDailyBudget),
      minGeoBid: Number(data.minGeoBid),
      maxGeoBid: Number(data.maxGeoBid),
    });
    setBidGroups(
      data?.bids?.map((item, index) => {
        return {
          id: index,
          countries: [item.country],
          bid: item.bid,
        };
      })
    );
    warnBidCap("minTotalBudget");
    warnBidCap("maxTotalBudget");
    warnBidCap("minDailyBudget");
    warnBidCap("maxDailyBudget");
  }, [isOpen]);

  const onFinish = (values) => {
    let falsy = false;
    form.getFieldsError().forEach((err) => {
      if (err.errors.length) {
        falsy = true;
        return;
      }
    });
    falsy = validateMinMaxValue();
    if (falsy) {
      return;
    }

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
        width={"40%"}
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
              onBlur={() => warnBidCap("minDailyBudget")}
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
              onBlur={() => warnBidCap("maxDailyBudget")}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Daily budget"
          name="dailyBudget"
          rules={[{ required: true, message: VALUE_REQUIRED }]}
        >
          <InputNumber
            min={minMaxConfig.minDailyBudget}
            max={minMaxConfig.maxDailyBudget}
            step={DEFAULT_BUDGET_STEP}
            className="!w-full"
          />
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
              onBlur={() => warnBidCap("minTotalBudget")}
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
              onBlur={() => warnBidCap("maxTotalBudget")}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Total budget"
          name="totalBudget"
          rules={[{ required: true, message: VALUE_REQUIRED }]}
        >
          <InputNumber
            min={minMaxConfig.minTotalBudget}
            max={minMaxConfig.maxTotalBudget}
            step={DEFAULT_BUDGET_STEP}
            className="!w-full"
          />
        </Form.Item>

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

        <div className="flex gap-5">
          <Form.Item
            label="Min geo bid"
            name="minGeoBid"
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
                  minGeoBid: e,
                }));
              }}
            />
          </Form.Item>

          <Form.Item
            label="Max geo bid"
            name="maxGeoBid"
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
                  maxGeoBid: e,
                }));
              }}
            />
          </Form.Item>
        </div>

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
            min={minMaxConfig.minGeoBid}
            max={minMaxConfig.maxGeoBid}
          />
        </Form.Item>
      </Modal>
    </Form>
  );

  function validateMinMaxValue() {
    let falsy = false;
    if (
      Number(form.getFieldValue("minTotalBudget")) >
      Number(form.getFieldValue("maxTotalBudget"))
    ) {
      falsy = true;
      form.setFields([
        {
          name: "maxTotalBudget",
          errors: ["Min value should be less than max value"],
        },
      ]);
    }
    if (
      Number(form.getFieldValue("minDailyBudget")) >
      Number(form.getFieldValue("maxDailyBudget"))
    ) {
      falsy = true;
      form.setFields([
        {
          name: "maxDailyBudget",
          errors: ["Min value should be less than max value"],
        },
      ]);
    }
    if (
      Number(form.getFieldValue("minGeoBid")) >
      Number(form.getFieldValue("maxGeoBid"))
    ) {
      falsy = true;
      form.setFields([
        {
          name: "maxGeoBid",
          errors: ["Min value should be less than max value"],
        },
      ]);
    }
    if (
      Number(form.getFieldValue("dailyBudget")) >
      Number(form.getFieldValue("totalBudget"))
    ) {
      falsy = true;
      form.setFields([
        {
          name: "totalBudget",
          errors: ["Daily budget should not be more than total budget"],
        },
      ]);
    }
    return falsy;
  }

  function warnBidCap(field) {
    form.setFields([
      {
        name: field,
        warnings: minMaxConfig[field] > 200 ? ["Watch out this value"] : [],
      },
    ]);
  }
}

ModalEdit.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setIsLoading: PropTypes.func,
  setConfigs: PropTypes.func,
  data: PropTypes.any,
};

export default ModalEdit;
