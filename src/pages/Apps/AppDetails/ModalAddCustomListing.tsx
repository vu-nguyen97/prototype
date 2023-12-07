import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal/Modal";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";
import DynamicUpload from "../../../partials/common/Forms/DynamicUpload";
import service from "../../../partials/services/axios.config";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

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
function ModalAddCustomListing(props) {
  const [listFiles, setListFiles] = useState<any>({});
  const urlParams = useParams();
  const [form] = Form.useForm();
  const { isOpen, onClose, setIsLoading, setIsOpenModalAddApp, mainListing } =
    props;

  useEffect(() => {
    if (mainListing === null) return;

    console.log("mainListing", mainListing);
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

  const onSetListFiles = (fieldName, files) => {
    const newListFiles = { ...listFiles };
    newListFiles[fieldName] = files;
    setListFiles(newListFiles);
  };
  const onFinish = (values) => {
    console.log("values", values);
    const {
      apps,
      name,
      variantName,
      shortDescription,
      fullDescription,
      url,
      customURL,
    } = values;

    const {
      // featureImg,
      // iconImg,
      // phoneScreenshots,
      // sevenInchScreenshots,
      // tenInchScreenshots,
      assets,
    } = listFiles;

    const formData = new FormData();

    formData.append("appId", urlParams.appId);
    formData.append("listingName", name);
    formData.append("customUrl", customURL);
    formData.append("appName", "Monster Run");
    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", fullDescription);
    if (url) {
      formData.append("youtubeVideoUrl", url);
    }

    assets.forEach((el) => {
      formData.append("assets", el);
    });

    // formData.append("featureGraphic", featureImg[0]);
    // formData.append("appIcon", iconImg[0]);
    // phoneScreenshots.forEach((el) => {
    //   formData.append("phoneScreenshots", el);
    // });
    // console.log(phoneScreenshots.length);
    // sevenInchScreenshots.forEach((el) => {
    //   formData.append("tablet7Screenshots", el);
    // });
    // console.log(sevenInchScreenshots.length);
    // tenInchScreenshots.forEach((el) => {
    //   formData.append("tablet10Screenshots", el);
    // });
    // console.log(tenInchScreenshots.length);

    service.post("/play-store/custom-listings", formData).then(
      (res: any) => {
        toast(res.message, { type: "success" });
        setIsLoading(false);
        setIsOpenModalAddApp(false);
      },
      (err) => {
        setIsLoading(false);
        toast(err, { type: "error" });
      }
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
        width={"50%"}
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
            form="FormAddNewStoreListing"
          >
            Save
          </Button>,
        ]}
      >
        <Form.Item
          name="name"
          label="Store Listing name"
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
          label="Custom Listing URL"
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
          label="App Name"
          rules={[{ required: true, message: "Please enter app name" }]}
        >
          <AntInput
            allowClear
            placeholder="Enter the app name"
            className="w-full"
            maxLength={30}
          />
        </Form.Item>
        <Form.Item
          name="url"
          label="Youtube Video URL"
          rules={[{ required: false, message: "Please enter URL" }]}
        >
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
        <DynamicUpload
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

ModalAddCustomListing.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  setIsLoading: PropTypes.func,
  setIsOpenModalAddApp: PropTypes.func,
  mainListing: PropTypes.object,
};

export default ModalAddCustomListing;
