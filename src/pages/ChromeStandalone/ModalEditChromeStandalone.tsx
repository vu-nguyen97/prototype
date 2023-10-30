import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
function ModalEditChromeStandalone(props) {
    const [form] = Form.useForm();
    const {
        isOpen,
        onClose,
        setIsLoading,
        data
    } = props;
    const onCloseModal = () => {
        onClose();
        setTimeout(() => {
            form.resetFields();
        }, 300);
    };
    useEffect(() => {
        if (!data?.id) return;
    
        const { ip, chromePort, vncPort, vncPassword } = data;
        
        form.setFieldsValue({
          ip,
          chromePort,
          vncPort,
          vncPassword
        });
        
      }, [data?.id]);
    

      const onEditContainer = (values) => {
        const {ip, chromePort, vncPort, vncPassword} = values;
        setIsLoading(true)
        service.put("/chrome-standalone-containers/" + data.id,{ip, chromePort, vncPort, vncPassword}).then(
            (res: any) => {
              toast(res.message || "Edit container success!", { type: "success" });
              setIsLoading(false);
            },
            () => setIsLoading(false)
          );
    }
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
                title="Edit Container"
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
                    name="ip"
                    label="Container IP"
                    rules={[{ required: true, message: "Please enter Container IP" }]}
                >
                    <AntInput
                        allowClear
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
                        maxLength={20}
                        allowClear
                    />
                </Form.Item>
            </Modal>
        </Form>
    );
}

ModalEditChromeStandalone.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    setIsLoading: PropTypes.func,
    data: PropTypes.any
};

export default ModalEditChromeStandalone;
