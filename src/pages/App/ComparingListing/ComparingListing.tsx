import React, { useEffect, useState } from "react";
import Page from "../../../utils/composables/Page";
import { useQuery } from "@tanstack/react-query";
import { GET_STORE_APP_BY_ID } from "../../../api/constants.api";
import { useParams } from "react-router-dom";
import { getCpiCampaignById } from "../../../api/common/common.api";
import moment from "moment";
import service from "../../../partials/services/axios.config";
import DescriptionsDetail from "./DescriptionsDetail";
import Loading from "../../../utils/Loading";
import ListingTable from "./ListingTable";

function ComparingListing(props) {
  const urlParams = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [listStores, setListStores] = useState<any>([]);
  const [appState, setAppState] = useState<any>({});

  const [isOpenDateRange, setIsOpenDateRange] = useState(false);
  const [dateRange, setDateRange] = useState<any>();

  const { data: appRes, isLoading: isLoadingApp } = useQuery(
    [GET_STORE_APP_BY_ID, urlParams.appId],
    getCpiCampaignById,
    {
      staleTime: 5 * 60000,
      enabled: !!urlParams.appId,
    }
  );

  useEffect(() => {
    setIsLoading(true);
    service.get("/google-play-stores").then(
      (res: any) => {
        setIsLoading(false);
        setListStores(res.results || []);
      },
      () => setIsLoading(false)
    );
  }, []);

  useEffect(() => {
    const data = appRes?.results || {};
    if (!data?.id) return;
    setAppState(data);

    const { startDate, endDate } = data;
    if (startDate && endDate) {
      setDateRange([moment(startDate), moment(endDate)]);
    }
  }, [appRes]);

  return (
    <Page>
      {(isLoading || isLoadingApp) && <Loading />}

      <div className="page-title">Compaign Listing</div>
      <div className="bg-white rounded-sm shadow mt-2 mb-5 lg:p-6 p-4">
        <DescriptionsDetail
          listStores={listStores}
          appState={appState}
          isOpenDateRange={isOpenDateRange}
          setIsOpenDateRange={setIsOpenDateRange}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <ListingTable appState={appState} />
      </div>
    </Page>
  );
}

ComparingListing.propTypes = {};

export default ComparingListing;
