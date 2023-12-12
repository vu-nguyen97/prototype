import React, { useEffect, useState } from "react";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input/Input";
import { FIELD_REQUIRED } from "../../../constants/formMessage";
import DatePicker from "antd/lib/date-picker";
import { EXTRA_FOOTER } from "../../../constants/constants";
import Tag from "antd/lib/tag";
import {
  DATE_RANGE_FORMAT,
  onClickRangePickerFooter,
} from "../../../partials/common/Forms/RangePicker";
import moment from "moment";
import service from "../../../partials/services/axios.config";
import { toast } from "react-toastify";

function ModalEdit(props) {
  const [form] = Form.useForm();
  const { isOpen, onClose, data, setIsLoading, updateCb } = props;

  const [isOpenDateRange, setIsOpenDateRange] = useState(false);

  const initialValues = {};

  useEffect(() => {
    if (!data?.id) return;

    const { name, startDate, endDate } = data;
    form.setFieldsValue({
      campaignName: name,
      time: startDate && endDate ? [moment(startDate), moment(endDate)] : [],
    });
  }, [data]);

  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      form.resetFields();
    }, 300);
  };

  const onFinish = (values) => {
    const { campaignName, time } = values;
    const params = {
      name: campaignName,
      startDate: moment(time[0]).format(DATE_RANGE_FORMAT),
      endDate: moment(time[1]).format(DATE_RANGE_FORMAT),
    };

    setIsLoading(true);
    service.put(`/cpi-campaigns/${data.id}`, params).then(
      (res: any) => {
        setIsLoading(false);
        toast(res.message, { type: "success" });
        onCloseModal();
        updateCb();
      },
      () => setIsLoading(false)
    );
  };

  const formId = "FormEditCampaign";

  return (
    <Modal
      title={`Edit campaign ${data?.name}`}
      width={700}
      open={isOpen}
      maskClosable={false}
      onCancel={onCloseModal}
      footer={[
        <Button key="back" htmlType="button" onClick={onCloseModal}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" form={formId}>
          Edit
        </Button>,
      ]}
    >
      <Form
        id={formId}
        labelAlign="left"
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name="campaignName"
          label="Campaign name"
          rules={[{ required: true, message: FIELD_REQUIRED }]}
        >
          <AntInput allowClear placeholder="Enter campaign name" />
        </Form.Item>

        <Form.Item
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
                        (v) => form.setFieldValue("time", v),
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
      </Form>
    </Modal>
  );
}

export default ModalEdit;
