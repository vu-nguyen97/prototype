import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "antd/lib/button/button";
import Form from "antd/lib/form";
import Collapse from "antd/lib/collapse/collapse";
import Space from "antd/lib/space/index";
import Radio from "antd/lib/radio/radio";

import { FIELD_REQUIRED } from "../../../constants/formMessage";
import AntInput from "antd/lib/input";
import { useParams } from "react-router-dom";
import DynamicUpload from "../../../partials/common/Forms/DynamicUpload";
import Loading from "../../../utils/Loading";
import service from "../../../partials/services/axios.config";
import { toast } from "react-toastify";
import SelectStoreApp, {
  getActivedApp,
} from "../../../partials/common/Forms/SelectStoreApp";
import StoreAppIcon from "../../../partials/common/StoreAppIcon";
import SelectCustomListing from "../../../partials/common/Forms/SelectCustomListing";

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

function NewVariant(props) {
  const [form] = Form.useForm();
  const { Panel } = Collapse;

  const urlParams = useParams();

  const {
    viewOnlyMode = false,
    data,
    title,
    target,
    pickedVariant,
    idx,
    consoleAppId
  } = props;

  // const app = data.storeApp;

  const [listCustomListings, setListCustomListings] = useState<object[]>();
  const [selectedApps, setSelectedApps] = useState<object[]>();
  const [isLoading, setIsLoading] = useState(false);
  // const [listFiles, setListFiles] = useState<any>({});
  const [activeKey, setActiveKey] = useState<string[] | string>("");
  // const [showCollapse, setShowCollapse] = useState(false);
  const [radioValue, setRadioValue] = useState("KEEP");
  // const [variantNameValue, setVariantNameValue] = useState();

  const targetId = target === `APP` ? urlParams.id : urlParams.appId!;
  const endpoint =
    target === `APP`
      ? `/store-app-theme`
      : "/cpi-campaigns/app-variants?campaignId=" + urlParams.appId!;

  const initialValues = {
    variantName: "Falcon AI Assistant 2",
    shortDescription:
      "Lead the Crowd, Control of your Army, Clash the Enemies and Take Over the Castle",
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

  // const onSetListFiles = (fieldName, files: any[]) => {
  //   const newListFiles = { ...listFiles };
  //   newListFiles[fieldName] = files;

  //   setListFiles(newListFiles);
  // };

  const onFinish = (values) => {
    console.log("values", values);
    const { listing } = values;
    console.log("listing", listing);
    const storeApp = getActivedApp(listCustomListings, listing);
    const storeAppId = storeApp.id;

    const formData = new FormData();

    formData.append("customListingId", listing);

    setIsLoading(true);

    service.post(endpoint, formData).then(
      (res: any) => {
        toast(res.message, { type: "success" });
        setIsLoading(false);
        window.location.reload();
      },
      () => setIsLoading(false)
    );
  };

  const fetchCustomListings = () => {
    setIsLoading(true);
    const params = {};
    const appId = consoleAppId; //MONSTER RUN APP ID
    service.get("/" + appId + "/custom_listings", { params }).then(
      (res: any) => {
        setIsLoading(false);
        // check if res.results element already existed in pickedVariant, if not then add to list
        let allCustomListings = res.results;

        let toBeAddedCustomListings = [];
        if (allCustomListings) {
          for (let i = 0; i < allCustomListings.length; i++) {
            let exist = false;
            for (let j = 0; j < pickedVariant?.length; j++) {
              if (
                allCustomListings[i].id === pickedVariant[j].customListing.id
              ) {
                exist = true;
              }
            }
            if (!exist) {
              toBeAddedCustomListings.push(allCustomListings[i]);
            }
          }
        }
        setListCustomListings(toBeAddedCustomListings);
      },
      () => setIsLoading(false)
    );
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    // setShowCollapse(value === 'CHANGE');
    setRadioValue(value);
  };

  const onCollapseChange = () => {};

  useEffect(() => {
    if (viewOnlyMode) return;
    fetchCustomListings();
  }, []);

  const id = "FormAddVariant" + idx;

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

      {!viewOnlyMode && (
        <>
          <Form.Item
            name="listing"
            label="Custom Listing"
            className="font-bold mb-4 max-w-5xl"
            rules={[{ required: true, message: FIELD_REQUIRED }]}
          >
            <SelectCustomListing
              isMultiple={false}
              listApp={listCustomListings}
              placeholder="Please choose a custom listing."
              activedApp={selectedApps}
              setActivedApp={(apps) => {
                setSelectedApps(apps);
                form.setFieldValue("listing", apps);
              }}
              onFocusFunc={fetchCustomListings}
            />
          </Form.Item>
          <Button type="primary" key="submit" htmlType="submit" form={id}>
            Save
          </Button>
        </>
      )}
      {viewOnlyMode && (
        <>
          <div className="flex items-center grow truncate">
            <div className="ml-5 grow truncate">
              <div className="text-base sm:text-lg md:text-xl font-bold !text-black overflow-auto whitespace-normal line-clamp-2">
                {data.customListing.listingName}
              </div>
              <a href={data.customListing.customUrl} target="_blank">{data.customListing.customUrl}</a>
            </div>
          </div>
        </>
      )}
    </Form>
  );
}

NewVariant.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  viewOnlyMode: PropTypes.bool,
  target: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.objectOf(PropTypes.any),
  endpoint: PropTypes.objectOf(PropTypes.any),
  pickedVariant: PropTypes.arrayOf(PropTypes.any),
  idx: PropTypes.number,
  consoleAppId: PropTypes.string,
};

export default NewVariant;
