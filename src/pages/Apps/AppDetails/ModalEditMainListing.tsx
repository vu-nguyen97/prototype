import { Button, Form, Modal } from "antd";
import React, { useState } from "react";
import service from "../../../partials/services/axios.config";
import { toast } from "react-toastify";
import AntInput from "antd/lib/input";
import DynamicUpload from "../../../partials/common/Forms/DynamicUpload";
import { useParams } from "react-router-dom";
import { getYtbUrlRule } from "../../../utils/Helpers";

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

export default function ModalEditMainListing(props) {
  const { modalOpen, setIsLoading, onClose } = props;

  const [form] = Form.useForm();
  const [listFiles, setListFiles] = useState<any>({});
  const urlParams = useParams();

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
    onCloseModal();
    const { shortDescription, fullDescription, url } = values;

    const {
      featureImg,
      iconImg,
      phoneScreenshots,
      sevenInchScreenshots,
      tenInchScreenshots,
    } = listFiles;

    const formData = new FormData();

    formData.append("appId", urlParams.appId!);
    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", fullDescription);
    if (url) {
      formData.append("youtubeVideoUrl", url);
    }

    formData.append("featureGraphic", featureImg[0]);
    formData.append("appIcon", iconImg[0]);
    phoneScreenshots.forEach((el) => {
      formData.append("phoneScreenshots", el);
    });
    console.log(phoneScreenshots.length);
    sevenInchScreenshots.forEach((el) => {
      formData.append("tablet7Screenshots", el);
    });
    console.log(sevenInchScreenshots.length);
    tenInchScreenshots.forEach((el) => {
      formData.append("tablet10Screenshots", el);
    });
    console.log(tenInchScreenshots.length);

    service.post("/main_listing", formData).then(
      (res: any) => {
        console.log("main");
        toast("Success", { type: "success" });
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        toast(err, { type: "error" });
      }
    );
  };
  return (
    <Form
      id="MainListingForm"
      labelAlign="left"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onFinish}
    >
      <Modal
        width={"70%"}
        onCancel={onCloseModal}
        open={modalOpen}
        title="Edit main store listing"
        footer={[
          <Button key="back" htmlType="button" onClick={onCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            form="MainListingForm"
          >
            Save
          </Button>,
        ]}
      >
        <div className="bg-white p-5">
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
            rules={[
              { required: true, message: "Please anter full description" },
            ]}
          >
            <AntInput.TextArea
              rows={3}
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
          {ASSET_FIELDS.map((el) => {
            const { field, label, note, multiple } = el;
            return (
              <DynamicUpload
                key={field}
                field={field}
                label={label}
                note={note}
                multiple={multiple}
                listFiles={listFiles[field] || []}
                onSetListFiles={onSetListFiles}
              />
            );
          })}
        </div>
      </Modal>
    </Form>
  );
}
