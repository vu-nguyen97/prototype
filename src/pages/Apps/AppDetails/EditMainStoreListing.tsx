import { Button, Form } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import service from "../../../partials/services/axios.config";
import AntInput from "antd/lib/input";
import DynamicUpload from "../../../partials/common/Forms/DynamicUpload";
import Loading from "../../../utils/Loading";

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

export default function EditMainStoreListing() {
  const [form] = Form.useForm();
  const [listFiles, setListFiles] = useState<any>({});
  const urlParams = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const onSetListFiles = (fieldName, files) => {
    const newListFiles = { ...listFiles };
    newListFiles[fieldName] = files;
    setListFiles(newListFiles);
  };

  const onFinish = (values) => {
    console.log("values", values);
    const { shortDescription, fullDescription, url } = values;

    const {
      featureImg,
      iconImg,
      phoneScreenshots,
      sevenInchScreenshots,
      tenInchScreenshots,
    } = listFiles;

    const formData = new FormData();

    formData.append("developerId", "4976312113699037823");
    formData.append("appId", urlParams.appId);
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

    form.resetFields();
  };
  return (
    <>
      {isLoading && <Loading />}
      <h1 style={{ fontSize: 40, fontWeight: "bold" }}>
        Edit main store listing
      </h1>
      <div className="flex justify-center">
        <div className="w-[100%] bg-white p-5">
          <Form
            id="MainListingForm"
            labelAlign="left"
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
          >
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
            {ASSET_FIELDS.map((el) => {
              const { field, label, note, multiple } = el;
              return (
                <DynamicUpload
                  key={field}
                  className={"font-bold"}
                  field={field}
                  label={label}
                  note={note}
                  multiple={multiple}
                  listFiles={listFiles[field] || []}
                  onSetListFiles={onSetListFiles}
                />
              );
            })}
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}