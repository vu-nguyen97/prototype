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

  const {title, target} = props;

  const targetId = target === `APP` ? urlParams.id : urlParams.appId!;
  const endpoint = target === `APP` ? `/store-app-theme` : urlParams.appId!;


  

  const [isLoading, setIsLoading] = useState(false);
  const [listFiles, setListFiles] = useState<any>({});

  const initialValues = {
    name: "Falcon AI Assistant 2",
    shortDescription: "Lead the Crowd, Control of your Army, Clash the Enemies and Take Over the Castle",
    fullDescription: `Thrilling survival adventure! A thrilling racing experience that will have you on the edge of your seat until the very finish!
    Lead the Crowd, Control of your Army, Clash the Enemies and Take Over the Castle!
    
    COLLECT THE BIGGEST CROWD to become the strongest army
    Begin racing alone and gather others along the way to build a large crowd. Lead your army through a variety of obstacles that move, rotate, and grow. Build your tactics while on the run to save as many runners as possible.
    The bigger crowd you have, the more powerful the army.
    
    RACE THROUGH A VARIETY OF OBSTACLES
    Try to go far as much as possible you can in this crazy survival race! 
    Defend yourself against giant bosses with swinging axes.
    
    WIN IN THE FINAL CLASH
    Lead your army until you take over the castle at the level's finale. In the last fight, crush your opponents and take control of the stronghold.
    
    ~~~~~~~~~~~~~~~~~~
    💪 HOW TO PLAY
    ~~~~~~~~~~~~~~~~~~
    - GATHER as huge a crowd as you can to build your army
    - DODGE obstacles
    - COLLECT the special key
    - CLASH the enemies
    - FIGHT against giant bosses 
    - TAKE OVER the castles
    ~~~~~~~~~~~~~~~~~~
    
    ✨ GAME FEATURES
    ~~~~~~~~~~~~~~~~~~
    - Amazing Graphics Experience in this game from the user’s perspective
    - Well Game Play Control, When Our Army Cut the grass
    - Positive Move helps you to become a strong army and take over the other enemy.
    - Multiple Levels Added for best user experience
    - Deadly traps and impossible obstacles
    - Rewards and gifts
    
    Playing Amazing Games, Never Without Rest!
    And this is only the beginning... More levels, as well as clever traps and obstacles, are on the way!
    
    Do you believe you've got what it takes to lead your army through this crazy obstacle course? Take your chances today by downloading the game!`,
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
    formData.append("id", targetId!);
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
    service.post(endpoint, formData).then(
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

      <div className="font-bold text-base mb-4">{title}</div>
      <div className="max-w-5xl">
        <Form.Item
        className="font-bold"
          name="name"
          label="Name"
          rules={[{ required: true, message: FIELD_REQUIRED }]}
        >
          <AntInput
            allowClear
            placeholder="Enter a name (max 30 characters)"
            maxLength={30}
          />
        </Form.Item>

        <Form.Item
          className="font-bold"
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
        className="font-bold"
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
        <Form.Item className="font-bold" name="youtubeUrl" label="Youtube url">
          <AntInput allowClear placeholder="Enter a url" />
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
      </div>

      <Button type="primary" key="submit" htmlType="submit" form={id}>
        Save
      </Button>
    </Form>
  );
}

NewTheme.propTypes = {
  target: String,
  title: String,
  endpoint: String
};

export default NewTheme;
