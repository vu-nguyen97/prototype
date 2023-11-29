import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import { Select } from "antd";

function ModalEditGPStore(props) {
  const [form] = Form.useForm();
  const { isOpen, onClose, setIsLoading, data } = props;

  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      form.resetFields();
    }, 300);
  };

  useEffect(() => {
    if (!data?.id) return;
    const { name, email } = data;
    form.setFieldsValue({
      name,
      email,
    });
  }, [data?.id]);

  const onEditContainer = (values) => {
    const { name, email, container } = values;
    setIsLoading(true);
    service
      .put("/google-play-stores/" + data.id, {
        name,
        email,
        containerId: container,
      })
      .then(
        (res: any) => {
          toast(res.message || "Edit Google Play Store success!", {
            type: "success",
          });
          setIsLoading(false);
          window.location.reload();
        },
        () => setIsLoading(false)
      );
  };
  return (
    <Form
      id="ModalEdit"
      labelAlign="left"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onEditContainer}
    >
      <Modal
        title="Edit Developer Account"
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
            form="ModalEdit"
            onClick={onCloseModal}
          >
            Save
          </Button>,
        ]}
      >
        <Form.Item
          name="name"
          label="Account Name"
          rules={[{ required: true, message: "Please enter Account name" }]}
        >
          <AntInput allowClear className="w-full" maxLength={20} />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter Email" }]}
        >
          <AntInput allowClear className="w-full" maxLength={20} />
        </Form.Item>
      </Modal>
    </Form>
  );
}

ModalEditGPStore.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setIsLoading: PropTypes.func,
  data: PropTypes.any,
};

export default ModalEditGPStore;
