import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";
import DynamicUpload from "../../../partials/common/Forms/DynamicUpload";

const ASSET_FIELDS = [
    {
        field: "iconImg",
        label: "App icon",
        note: "Must be a PNG or JPEG, up to 1 MB, 512 px by 512 px.",
    },
    {
        field: "featureImg",
        label: "Feature graphic",
        note: "Your feature graphic must be a PNG or JPEG, up to 15 MB, and 1,024 px by 500px.",
    },
    {
        field: "phoneScreenshots",
        label: "Phone screenshots",
        note: "Upload 2-8 phone screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840 px.",
        multiple: true,
    },
    {
        field: "sevenInchScreenshots",
        label: "7-inch tablet screenshots",
        note: "Upload up to eight 7-inch tablet screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840 px.",
        multiple: true,
    },
    {
        field: "tenInchScreenshots",
        label: "10-inch tablet screenshots",
        note: "Upload up to eight 10-inch tablet screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 1,080 px and 7,680 px.",
        multiple: true,
    },
];
function ModalAddStoreListing(props) {
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

    const onSetListFiles = (fieldName, files) => {
        const newListFiles = { ...listFiles };
        newListFiles[fieldName] = files;
        setListFiles(newListFiles);
    };
    const onFinish = () => {
    };

    const onSubmit = () => {

    };

    return (
        <Form
            id="FormAddNewStoreListing"
            labelAlign="left"
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
        >
            <Modal
                title="Add New Store Listing"
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
                        form="FormAddNewCpiCampaign"
                    >
                        Save
                    </Button>,
                ]}
            >

                <Form.Item
                    name="name"
                    label="Store Listing name"
                    rules={[{ required: true, message: "Please enter Store Listing name" }]}
                >
                    <AntInput
                        allowClear
                        placeholder="Enter a name (max 30 characters)"
                        className="w-full"
                        maxLength={30}
                    />
                </Form.Item>
                <Form.Item
                    name="url"
                    label="URL"
                    rules={[{ required: true, message: "Please enter URL" }]}
                >
                    <AntInput
                        allowClear
                        placeholder="Enter an URL (max 30 characters)"
                        className="w-full"
                        maxLength={30}
                    />
                </Form.Item>
                <Form.Item
                    name="shortDescription"
                    label="Short description"
                    rules={[{ required: true, message: "Please enter short description" }]}
                >
                    <AntInput.TextArea
                        rows={2}
                        placeholder="Enter content (max 80 characters)"
                        maxLength={80}
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    name="fullDescription"
                    label="Full description"
                    rules={[{ required: true, message: "Please anter full description" }]}
                >
                    <AntInput.TextArea
                        rows={3}
                        placeholder="Enter content (max 4000 characters)"
                        maxLength={4000}
                        allowClear
                    />
                </Form.Item>
                {ASSET_FIELDS.map((el) => {
                    const { field, label, note, multiple } = el;
                    return (
                        <DynamicUpload
                            key={field}
                            className={'font-bold'}
                            field={field}
                            label={label}
                            note={note}
                            multiple={multiple}
                            listFiles={listFiles[field] || []}
                            onSetListFiles={onSetListFiles}
                        />
                    );
                })}
            </Modal>
        </Form>
    );
}

ModalAddStoreListing.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    setIsLoading: PropTypes.func,
};

export default ModalAddStoreListing;
