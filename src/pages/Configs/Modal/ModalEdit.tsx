import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import InputNumber from "antd/lib/input-number";
import { toast } from "react-toastify";
import {
  APP_REQUIRED,
  COUNTRY_REQUIRED,
  CURRENCY_REQUIRED,
  VALUE_REQUIRED,
} from "../../../constants/formMessage";
import SelectCountry from "../../../partials/common/Forms/SelectCountry";
import {
  ALL_APP_OPTION,
  DEFAULT_BID,
  DEFAULT_BID_STEP,
  DEFAULT_BUDGET,
  DEFAULT_BUDGET_STEP,
  USD,
} from "../../../constants/constants";
import Select from "antd/lib/select";
import service from "../../../partials/services/axios.config";
import SelectStoreApp, {
  getActivedApp,
} from "../../../partials/common/Forms/SelectStoreApp";
import AntInput from "antd/lib/input/Input";
import SelectCountryFromList from "../../../partials/common/Forms/SelectCountryFromList";
import { COUNTRIES } from "../../../constants/countries";
import { EN_LANGUAGE, LANGUAGES } from "../../../constants/languages";

function ModalEdit(props) {
  const [form] = Form.useForm();
  const { isOpen, onClose, data } = props;
  useEffect(() => {
    if (!data?.id) return;

    const { name, totalBudget, dailyBudget, totalDay, bids, language } = data;
    const bid = bids[0].bid;
    const country = bids[0].country;
    form.setFieldsValue({
      name,
      totalBudget,
      dailyBudget,
      totalDay,
      bid,
      language,
      country
    });
    
  }, [data?.id]);

  const onFinish = (values) => {
    console.log(values)
    const request = {
      language: values.language,
      type: "DEFAULT",
      bids: [{
        bid: values.bid,
        country: values.country,
      }],
      dailyBudget: values.dailyBudget,
      totalBudget: values.totalBudget,
      totalDay: values.totalDay,
      name: values.name
    }
    service.put("/config/"+data.id,request).then(
      (res: any) => {
        toast(res.message || "Edit config success!", { type: "success" });
      },
    );
    window.location.reload();
  }

  const onCloseModal = () => {
    onClose();

    setTimeout(() => {
    }, 300);
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
          <Button key="submit" type="primary" htmlType="submit" form="ModalEditConfig" onClick={onCloseModal}>
            Edit
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
        <Form.Item
          label="Daily budget"
          name="dailyBudget"
          rules={[{ required: true, message: VALUE_REQUIRED }]}
        >
          <InputNumber min={0} step={DEFAULT_BUDGET_STEP} className="!w-full" />
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
        <Form.Item
          name="country"
          label="Countries"
          rules={[{ required: true, message: COUNTRY_REQUIRED }]}
        >
          <SelectCountryFromList listCountries={COUNTRIES} />
        </Form.Item>

        <Form.Item
          label="Bid"
          name="bid"
          rules={[{ required: true, message: VALUE_REQUIRED }]}
        >
          <InputNumber min={0} step={DEFAULT_BID_STEP} className="!w-full" />
        </Form.Item>
      </Modal>
    </Form>
  );
}

ModalEdit.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onFinish: PropTypes.func,
  setIsLoading: PropTypes.func,
  data: PropTypes.any
};

export default ModalEdit;
