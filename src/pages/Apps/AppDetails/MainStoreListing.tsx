import React, { useDeferredValue, useEffect, useState } from "react";
import Loading from "../../../utils/Loading";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Form,
  Modal,
  Table,
  Tooltip,
} from "antd";
import AntInput from "antd/lib/input";
import DynamicUpload from "../../../partials/common/Forms/DynamicUpload";
import service from "../../../partials/services/axios.config";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import ModalEditMainListing from "./ModalEditMainListing";
import Title from "antd/lib/typography/Title";
import { Typography, Space } from "antd";
import Page from "../../../utils/composables/Page";
import axios from "axios";
import TimeAgoComponent from "../../../utils/time/TimeAgoComponent";
import { IoMdEye } from "react-icons/io";

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

  const [mainListings, setMainListings] = useState<any[]>([]);
  const [selectedMainListing, setSelectedMainListing] = useState<any>(null);

  const [task, setTask] = useState<any>();

  const columns = [
    {
      title: "App Name",
      dataIndex: "appName",
      key: "appName",
    },
    {
      title: "Version timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => <TimeAgoComponent createDate={record.createdAt} />,
    },
    {
      title: "Action",
      render: (record) => (
        <Tooltip title="View Details">
          <IoMdEye
            size={20}
            className="cursor-pointer"
            onClick={() => {
              setSelectedMainListing(record);
              setIsModalOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "App Name",
      children: selectedMainListing?.appName,
      span: 2,
    },
    {
      key: "9",
      label: "Youtube Video",
      children: (
        <a href={selectedMainListing?.youtubeVideoUrl} target="_blank">
          {selectedMainListing?.youtubeVideoUrl}
        </a>
      ),
      span: 2,
    },
    {
      key: "2",
      label: "Short Description",
      children: selectedMainListing?.shortDescription,
      span: 4,
    },
    {
      key: "3",
      label: "Full Description",
      children: selectedMainListing?.fullDescription,
      span: 4,
    },

    {
      key: "4",
      label: "App Icon",
      children: (
        <img
          src={selectedMainListing?.appIconUrl}
          alt={selectedMainListing?.appName}
          className="w-[200px] h-[200px]"
        />
      ),
      span: 2,
    },
    {
      key: "5",
      label: "Feature Graphic",
      children: (
        <img
          src={selectedMainListing?.featureGraphicUrl}
          alt={selectedMainListing?.appName}
        />
      ),
      span: 2,
    },
    {
      key: "6",
      label: "Phone Screenshots",
      children: (
        <div className="flex gap-2 flex-wrap">
          {selectedMainListing?.phoneScreenshotsUrl?.map((el, idx) => (
            <img
              key={idx}
              src={el}
              alt={selectedMainListing?.appName}
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
          {selectedMainListing?.tablet7ScreenshotsUrl?.map((el, idx) => (
            <img
              key={idx}
              src={el}
              alt={selectedMainListing?.appName}
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
          {selectedMainListing?.tablet10ScreenshotsUrl?.map((el, idx) => (
            <img
              key={idx}
              src={el}
              alt={selectedMainListing?.appName}
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
          setMainListings(res1.results);
          // setSelectedMainListing(res1.results[0]);
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
      <div className="flex gap-4 items-center mb-4">
        <Button
          type="primary"
          onClick={() => fetchMainStoreListing()}
          loading={
            task ? task.state === "RUNNING" || task.state === "CREATED" : false
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
              <TimeAgoComponent createDate={task ? task.createdAt : 0} />
            )
          ) : (
            "None"
          )}
        </span>
      </div>
      <Table columns={columns} dataSource={mainListings} />
      <Modal
        width={"80%"}
        open={modalOpen}
        title="Main Store Listing"
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedMainListing(null);
        }}
        footer={[
          <Button
            key="back"
            type="primary"
            onClick={() => {
              setIsModalOpen(false);
              setSelectedMainListing(null);
            }}
          >
            Close
          </Button>,
        ]}
      >
        <Descriptions bordered column={4} labelStyle={{ fontWeight: "bold" }}>
          {items.map((el, idx) => (
            <Descriptions.Item key={el.key} label={el.label} span={el.span}>
              {el.children}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Modal>
    </Page>
  );
};

export default MainStoreListing;
