import Button from "antd/lib/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TimeAgo from "react-timeago";
import { toast } from "react-toastify";
import service, { SOCKET_URL } from "../../../partials/services/axios.config";
import Page from "../../../utils/composables/Page";
import CustomStoreListingTable from "./CustomStoreListingTable";
import ModalAddCustomListing from "./ModalAddCustomListing";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import classNames from "classnames";
import SyncNow from "../../../partials/common/SyncNow";
import { SOCKET_TYPES } from "../../../constants/constants";
import { Client } from "@stomp/stompjs";

const CustomStoreListing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
  const [customListings, setCustomListings] = useState([]);
  const [mainListing, setMainListing] = useState<any>(null);
  const [isDraft, setIsDraft] = useState(false);
  const [task, setTask] = useState<any>();
  const [syncing, setSyncing] = useState(false);

  const urlParams = useParams();

  const onEditData = (record) => {};

  const onDelete = (record) => {
    console.log("record :>> ", record);
  };

  useEffect(() => {
    reloadCustomListings();
  }, []);

  useEffect(() => {
    const onConnected = () => {
      client.subscribe(`/topic/selenium-clients`, function (msg) {
        if (msg.body) {
          const jsonBody = JSON.parse(msg.body);
          if (!jsonBody) return;

          console.log("fetCustomListings", jsonBody);
          // if (jsonBody.type === SOCKET_TYPES.fetCustomListings) {
          //   setSyncing(false);
          // }
        }
      });
    };
    const onDisconnected = () => {};

    const client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: onConnected,
      onDisconnect: onDisconnected,
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const sendUpdateListingRequest = () => {
    setSyncing(true);
    setIsLoading(true);

    service.post("/" + urlParams.appId + "/custom_listings").then(
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

  const reloadCustomListings = () => {
    setIsLoading(true);
    axios
      .all([
        service.get("/store-app/appId?appId=" + urlParams.appId),
        service.get("/" + urlParams.appId + "/custom_listings"),
        service.get("/custom_listings_last_sync?appId=" + urlParams.appId),
        service.get("/main_listing?appId=" + urlParams.appId),
      ])
      .then(
        axios.spread((res1: any, res2: any, res3: any, res4: any) => {
          if (res1.results.consoleStatus === "Draft") {
            setIsDraft(true);
          }
          setCustomListings(res2.results);
          setIsLoading(false);
          setTask(res3.results);
          setMainListing(res4.results);
        })
      )
      .catch((error) => {
        toast(error.message, { type: "error" });
        setIsLoading(false);
      });
  };

  const syncTime = task ? <TimeAgo date={task.createdAt || 0} /> : "None";

  return (
    <Page>
      <div>
        <div className="page-title">Custom store listing</div>
        <div className="mt-1 mb-3">
          Customize your store listing to appeal to specific user segments
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsOpenModalAddApp(true)}
          disabled={isDraft}
        >
          Create Listing
        </Button>

        <div
          className={classNames(
            "flex justify-between items-end",
            isDraft ? "mt-6" : "mt-2"
          )}
        >
          {isDraft && (
            <div>
              <span className="text-gray-700 font-bold mr-1">Note:</span>
              <span className="text-red-500 font-medium">
                Cannot have custom url listings for draft apps
              </span>
            </div>
          )}
          <SyncNow
            syncTime={syncTime}
            onClick={sendUpdateListingRequest}
            syncing={syncing}
            disabled={isDraft}
          />
        </div>

        <div className="mt-2">
          <CustomStoreListingTable
            isLoading={isLoading}
            onEdit={onEditData}
            onDelete={onDelete}
            listData={customListings}
          />
        </div>
      </div>
      <ModalAddCustomListing
        isOpen={isOpenModalAddApp}
        onClose={() => setIsOpenModalAddApp(false)}
        setIsLoading={setIsLoading}
        setIsOpenModalAddApp={setIsOpenModalAddApp}
        mainListing={mainListing}
      />
    </Page>
  );
};

export default CustomStoreListing;
