import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";
import { Select } from "antd";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
function ModalAddGPStore(props) {
  const [form] = Form.useForm();
  const { isOpen, onClose, setIsLoading } = props;
  const [selectedValue, setSelectedValue] = useState(null);
  const [listContainer, setListContainer] = useState<any>([]);
  const navigate = useNavigate();
  const handleSelectChange = (value) => {
    setSelectedValue(value);
    console.log(value);
  };

  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      form.resetFields();
    }, 300);
  };
  useEffect(() => {
    setIsLoading(true);
    service.get("/chrome-standalone-containers").then(
      (res: any) => {
        setListContainer(res.results);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  }, []);

  const onAddGPStore = (values) => {
    
    const { accountName, accountId, email, container } = values;
    console.log(values);
    setIsLoading(true);
    service
      .post("/google-play-stores", {
        name: accountName,
        id: accountId,
        email,
        containerId: container,
      })
      .then(
        (res: any) => {
          toast(res.message || "Add container success!", { type: "success" });
          setIsLoading(false);
        },
        () => setIsLoading(false)
      );
      const con = listContainer.find((obj) => obj.id === container);
      navigate("/vnc-viewer", { state: {ip: con.ip, vncPort: con.vncPort,  vncPassword: con.vncPassword} });
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
          label="Account Name"
          rules={[{ required: true, message: "Please enter Account Name" }]}
        >
          <AntInput
            allowClear
            placeholder="Enter a Name"
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          name="accountId"
          label="Account Id"
          rules={[{ required: true, message: "Please enter Account ID" }]}
        >
          <AntInput
            allowClear
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
        <Form.Item name="container" label="Container">
          <Select value={selectedValue} onChange={handleSelectChange} className="w-full">
            {listContainer.map((item) => (
              <Select.Option key={item.id} value={item.id}>            
                  http://{item.ip}:{item.vncPort}            
              </Select.Option>
            ))}
          </Select>
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
