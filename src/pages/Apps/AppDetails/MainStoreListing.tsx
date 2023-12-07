import { Badge, Button, Descriptions, Typography } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TimeAgo from "react-timeago";
import { toast } from "react-toastify";
import service from "../../../partials/services/axios.config";
import Loading from "../../../utils/Loading";
import Page from "../../../utils/composables/Page";
import AntInput from "antd/lib/input";
import ImagePreview, {
  ImgFile,
} from "../../../partials/common/Modal/ImagePreview";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import EditMainStoreListing from "./EditMainStoreListing";

const MainStoreListing = () => {
  const urlParams = useParams();
  const [loading, setIsLoading] = useState(false);

  const [imgPreview, setImgPreview] = useState<ImgFile>({});
  const [mainListing, setMainListing] = useState<any>();
  const [isEdit, setIsEdit] = useState(false);

  const [task, setTask] = useState<any>();

  const getViewableImg = (url, classNames = "") => (
    <img
      src={url}
      title="Click to view this image"
      alt={mainListing?.appName}
      className={`cursor-pointer ${classNames}`}
      onClick={() => setImgPreview({ url })}
    />
  );

  const viewListImgs = (list) => {
    if (!list?.length) return <></>;

    return (
      <div className="flex gap-2 flex-wrap">
        {list.map((el, idx) => (
          <React.Fragment key={idx}>
            {getViewableImg(el, "max-w-[200px]")}
          </React.Fragment>
        ))}
      </div>
    );
  };

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
      children: (
        <AntInput.TextArea
          className="!p-0 !border-0 !ring-0 !outline-0 !outline-transparent"
          readOnly
          rows={10}
          value={mainListing?.fullDescription}
        />
      ),
      span: 4,
    },
    {
      key: "4",
      label: "App Icon",
      children: getViewableImg(
        mainListing?.appIconUrl,
        "w-[200px] h-[200px] object-cover"
      ),
      span: 2,
    },
    {
      key: "5",
      label: "Feature Graphic",
      children: getViewableImg(mainListing?.featureGraphicUrl, "object-cover"),
      span: 2,
    },
    {
      key: "6",
      label: "Phone Screenshots",
      children: viewListImgs(mainListing?.phoneScreenshotsUrl),
      span: 4,
    },
    {
      key: "7",
      label: "7-inch tablet screenshots",
      children: viewListImgs(mainListing?.tablet7ScreenshotsUrl),
      span: 4,
    },
    {
      key: "8",
      label: "10-inch tablet screenshots",
      children: viewListImgs(mainListing?.tablet10ScreenshotsUrl),
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
          setMainListing(res1.results || {});
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

  const onEdit = () => {
    setIsEdit(true);
  };

  return (
    <Page>
      {loading && <Loading />}
      <div className="flex justify-between flex-col xs:flex-row">
        <div className="page-title">Main store listing</div>
        <div className="mt-1 sm:mt-0">
          <Button icon={<EditOutlined />} onClick={onEdit}>
            Edit
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 mt-2">
        <div className="flex gap-4 items-center">
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
          <span className="text-md font-medium flex gap-1">
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
          <Descriptions
            bordered
            column={4}
            labelStyle={{ fontWeight: "bold" }}
            className="mt-4"
          >
            {items.map((el, idx) => (
              <Descriptions.Item key={el.key} label={el.label} span={el.span}>
                {el.children}
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </div>

      <EditMainStoreListing
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        mainListing={mainListing}
      />
      <ImagePreview imgPreview={imgPreview} setImgPreview={setImgPreview} />
    </Page>
  );
};

export default MainStoreListing;
