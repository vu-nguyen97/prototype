import {
  Badge,
  Button,
  Descriptions,
  Typography
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TimeAgo from "react-timeago";
import { toast } from "react-toastify";
import service from "../../../partials/services/axios.config";
import Loading from "../../../utils/Loading";
import Page from "../../../utils/composables/Page";

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
  const urlParams = useParams();
  const [loading, setIsLoading] = useState(false);

  const [modalOpen, setIsModalOpen] = useState(false);

  const [mainListing, setMainListing] = useState<any>(null);

  const [task, setTask] = useState<any>();

  const items = [
    {
      key: "1",
      label: "App Name",
      children: mainListing?.appName,
      span: 2,
    },
    {
      key: "9",
      label: "Youtube Video",
      children: (
        <a href={mainListing?.youtubeVideoUrl} target="_blank">
          {mainListing?.youtubeVideoUrl}
        </a>
      ),
      span: 2,
    },
    {
      key: "10",
      label: "Status",
      children: (
        <>
          {mainListing?.status === "Live" ? (
            <Badge status="success" text={mainListing?.status} />
          ) : mainListing?.status === "Changes in review" ? (
            <Badge status="processing" text={mainListing?.status} />
          ) : (
            <Badge status="error" text={mainListing?.status} />
          )}
        </>
      ),
      span: 2,
    },
    {
      key: "11",
      label: "Main Listing URL",
      children: (
        <a href="https://example.com" target="_blank">
          https://example.com
        </a>
      ),
      span: 2,
    },
    {
      key: "2",
      label: "Short Description",
      children: mainListing?.shortDescription,
      span: 4,
    },
    {
      key: "3",
      label: "Full Description",
      children: mainListing?.fullDescription,
      span: 4,
    },

    {
      key: "4",
      label: "App Icon",
      children: (
        <img
          src={mainListing?.appIconUrl}
          alt={mainListing?.appName}
          className="w-[200px] h-[200px]"
        />
      ),
      span: 2,
    },
    {
      key: "5",
      label: "Feature Graphic",
      children: (
        <img src={mainListing?.featureGraphicUrl} alt={mainListing?.appName} />
      ),
      span: 2,
    },
    {
      key: "6",
      label: "Phone Screenshots",
      children: (
        <div className="flex gap-2 flex-wrap">
          {mainListing?.phoneScreenshotsUrl?.map((el, idx) => (
            <img
              key={idx}
              src={el}
              alt={mainListing?.appName}
              className="max-w-[200px]"
            />
          ))}
        </div>
      ),
      span: 4,
    },
    {
      key: "7",
      label: "7-inch tablet screenshots",
      children: (
        <div className="flex gap-2 flex-wrap">
          {mainListing?.tablet7ScreenshotsUrl?.map((el, idx) => (
            <img
              key={idx}
              src={el}
              alt={mainListing?.appName}
              className="max-w-[200px]"
            />
          ))}
        </div>
      ),
      span: 4,
    },
    {
      key: "8",
      label: "10-inch tablet screenshots",
      children: (
        <div className="flex gap-2 flex-wrap">
          {mainListing?.tablet10ScreenshotsUrl?.map((el, idx) => (
            <img
              key={idx}
              src={el}
              alt={mainListing?.appName}
              className="max-w-[200px]"
            />
          ))}
        </div>
      ),
      span: 4,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    axios
      .all([
        service.get("/main_listing?appId=" + urlParams.appId),
        service.get("/main_listing_last_sync?appId=" + urlParams.appId),
      ])
      .then(
        axios.spread((res1: any, res2: any) => {
          setIsLoading(false);
          setMainListing(res1.results);
          setTask(res2.results);
        })
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
      .get("/fetch_main_listing?appId=" + urlParams.appId)
      .then(
        (res: any) => {
          toast(res.message, { type: "success" });
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
  };

  return (
    <Page>
      {loading && <Loading />}
      <h1 style={{ fontSize: 40, fontWeight: "bold" }}>Main Store Listing</h1>
      <div className="bg-white p-3">
        <div className="flex gap-4 items-center mb-4">
          <Button
            type="primary"
            onClick={() => fetchMainStoreListing()}
            loading={
              task
                ? task.state === "RUNNING" || task.state === "CREATED"
                : false
            }
          >
            Fetch main store listing
          </Button>
          <span className="text-md font-[500] flex gap-1">
            <span>Last Sync: </span>
            {task ? (
              task.state === "FAILED" ? (
                "Last sync failed"
              ) : (
                <TimeAgo date={task ? task.createdAt : 0} />
              )
            ) : (
              "None"
            )}
          </span>
        </div>
        {mainListing && (
          <Descriptions bordered column={4} labelStyle={{ fontWeight: "bold" }}>
            {items.map((el, idx) => (
              <Descriptions.Item key={el.key} label={el.label} span={el.span}>
                {el.children}
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </div>
    </Page>
  );
};

export default MainStoreListing;
