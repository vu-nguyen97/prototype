import React, { useEffect, useState } from "react";
import Form from "antd/lib/form";
import Select from "antd/lib/select";
import { LONG_TIME } from "../../constants";
import { FAKED } from "../../../../constants/constants";
import ModalAddCreative from "./ModalAddCreative/ModalAddCreative";
import CreativeTable from "./CreativeTable";
import { backActionHook } from "../../Helpers";
import VideoPopup from "../../../../partials/common/Modal/VideoPopup";
import ImagePreview from "../../../../partials/common/Modal/ImagePreview";
import DynamicUpload from "../../../../partials/common/Forms/DynamicUpload";

function Step3(props) {
  const [form] = Form.useForm();
  const { next, stepData, setIsLoading, onPrev, countBackAction } = props;

  const [isAddCreatives, setIsAddCreatives] = useState(false);
  const [creatives, setCreatives] = useState<any>([]);

  const [previewData, setPreviewData] = useState({});
  const [imgPreview, setImgPreview] = useState<any>({});

  const [creativeUpload, setCreativeUpload] = useState<any>({});
  const creativeField = "creativeUploadEl";

  const initialValues = {
    timeLabelEl: FAKED,
    deliveryMode: LONG_TIME,
    creativeEl: FAKED,
  };

  backActionHook(form, onPrev, countBackAction, { creatives });

  useEffect(() => {
    const initData = stepData?.step3;
    if (initData) {
      const { creatives, creativeFiles } = initData;
      setCreatives(creatives);
      console.log('creativeFiles', creativeFiles)
      setCreativeUpload(creativeFiles || {});
      form.setFieldsValue(initData);
    }
  }, [stepData]);

  const onSetCreativeListFiles = (fieldName, files: any[]) => {
    const newListFiles = { ...creativeUpload };
    newListFiles[fieldName] = files;

    console.log(stepData);

    setCreativeUpload(newListFiles);
    console.log(newListFiles);
  };

  const handleAddCreatives = (newCreatives) => {
    const newList = [...creatives];
    newCreatives.forEach((el) => {
      const isExist = newList.some((data) => el.id === data.id);
      if (!isExist || !newList?.length) {
        newList.push(el);
      }
    });
    setCreatives(newList);
  };

  const handleDelete = (ids) => {
    const newList = creatives.filter((el) => !ids.includes(el.id));
    setCreatives(newList);
  };

  const onFinish = (values) => {
    console.log(
      "values :>> ",
      values,
      creatives,
      creativeUpload[creativeField]
    );

    next({
      ...values,
      creatives,
      creativeFiles: creativeUpload[creativeField],
    });
  };

  return (
    <Form
      id="FormStep3"
      labelAlign="left"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onFinish}
      initialValues={initialValues}
      className="!mb-6"
    >
      <Form.Item
        label="Creative Packs"
        name="creativeEl"
        className="!h-0 !-mb-2"
      >
        <Select className="!hidden" />
      </Form.Item>

      <Form.Item label={<></>} className="overflow-x-auto">
        <CreativeTable
          handleAdd={() => setIsAddCreatives(true)}
          handleDelete={handleDelete}
          data={creatives}
          setImgPreview={setImgPreview}
          setPreviewData={setPreviewData}
        />
      </Form.Item>

      <Form.Item label="Creative">
        <DynamicUpload
          className="font-bold"
          field={creativeField}
          multiple
          accept={".png, .jpeg, .mp4"}
          listFiles={creativeUpload[creativeField] || []}
          onSetListFiles={onSetCreativeListFiles}
        />
      </Form.Item>

      <ModalAddCreative
        className="-mt-1"
        isOpen={isAddCreatives}
        onClose={() => setIsAddCreatives(false)}
        // activedApp={activedApp}
        handleAddCreatives={handleAddCreatives}
        setIsLoading={setIsLoading}
        setImgPreview={setImgPreview}
        setPreviewData={setPreviewData}
      />

      <VideoPopup
        onClose={() => setPreviewData({})}
        previewData={previewData}
      />
      <ImagePreview imgPreview={imgPreview} setImgPreview={setImgPreview} />
    </Form>
  );
}

export default Step3;
