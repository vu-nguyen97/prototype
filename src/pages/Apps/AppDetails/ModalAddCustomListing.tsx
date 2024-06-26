import Button from "antd/lib/button";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";
import Modal from "antd/lib/modal/Modal";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UploadAssets, {
  AssetsData,
  getAssets,
} from "../../../partials/common/Forms/UploadAssets";
import service from "../../../partials/services/axios.config";
import { getYtbUrlRule } from "../../../utils/Helpers";

function ModalAddCustomListing(props) {
  const [listFiles, setListFiles] = useState<AssetsData>({});
  const urlParams = useParams();
  const [form] = Form.useForm();
  const { isOpen, onClose, setIsLoading, setIsOpenModalAddApp, mainListing } =
    props;

  useEffect(() => {
    if (mainListing === null) return;

    form.setFieldsValue({
      appName: mainListing.appName,
      shortDescription: mainListing.shortDescription,
      fullDescription: mainListing.fullDescription,
      url: mainListing.youtubeVideoUrl,
    });
  }, [isOpen, mainListing]);

  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      form.resetFields();
    }, 300);
  };

  const onFinish = (values) => {
    const {
      apps,
      name,
      variantName,
      shortDescription,
      fullDescription,
      url,
      customURL,
    } = values;

    const formData = new FormData();

    formData.append("appId", urlParams.appId!);
    formData.append("listingName", name);
    formData.append("customUrl", customURL);
    formData.append("appName", "Monster Run");
    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", fullDescription);
    if (url) {
      formData.append("youtubeVideoUrl", url);
    }

    const assets = getAssets(listFiles);
    assets.forEach((el) => {
      formData.append("assets", el);
    });

    setIsLoading(true);
    service.post("/play-store/custom-listings", formData).then(
      (res: any) => {
        toast(res.message, { type: "success" });
        setIsLoading(false);
        setIsOpenModalAddApp(false);
        onCloseModal();
      },
      () => setIsLoading(false)
    );
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
        maskClosable={false}
        width={850}
        title="Add new store listing"
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
            form="FormAddNewStoreListing"
          >
            Save
          </Button>,
        ]}
      >
        <Form.Item
          name="name"
          label="Store listing name"
          rules={[
            { required: true, message: "Please enter Store Listing name" },
          ]}
        >
          <AntInput
            allowClear
            placeholder="Enter a name (max 30 characters)"
            className="w-full"
            maxLength={30}
          />
        </Form.Item>
        <Form.Item
          name="customURL"
          label="Custom listing URL"
          rules={[
            { required: true, message: "Please enter Custom Listing URL" },
          ]}
        >
          <AntInput
            allowClear
            placeholder="Enter the URL (max 30 characters)"
            className="w-full"
            maxLength={30}
          />
        </Form.Item>
        <Form.Item
          name="appName"
          label="App name"
          rules={[{ required: true, message: "Please enter app name" }]}
        >
          <AntInput
            allowClear
            placeholder="Enter the app name"
            className="w-full"
            maxLength={30}
          />
        </Form.Item>
        <Form.Item name="url" label="Youtube video URL" rules={getYtbUrlRule}>
          <AntInput
            allowClear
            placeholder="Enter an URL (max 50 characters)"
            className="w-full"
            maxLength={50}
          />
        </Form.Item>
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

        <UploadAssets
          label="Assets"
          listFiles={listFiles}
          onSetListFiles={setListFiles}
        />
      </Modal>
    </Form>
  );
}

ModalAddCustomListing.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setIsLoading: PropTypes.func,
  setIsOpenModalAddApp: PropTypes.func,
  mainListing: PropTypes.object,
};

export default ModalAddCustomListing;
