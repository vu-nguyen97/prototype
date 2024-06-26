import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Descriptions } from "antd";
import AntInput from "antd/lib/input";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TimeAgo from "react-timeago";
import { toast } from "react-toastify";
import { getAppById } from "../../../api/common/common.api";
import { GET_APP_BY_ID } from "../../../api/constants.api";
import ImagePreview, {
  ImgFile,
} from "../../../partials/common/Modal/ImagePreview";
import SyncNow from "../../../partials/common/SyncNow";
import service from "../../../partials/services/axios.config";
import Loading from "../../../utils/Loading";
import Page from "../../../utils/composables/Page";
import EditMainStoreListing from "./EditMainStoreListing";

const MainStoreListing = () => {
  const urlParams = useParams();
  const [loading, setIsLoading] = useState(false);

  const [imgPreview, setImgPreview] = useState<ImgFile>({});
  const [mainListing, setMainListing] = useState<any>();
  const [isEdit, setIsEdit] = useState(false);
  const [appState, setAppState] = useState<any>({});
  const [items, setItems] = useState<any>([]);

  const [task, setTask] = useState<any>();
  const [syncing, setSyncing] = useState(false);
  const [editing, setEditing] = useState(false);

  const { data: storeListingRes } = useQuery(
    [GET_APP_BY_ID, urlParams.appId],
    getAppById,
    {
      staleTime: 5 * 60000,
      enabled: !!urlParams.appId,
    }
  );

  useEffect(() => {
    const data = storeListingRes?.results || {};
    if (!Object.keys(data).length) return;
    setAppState(data);
  }, [storeListingRes]);

  const getViewableImg = (url, classNames = "") => {
    if (!url || typeof url !== "string") return <></>;

    return (
      <img
        src={url}
        title="Click to view this image"
        alt={mainListing.appName}
        className={`cursor-pointer object-cover ${classNames}`}
        onClick={() => setImgPreview({ url })}
      />
    );
  };

  const viewListImgs = (list) => {
    if (!list?.length) return <></>;

    return (
      <div className="flex gap-2 flex-wrap">
        {list.map((el, idx) => (
          <React.Fragment key={idx}>
            {getViewableImg(el, "max-w-[130px] xs:max-w-[200px]")}
          </React.Fragment>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (mainListing === undefined) return;

    const customSpan = window.innerWidth < 800 ? 4 : 2;
    const mainListingUrl =
      "https://play.google.com/store/apps/details?id=" + appState.packageId;

    const newItems = [
      {
        key: "1",
        label: "App Name",
        children: mainListing?.appName,
        span: customSpan,
      },
      {
        key: "9",
        label: "Youtube Video",
        children: (
          <a href={mainListing?.youtubeVideoUrl} target="_blank">
            {mainListing?.youtubeVideoUrl}
          </a>
        ),
        span: customSpan,
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
        span: customSpan,
      },
      {
        key: "11",
        label: "Main Listing URL",
        children: mainListingUrl && (
          <a href={mainListingUrl} target="_blank">
            {mainListingUrl}
          </a>
        ),
        span: customSpan,
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
          "w-32 h-32 xs:w-[200px] xs:h-[200px]"
        ),
        span: customSpan,
      },
      {
        key: "5",
        label: "Feature Graphic",
        children: getViewableImg(mainListing?.featureGraphicUrl),
        span: customSpan,
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
    setItems(newItems);
  }, [mainListing]);

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
    setSyncing(true);
    setIsLoading(true);
    service.get("/fetch_main_listing?appId=" + urlParams.appId).then(
      (res: any) => {
        toast(res.message, { type: "success" });
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        setSyncing(false);
      }
    );
  };

  const onEdit = () => {
    setIsEdit(true);
  };

  const syncTime = task ? (
    task.state === "FAILED" ? (
      "Last sync failed"
    ) : (
      <TimeAgo date={task ? task.createdAt : 0} />
    )
  ) : (
    "None"
  );

  return (
    <Page>
      {loading && <Loading />}
      <div className="flex justify-between flex-col xs:flex-row">
        <div className="page-title">Main store listing</div>
        <div className="mt-1 sm:mt-0 flex items-center space-x-2">
          <SyncNow
            syncTime={syncTime}
            onClick={fetchMainStoreListing}
            syncing={syncing}
          />
          <Button icon={<EditOutlined />} onClick={onEdit}>
            Edit
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 mt-2">
        {mainListing && (
          <Descriptions
            size={window.innerWidth < 800 ? "small" : undefined}
            bordered
            column={4}
            labelStyle={{ fontWeight: "bold" }}
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
