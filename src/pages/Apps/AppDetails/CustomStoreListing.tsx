import React, { useEffect, useState } from "react";
import Page from "../../../utils/composables/Page";
import Loading from "../../../utils/Loading";
import Button from "antd/lib/button";
import ModalAddStoreListing from "./ModalAddStoreListing";
import ConnectorTable from "../../DataConnectors/ConnectorTable/ConnectorTable";
import CustomStoreListingTable from "./CustomStoreListingTable";
import { useParams } from "react-router-dom";
import service from "../../../partials/services/axios.config";
const CustomStoreListing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModalAddApp, setIsOpenModalAddApp] = useState(false);
  const [customListings, setCustomListings] = useState([]);
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
    const consoleAppId = urlParams.appId;
    setIsLoading(true);
    service.get("/" + consoleAppId + "/custom_listings").then(
      (res: any) => {
        console.log(res.results);
        setCustomListings(res.results);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  }, []);

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
          <h1 style={{ fontSize: 30, fontWeight: "bold" }}>Listings</h1>
          <p style={{ paddingTop: 10, fontSize: 16 }}>
            Users who are targeted by more than 1 listing will be shown the
            highest relevant listing in the list. Reorder the list to change the
            priority.
          </p>
          <p style={{ fontSize: 16 }}>
            Users who aren't being targeted specifically will be shown your main
            store listing.
          </p>
          <div className="mt-1 sm:mt-0">
            <div>
              <Button type="primary" style={{ marginRight: 10 }}>
                Create Group
              </Button>
              <Button
                type="primary"
                onClick={(e) => setIsOpenModalAddApp(true)}
              >
                Create Listing
              </Button>
            </div>

            <div className="mt-6">
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
      <ModalAddStoreListing
        isOpen={isOpenModalAddApp}
        onClose={() => setIsOpenModalAddApp(false)}
        setIsLoading={setIsLoading}
      />
    </Page>
  );
};

export default CustomStoreListing;
