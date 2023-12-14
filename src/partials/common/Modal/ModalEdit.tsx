import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal";
import Form from "antd/lib/form";
import {
  NUMBER_PLACEHOLDER,
  VALUE_REQUIRED,
} from "../../../constants/formMessage";
import InputNumber from "antd/lib/input-number";
import { checkMaximumValue } from "../../../utils/Helpers";
import { toast } from "react-toastify";
import service from "../../services/axios.config";
import Loading from "../../../utils/Loading";
import {
  DEFAULT_BID_STEP,
  EDIT_NUMBER_MODE,
} from "../../../constants/constants";
import { confirmValue } from "../../../utils/helper/UIHelper";

function ModalEdit(props) {
  const [form] = Form.useForm();
  const { isOpen, onClose, editedBid, editCallback } = props;

  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    bid: 0,
  };

  useEffect(() => {
    if (!isOpen || !Object.keys(editedBid || {}).length) return;

    const { bid } = editedBid;
    form.setFieldsValue({ bid });
  }, [isOpen, editedBid]);

  const onCloseModal = () => {
    onClose();

    setTimeout(() => {
      form.resetFields();
    }, 300);
  };

  const onFinish = (values) => {
    const { bid } = values;
    const isShowConfirm = checkMaximumValue(
      bid,
      editedBid.bid,
      EDIT_NUMBER_MODE.value
    );

    if (isShowConfirm) {
      confirmValue(() => handleChangeBid(values));
    } else {
      handleChangeBid(values);
    }
  };

  const handleChangeBid = (values) => {
    const { bid } = values;
    const params = { ...editedBid, bid };

    setIsLoading(true);
    service.put("/bid", params).then(
      (res: any) => {
        res.message && toast(res.message, { type: "success" });
        setIsLoading(false);
        onCloseModal();
        editCallback && editCallback(res.results);
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  const id = "FormEditBid";

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
      {isLoading && <Loading />}

      <Modal
        title="Edit bid"
        open={isOpen}
        onCancel={onCloseModal}
        footer={[
          <Button key="back" htmlType="button" onClick={onCloseModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" form={id}>
            Save
          </Button>,
        ]}
      >
        <Form.Item
          label="Bid"
          name="bid"
          rules={[{ required: true, message: VALUE_REQUIRED }]}
        >
          <InputNumber
            min={0}
            step={DEFAULT_BID_STEP}
            placeholder={NUMBER_PLACEHOLDER}
            className="!w-full"
            onChange={(value) => form.setFieldsValue({ bid: value })}
          />
        </Form.Item>
      </Modal>
    </Form>
  );
}

ModalEdit.defaultProps = {
  editedBid: {},
};

ModalEdit.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  editCallback: PropTypes.func,
  editedBid: PropTypes.object,
};

export default ModalEdit;
