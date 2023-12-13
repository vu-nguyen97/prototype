import React, { useEffect } from "react";
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
  DEFAULT_BID_STEP,
  DEFAULT_BUDGET_STEP,
} from "../../../constants/constants";
import Select from "antd/lib/select";
import service from "../../../partials/services/axios.config";
import AntInput from "antd/lib/input/Input";
import SelectCountryFromList from "../../../partials/common/Forms/SelectCountryFromList";
import { COUNTRIES } from "../../../constants/countries";
import { LANGUAGES } from "../../../constants/languages";

function ModalEdit(props) {
  const [form] = Form.useForm();
  const { isOpen, onClose, data, setIsLoading, setConfigs } = props;

  useEffect(() => {
    if (!data?.id) return;

    const { name, totalBudget, dailyBudget, totalDay, bids, language } = data;
    let bid;
    let country;
    if (bids?.length) {
      bid = bids[0].bid;
      country = bids.map((el) => el.country);
    }

    form.setFieldsValue({
      name,
      totalBudget,
      dailyBudget,
      totalDay,
      bid,
      language,
      country,
    });
  }, [data?.id]);

  const onFinish = (values) => {
    const { bid } = values;
    let bids: any = [];

    values.country.forEach((country) => {
      bids.push({ country, bid });
    });

    const params = {
      ...values,
      type: "DEFAULT",
      bids,
      bid: undefined,
      country: undefined,
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
  setIsLoading: PropTypes.func,
  setConfigs: PropTypes.func,
  data: PropTypes.any,
};

export default ModalEdit;
