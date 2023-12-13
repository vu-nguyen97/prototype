import { Button, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import service from "../../../partials/services/axios.config";
import AntInput from "antd/lib/input";
import DynamicUpload from "../../../partials/common/Forms/DynamicUpload";
import Loading from "../../../utils/Loading";
import Modal from "antd/lib/modal";
import { getYtbUrlRule } from "../../../utils/Helpers";

export default function EditMainStoreListing({ isOpen, onClose, mainListing }) {
  const [form] = Form.useForm();
  const [listFiles, setListFiles] = useState<any>({});
  const urlParams = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!Object.keys(mainListing || {}).length || !isOpen) return;
    form.setFieldsValue({
      shortDescription: mainListing.shortDescription,
      fullDescription: mainListing.fullDescription,
      url: mainListing.youtubeVideoUrl,
    });
  }, [isOpen, mainListing]);

  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      form.resetFields();
      setListFiles({});
    }, 300);
  };

  const onSetListFiles = (fieldName, files) => {
    const newListFiles = { ...listFiles };
    newListFiles[fieldName] = files;
    setListFiles(newListFiles);
  };

  const onFinish = (values) => {
    const { shortDescription, fullDescription, url } = values;
    const { assets } = listFiles;

    const formData = new FormData();
    formData.append("appId", urlParams.appId!);
    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", fullDescription);

    if (url) {
      formData.append("youtubeVideoUrl", url);
    }
    if (assets?.length) {
      assets.forEach((el) => {
        formData.append("assets", el);
      });
    }

    setIsLoading(true);
    service.post("/main_listing", formData).then(
      (res: any) => {
        toast(res.message, { type: "success" });
        setIsLoading(false);
        onCloseModal();
      },
      (err) => setIsLoading(false)
    );
  };

  return (
    <Form
      id="EditMainListingForm"
      labelAlign="left"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onFinish}
    >
      <Modal
        title="Edit main store listing"
        maskClosable={false}
        width={900}
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
            form="EditMainListingForm"
          >
            Save
          </Button>,
        ]}
      >
        {isLoading && <Loading />}
        <Form.Item
          name="shortDescription"
          label="Short description"
          rules={[
            { required: true, message: "Please enter short description" },
          ]}
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
          rules={[{ required: true, message: "Please enter full description" }]}
        >
          <AntInput.TextArea
            rows={10}
            placeholder="Enter content (max 4000 characters)"
            maxLength={4000}
            allowClear
          />
        </Form.Item>
        <Form.Item name="url" label="Youtube Video URL" rules={getYtbUrlRule}>
          <AntInput
            allowClear
            placeholder="Enter an URL (max 50 characters)"
            className="w-full"
            maxLength={50}
          />
        </Form.Item>
        <DynamicUpload
          isRequireMark={false}
          field={"assets"}
          label={"Assets"}
          multiple={true}
          listFiles={listFiles["assets"] || []}
          onSetListFiles={onSetListFiles}
        />
      </Modal>
    </Form>
  );
}
