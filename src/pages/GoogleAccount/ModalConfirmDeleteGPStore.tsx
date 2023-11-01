import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
function ModalConfirmDeleteGPStore(props) {
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

    const onFinish = () => {
        setIsLoading(true)
        service.delete("/google-play-stores/" + data.id).then(
            (res: any) => {
              toast(res.message || "Delete Google Play Store success!", { type: "success" });
              setIsLoading(false);
            },
            () => setIsLoading(false)
          );
        window.location.reload();
    }
    
    return (
        <Form
            id="ModalConfirm"
            labelAlign="left"
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
        >
            <Modal
                title="Are you sure to delete this store?"
                open={isOpen}
                onCancel={onCloseModal}
                footer={[
                    <Button key="back" htmlType="button" onClick={onCloseModal}>
                        No
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        form="ModalConfirm"
                        onClick={onCloseModal}
                    >
                        Yes
                    </Button>,
                ]}
            >
            </Modal>
        </Form>
    );
}

ModalConfirmDeleteGPStore.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    setIsLoading: PropTypes.func,
    data: PropTypes.any
};

export default ModalConfirmDeleteGPStore;
