import React, { useDeferredValue, useEffect, useState } from "react";
import Loading from "../../../utils/Loading";
import { Button, Form } from "antd";
import AntInput from "antd/lib/input";
import DynamicUpload from "../../../partials/common/Forms/DynamicUpload";
import service from "../../../partials/services/axios.config";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import ModalEditMainListing from "./ModalEditMainListing";
import Title from "antd/lib/typography/Title";
import { Typography, Space } from "antd";

const { Text } = Typography;

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

const MainStoreListing = () => {
  const [form] = Form.useForm();
  const urlParams = useParams();
  const [loading, setIsLoading] = useState(false);

  const [modalOpen, setIsModalOpen] = useState(false);

  const [mainListing, setMainListing] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    service
      .get("/main_listing?appId=" + urlParams.appId)
      .then(
        (res) => {
          if (res.results !== null) {
            setMainListing(res.results);
          }
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
          toast("Something went wrong", { type: "error" });
        }
      )
      .catch((error) => {
        console.log(error);
        toast(error.message, { type: "error" });
        setIsLoading(false);
      });
  }, []);
  
  const fetchMainStoreListing = () => {
    setIsLoading(true);
    service
      .get(
        "/fetch_main_listing?appId=" +
          urlParams.appId +
          "&developerId=4976312113699037823"
      )
      .then(
        (res: any) => {
          setIsLoading(false);
          toast("Success", { type: "success" });
        },
        () => {
          setIsLoading(false);
          toast("Something went wrong", { type: "error" });
        }
      )
      .catch((error) => {
        setIsLoading(false);
        toast(error.message, { type: "error" });
      });
  };

  return (
    <>
      {loading && <Loading />}
      <h1 style={{ fontSize: 40, fontWeight: "bold" }}>Main Store Listing</h1>

      {mainListing ? (
        <div className="bg-white p-5">
          <div className="flex gap-5 mb-4">
            <Button type="primary" onClick={() => fetchMainStoreListing()}>
              Fetch main store listing
            </Button>
          </div>
          <div className="px-6">
            <Title level={3}>App Name: </Title>
            <Text className="font-normal text-lg px-8">
              {mainListing.appName}
            </Text>
            <Title level={3}>Short Description:</Title>
            <Text className="font-normal text-lg px-8">
              {mainListing.shortDescription}
            </Text>
            <Title level={3}>Full Description:</Title>
            <div className="font-normal text-lg px-8 text-justify">
              {mainListing.fullDescription}
            </div>
            {mainListing.youtubeVideoUrl && (
              <>
                <Title level={3}>Youtube Video Url:</Title>
                <Text>{mainListing.youtubeVideoUrl}</Text>
              </>
            )}
            <Title level={3}>App Icon:</Title>
            <div className="flex justify-center">
              <img
                src={mainListing.appIconUrl}
                width={200}
                height={200}
                alt="App Icon"
              />
            </div>
            <Title className="mt-6" level={3}>
              Feature Graphic:
            </Title>
            <div className="flex justify-center">
              <img
                src={mainListing.featureGraphicUrl}
                width={200}
                height={200}
                alt="Feature Graphic"
              />
            </div>
            <Title level={3} className="mt-6">
              Phone Screenshots:
            </Title>
            <div className="flex flex-wrap justify-center">
              {mainListing.phoneScreenshotsUrl.map((el, index) => (
                <div key={index} className="p-2">
                  <img
                    src={el}
                    width={200}
                    height={200}
                    alt={`Phone Screenshot ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <Title level={3} className="mt-6">
              7-inch tablet Screenshots:
            </Title>
            <div className="flex flex-wrap justify-center">
              {mainListing.tablet7ScreenshotsUrl.map((el, index) => (
                <div key={index} className="p-2">
                  <img
                    src={el}
                    width={200}
                    height={200}
                    alt={`7-inch tablet Screenshot ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <Title level={3} className="mt-6">
              10-inch tablet Screenshots:
            </Title>
            <div className="flex flex-wrap justify-center">
              {mainListing.tablet10ScreenshotsUrl.map((el, index) => (
                <div key={index} className="p-2">
                  <img
                    src={el}
                    width={200}
                    height={200}
                    alt={`10-inch tablet Screenshot ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <ModalEditMainListing
            setIsLoading={setIsLoading}
            onClose={() => {
              setIsModalOpen(false);
            }}
            modalOpen={modalOpen}
          />
        </div>
      ) : (
        <div className="bg-white p-5">
          <div>
            <Button type="primary" onClick={() => fetchMainStoreListing()}>
              Fetch main store listing
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MainStoreListing;
