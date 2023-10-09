import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button/button";
import Form from "antd/lib/form";
import { FIELD_REQUIRED } from "../../../../constants/formMessage";
import AntInput from "antd/lib/input";
import { useParams } from "react-router-dom";
import DynamicUpload from "../../../../partials/common/Forms/DynamicUpload";
import Loading from "../../../../utils/Loading";
import service from "../../../../partials/services/axios.config";
import { toast } from "react-toastify";

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

function NewTheme(props) {
  const [form] = Form.useForm();
  const urlParams = useParams();
  const {} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [listFiles, setListFiles] = useState<any>({});

  const initialValues = {
    name: "Theme 1",
    shortDescription: "Vu",
    fullDescription: "Vu full",
    youtubeUrl: "",
  };

  const onSetListFiles = (fieldName, files: any[]) => {
    const newListFiles = { ...listFiles };
    newListFiles[fieldName] = files;

    setListFiles(newListFiles);
  };

  const onFinish = (values) => {
    const { name, shortDescription, fullDescription, youtubeUrl } = values;

    const {
      featureImg,
      iconImg,
      phoneScreenshots,
      sevenInchScreenshots,
      tenInchScreenshots,
    } = listFiles;

    const formData = new FormData();
    formData.append("campaignId", urlParams.appId!);
    formData.append("name", name);
    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", fullDescription);
    formData.append("youtubeUrl", youtubeUrl);

    formData.append("featureImg", featureImg[0]);
    formData.append("iconImg", iconImg[0]);
    phoneScreenshots.forEach((el) => {
      formData.append("phoneScreenshots", el);
    });
    sevenInchScreenshots.forEach((el) => {
      formData.append("sevenInchScreenshots", el);
    });
    tenInchScreenshots.forEach((el) => {
      formData.append("tenInchScreenshots", el);
    });

    setIsLoading(true);
    service.post("/themes", formData).then(
      (res: any) => {
        toast(res.message, { type: "success" });
        setIsLoading(false);
        console.log("res :>> ", res);
        // onCloseModal();
      },
      () => setIsLoading(false)
    );
  };

  const id = "FormAddTheme";

  return (
    <Form
      id={id}
      labelAlign="left"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onFinish}
      initialValues={initialValues}
    >
      {isLoading && <Loading />}

      <div className="font-bold text-base mb-4">Add new theme</div>
      <div className="max-w-5xl">
        <Form.Item
          name="name"
          label="Theme name"
          rules={[{ required: true, message: FIELD_REQUIRED }]}
        >
          <AntInput
            allowClear
            placeholder="Enter a name (max 30 characters)"
            maxLength={30}
          />
        </Form.Item>

        <Form.Item
          name="shortDescription"
          label="Short description"
          rules={[{ required: true, message: FIELD_REQUIRED }]}
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
          rules={[{ required: true, message: FIELD_REQUIRED }]}
        >
          <AntInput.TextArea
            rows={3}
            placeholder="Enter content (max 4000 characters)"
            maxLength={4000}
            allowClear
          />
        </Form.Item>
        <Form.Item name="youtubeUrl" label="Youtube url">
          <AntInput allowClear placeholder="Enter a url" />
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

      <Button type="primary" key="submit" htmlType="submit" form={id}>
        Add
      </Button>
    </Form>
  );
}

NewTheme.propTypes = {};

export default NewTheme;
