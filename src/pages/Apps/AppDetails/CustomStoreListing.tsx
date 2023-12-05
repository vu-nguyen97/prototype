import React, { useEffect, useState } from "react";
import Page from "../../../utils/composables/Page";
import Loading from "../../../utils/Loading";
import Button from "antd/lib/button";
import ModalAddCustomListing from "./ModalAddCustomListing";
import ConnectorTable from "../../DataConnectors/ConnectorTable/ConnectorTable";
import CustomStoreListingTable from "./CustomStoreListingTable";
import { useParams } from "react-router-dom";
import service from "../../../partials/services/axios.config";
import { toast } from "react-toastify";
import axios from "axios";
import TimeAgoComponent from "../../../utils/time/TimeAgoComponent";
const CustomStoreListing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
  const [customListings, setCustomListings] = useState([]);
  const [mainListing, setMainListing] = useState<any>(null);
  const [isDraft, setIsDraft] = useState(false);
  const [task, setTask] = useState<any>();
  const urlParams = useParams();
  const onEditData = (record) => {};
  const onDelete = (record) => {};
  const listData = [
    {
      id: 1,
      name: "store-listing-1",
      group: "group-1",
      url: "url-1",
      extype: "extype-1",
    },
    {
      id: 2,
      name: "store-listing-2",
      group: "group-2",
      url: "url-2",
      extype: "extype-2",
    },
    {
      id: 3,
      name: "store-listing-3",
      group: "group-3",
      url: "url-3",
      extype: "extype-3",
    },
  ];

  useEffect(() => {
    reloadCustomListings();
  }, []);

  const sendUpdateListingRequest = () => {
    setIsLoading(true);
    service
      .post("/" + urlParams.appId + "/custom_listings")
      .then((res: any) => {
        toast(res.message, { type: "success" });
        setIsLoading(false);
      })
      .catch((error) => {
        toast(error.message, { type: "error" });
        setIsLoading(false);
      });
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
          setMainListing(res4.results[0]);
        })
      )
      .catch((error) => {
        toast(error.message, { type: "error" });
        setIsLoading(false);
      });
  };

  return (
    <Page>
      {isLoading && <Loading />}
      <div>
        <h1 style={{ fontSize: 40, fontWeight: "bold" }}>
          Custom Store Listing
        </h1>
        <h2 style={{ fontSize: 20 }}>
          Customize your store listing to appeal to specific user segments
        </h2>
        <div style={{ paddingTop: 30 }}>
          <div className="mt-1 sm:mt-0">
            <div className="flex justify-start my-3 gap-4 items-center">
              <span className="flex gap-4 items-center">
                <Button
                  type="primary"
                  onClick={(e) => setIsOpenModalAddApp(true)}
                  disabled={isDraft}
                >
                  Create Listing
                </Button>
                {isDraft && (
                  <div className="text-red-500 font-bold">
                    Cannot have custom url listings for draft apps
                  </div>
                )}
              </span>
              <span className="ml-auto flex gap-4 items-center">
                <div className="flex gap-1">
                  <div className="text-md font-[500]">Last Sync:</div>
                  {task ? (
                    <TimeAgoComponent createDate={task ? task.createdAt : 0} />
                  ) : (
                    "None"
                  )}
                </div>
                <Button
                  type="primary"
                  onClick={sendUpdateListingRequest}
                  disabled={isDraft}
                  loading={
                    task
                      ? task.state === "RUNNING" || task.state === "CREATED"
                      : false
                  }
                >
                  Sync Now
                </Button>
              </span>
            </div>

            <div>
              <CustomStoreListingTable
                isLoading={isLoading}
                onEdit={onEditData}
                onDelete={onDelete}
                listData={customListings}
              />
            </div>
          </div>
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
