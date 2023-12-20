import Button from "antd/lib/button";
import Form from "antd/lib/form";
import AntInput from "antd/lib/input";
import Modal from "antd/lib/modal/Modal";
import Select from "antd/lib/select";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FIELD_REQUIRED } from "../../../constants/formMessage";
import DynamicUpload, {
  getUploadRule,
} from "../../../partials/common/Forms/DynamicUpload";
import service from "../../../partials/services/axios.config";
import { getYtbUrlRule } from "../../../utils/Helpers";
import Loading from "../../../utils/Loading";
import {
  AssetNotes,
  getDefaultReleaseNote,
  getFullDescription,
  getShortDescription,
} from "./Helpers";

function ModalAddRelease(props) {
  const [form] = Form.useForm();
  const { isOpen, onClose, listStores } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [listFiles, setListFiles] = useState<any>({});
  const [addingRelease, setAddingRelease] = useState(false);

  const initialValues = {};

  useEffect(() => {
    if (!isOpen || !listStores?.length) return;
    form.setFieldValue("developerId", listStores[0].id);
  }, [isOpen, listStores]);

  const onCloseModal = () => {
    onClose();

    setTimeout(() => {
      form.resetFields();
      setListFiles({});
    }, 300);
  };

  const onChangeAppName = () => {
    const appName = form.getFieldValue("appName");
    // const releaseName = form.getFieldValue("releaseName");
    // const releaseNote = form.getFieldValue("releaseNote");

    if (!appName) return;
    form.setFields([
      {
        name: "releaseName",
        value: appName + moment().format(" MM-DD-YYYY"),
        errors: [],
      },
      {
        name: "releaseNote",
        value: getDefaultReleaseNote(appName),
        errors: [],
      },
      {
        name: "shortDescription",
        value: getShortDescription(appName),
        errors: [],
      },
      {
        name: "fullDescription",
        value: getFullDescription(appName),
        errors: [],
      },
    ]);
  };

  const onSetListFiles = (fieldName, files) => {
    const newListFiles = { ...listFiles };
    newListFiles[fieldName] = files;
    setListFiles(newListFiles);
    form.setFields([{ name: fieldName, errors: [] }]);
  };

  const onFinish = (values) => {
    const {
      appName,
      releaseName,
      releaseNote,
      developerId,
      fullDescription,
      shortDescription,
      url,
    } = values;
    const formData = new FormData();

    formData.append("developerId", developerId);
    formData.append("appName", appName);
    formData.append("releaseName", releaseName);
    formData.append("countryNotes", releaseNote);
    formData.append("file", listFiles["file"][0] as Blob);

    formData.append("shortDescription", shortDescription);
    formData.append("fullDescription", fullDescription);
    if (url) {
      formData.append("youtubeUrl", url);
    }

    listFiles["assets"].forEach((el) => {
      formData.append("assets", el);
    });

    // setAddingRelease(true)
    setIsLoading(true);
    service.post("/release", formData).then(
      (res: any) => {
        toast(res.message, { type: "success" });
        setIsLoading(false);
        onCloseModal();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      () => setIsLoading(false)
    );
  };

  return (
    <Form
      id="FormAddNewRelease"
      labelAlign="left"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onFinish}
      initialValues={initialValues}
    >
      {isLoading && <Loading />}
      <Modal
        title="Add new release"
        open={isOpen}
        width={850}
        onCancel={onCloseModal}
        footer={[
          <Button key="back" htmlType="button" onClick={onCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            form="FormAddNewRelease"
          >
            Save
          </Button>,
        ]}
      >
        <div className="font-semibold text-base mb-2">Store information</div>
        <Form.Item
          name="developerId"
          label="Store"
          rules={[{ required: true, message: "Please select a store" }]}
        >
          <Select showSearch placeholder="Select a store">
            {listStores.map((item: any) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="appName"
          label="App name"
          rules={[{ required: true, message: FIELD_REQUIRED }]}
        >
          <AntInput
            allowClear
            className="w-full"
            placeholder="Enter app name"
            onChange={onChangeAppName}
          />
        </Form.Item>
        <Form.Item
          name="releaseName"
          label="Release name"
          rules={[{ required: true, message: FIELD_REQUIRED }]}
        >
          <AntInput
            allowClear
            className="w-full"
            placeholder="Enter release name"
          />
        </Form.Item>
        <Form.Item
          name="releaseNote"
          label="Release note"
          rules={[{ required: true, message: "Please enter Release Notes" }]}
        >
          <AntInput.TextArea
            allowClear
            rows={5}
            placeholder="Enter release notes"
          />
        </Form.Item>
        <Form.Item
          name="file"
          label="Bundle"
          rules={[getUploadRule(listFiles["file"], "Please select a bundle")]}
        >
          <DynamicUpload
            wrapperClass=""
            isShowLabel={false}
            field="file"
            onSetListFiles={onSetListFiles}
            listFiles={listFiles["file"] || []}
            accept=".aab, .AAB"
          />
        </Form.Item>

        <div className="font-semibold text-base mt-4 mb-2">Store listing</div>
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
          rules={[{ required: true, message: "Please anter full description" }]}
        >
          <AntInput.TextArea
            rows={10}
            placeholder="Enter content (max 4000 characters)"
            maxLength={4000}
            allowClear
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
          name="assets"
          label={<span>Assets {AssetNotes}</span>}
          rules={[getUploadRule(listFiles["assets"], "Please select assets")]}
        >
          <DynamicUpload
            wrapperClass=""
            isShowLabel={false}
            multiple
            field="assets"
            onSetListFiles={onSetListFiles}
            listFiles={listFiles["assets"] || []}
            accept=".png, .jpg, .jpeg"
          />
        </Form.Item>
      </Modal>
    </Form>
  );
}

ModalAddRelease.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  listStores: PropTypes.array,
};

export default ModalAddRelease;
