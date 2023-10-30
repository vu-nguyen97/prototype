import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";
import { Select } from 'antd';
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
function ModalAddGPStore(props) {
    const [form] = Form.useForm();
    const {
        isOpen,
        onClose,
        setIsLoading,
    } = props;
    const { Option } = Select;
    const [selectedValue, setSelectedValue] = useState(null);
    const [listContainer, setListContainer] = useState<any>([])
    const handleSelectChange = (value) => {
        setSelectedValue(value);
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
        const {accountName , email, container} = values;
        setIsLoading(true);
        service.post("/google-play-stores",{name: accountName,email, containerId: container}).then(
          (res: any) => {
            toast(res.message || "Add container success!", { type: "success" });
            setIsLoading(false);
          },
          () => setIsLoading(false)
        );
    } 
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
                title="Add New Google Play Store"
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
                        placeholder="Enter a Name (max 20 characters)"
                        className="w-full"
                        maxLength={20}
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Please enter email" }]}
                >
                    <AntInput
                        allowClear
                        placeholder="Enter an email (max 30 characters)"
                        className="w-full"
                        maxLength={30}
                    />
                </Form.Item>
                <Form.Item name="container" label="Container">
                <Select value={selectedValue} onChange={handleSelectChange}>
                    {listContainer.map((item) => (
                        <Option key={item.id} value={item.id}>
                        <h1>{item.ip}:{item.chromePort}:{item.vncPort}</h1>
                        </Option>
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
