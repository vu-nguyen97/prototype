import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";
import { Select } from "antd";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function ModalAddGPStore(props) {
  const [form] = Form.useForm();
  const { isOpen, onClose, setIsLoading } = props;
  const [listContainer, setListContainer] = useState<any>([]);
  const navigate = useNavigate();

  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      form.resetFields();
    }, 300);
  };

  const onAddGPStore = (values) => {
    const { accountName, accountId, email } = values;
    setIsLoading(true);
    service
      .post("/google-play-stores", {
        name: accountName,
        id: accountId,
        email,
      })
      .then(
        (res: any) => {
          toast(
            res.message || "The developer account was added successfully!",
            { type: "success" }
          );
          setIsLoading(false);
          window.location.reload();
        },
        () => setIsLoading(false)
      );
  };
  return (
    <Form
      id="FormAddNewGPStore"
      labelAlign="left"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onAddGPStore}
    >
      <Modal
        title="Add New Developer Account"
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
            form="FormAddNewGPStore"
            onClick={onCloseModal}
          >
            Save
          </Button>,
        ]}
      >
        <Form.Item
          name="accountName"
          label="Account name"
          rules={[{ required: true, message: "Please enter account name" }]}
        >
          <AntInput allowClear placeholder="Enter a name" className="w-full" />
        </Form.Item>
        <Form.Item
          name="accountId"
          label="Account id"
          rules={[{ required: true, message: "Please enter account id" }]}
        >
          <AntInput
            allowClear
            placeholder="Enter an account id"
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter email" }]}
        >
          <AntInput
            allowClear
            placeholder="Enter an email"
            className="w-full"
          />
        </Form.Item>
      </Modal>
    </Form>
  );
}

ModalAddGPStore.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setIsLoading: PropTypes.func,
};

export default ModalAddGPStore;
