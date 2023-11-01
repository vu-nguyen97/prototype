import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import { Select } from 'antd';
function ModalEditGPStore(props) {
    const [form] = Form.useForm();
    const {
        isOpen,
        onClose,
        setIsLoading,
        data
    } = props;
    const { Option } = Select;
    const [selectedValue, setSelectedValue] = useState(data.container);
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
        if (!data?.id) return;
        let val = data.container.id;
        setSelectedValue(val)
        const { name, email } = data;
        
        form.setFieldsValue({
          name,
          email,
        });
        setIsLoading(true);
        service.get("/chrome-standalone-containers").then(
            (res: any) => {
              setListContainer(res.results);
              setIsLoading(false);
            },
            () => setIsLoading(false)
          );
      }, [data?.id]);
    

      const onEditContainer = (values) => {
        const {name, email, container} = values;
        setIsLoading(true)
        service.put("/google-play-stores/" + data.id,{name, email, containerId: container}).then(
            (res: any) => {
              toast(res.message || "Edit Google Play Store success!", { type: "success" });
              setIsLoading(false);
            },
            () => setIsLoading(false)
          );
        window.location.reload();
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
                title="Edit Google Play Store"
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
                    <AntInput
                        allowClear
                        className="w-full"
                        maxLength={20}
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Please enter Email" }]}
                >
                    <AntInput
                        allowClear
                        className="w-full"
                        maxLength={20}
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

ModalEditGPStore.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    setIsLoading: PropTypes.func,
    data: PropTypes.any
};

export default ModalEditGPStore;
