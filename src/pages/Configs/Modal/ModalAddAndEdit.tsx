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

function ModalAddAndEdit(props) {
  const [form] = Form.useForm();
  const { isOpen, onClose, onSubmit, setIsLoading } = props;

  // useEffect(() => {
  //   if (!editedRule?.id) return;

  //   const {
  //     countries,
  //   } = editedRule;

  //   form.setFieldsValue({
  //     name,
  //     countries,
  //   });
  // }, [editedRule?.id]);

  const initialValues = {
    name: "",
    totalBudget: 500,
    dailyBudget: 50,
    totalDay: 3,
    language: EN_LANGUAGE,
    countries: [],
  };

  const onCloseModal = () => {
    onClose();

    setTimeout(() => {
      form.resetFields();
    }, 300);
  };

  const onFinish = (values) => {
    const { name, totalBudget, dailyBudget, totalDay, language, countries } =
      values;

    console.log("values :>> ", values);

    // let params: any = {
    //   name,
    //   totalBudget,
    //   dailyBudget,
    //   totalDay,
    //   language,
    //   countries,
    // };

    // setIsLoading(true);
    // service.post("/rule-config", params).then(
    //   (res: any) => {
    //     toast(res.message, { type: "success" });
    //     setIsLoading(false);
    //     onCloseModal();
    //     onSubmit && onSubmit(res.results, !!editedRule?.id);
    //   },
    //   () => setIsLoading(false)
    // );
  };

  const isEditMode = false;
  const id = "FormAddAndEditConfig";

  return (
    <Form
      id={id}
      labelAlign="left"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Modal
        title={isEditMode ? "Edit config" : "Add new config"}
        open={isOpen}
        onCancel={onCloseModal}
        footer={[
          <Button key="back" htmlType="button" onClick={onCloseModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" form={id}>
            {isEditMode ? "Edit" : "Add"}
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
          name="countries"
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

ModalAddAndEdit.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  setIsLoading: PropTypes.func,
};

export default ModalAddAndEdit;
