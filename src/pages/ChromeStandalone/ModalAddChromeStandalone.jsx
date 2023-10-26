import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";

function ModalAddChromeStandalone(props) {
    const [listFiles, setListFiles] = useState({});
    const [form] = Form.useForm();
    const {
        isOpen,
        onClose,
        setIsLoading,
    } = props;
    const onCloseModal = () => {
        onClose();
        setTimeout(() => {
            form.resetFields();
        }, 300);
    };

    const onFinish = () => {
    };

    const onSubmit = () => {
        console.log("submit");
    };

    return (
        <Form
            id="FormAddNewContainer"
            labelAlign="left"
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            onSubmit={onSubmit}
        >
            <Modal
                title="Add New Container"
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
                        form="FormAddNewContainer"
                    >
                        Save
                    </Button>,
                ]}
            >

                <Form.Item
                    name="ip"
                    label="Container IP"
                    rules={[{ required: true, message: "Please enter Container IP" }]}
                >
                    <AntInput
                        allowClear
                        placeholder="Enter an IP (max 20 characters)"
                        className="w-full"
                        maxLength={20}
                    />
                </Form.Item>
                <Form.Item
                    name="chromePort"
                    label="Chrome Port"
                    rules={[{ required: true, message: "Please enter Chrome port" }]}
                >
                    <AntInput
                        allowClear
                        placeholder="Enter an URL (max 20 characters)"
                        className="w-full"
                        maxLength={20}
                    />
                </Form.Item>
                <Form.Item
                    name="vncPort"
                    label="VNC Port"
                    rules={[{ required: true, message: "Please enter VNC port" }]}
                >
                    <AntInput.TextArea
                        rows={2}
                        placeholder="Enter content (max 20 characters)"
                        maxLength={20}
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    name="vncPassword"
                    label="VNC Password"
                    rules={[{ required: true, message: "Please anter VNC password" }]}
                >
                    <AntInput.TextArea
                        rows={3}
                        placeholder="Enter content (max 20 characters)"
                        maxLength={20}
                        allowClear
                    />
                </Form.Item>
            </Modal>
        </Form>
    );
}

ModalAddChromeStandalone.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    setIsLoading: PropTypes.func,
};

export default ModalAddChromeStandalone;
