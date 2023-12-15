import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import { AiOutlinePlayCircle } from "@react-icons/all-files/ai/AiOutlinePlayCircle";
import Table from "antd/lib/table";
import React, { useState } from "react";
import { getLabelFromStr } from "../../../utils/Helpers";
import ListImages from "../../../partials/common/ListImages";
import { baseURL } from "../../../partials/services/axios.config";
import { checkVideo } from "../../../partials/common/Table/Columns/NameColumn";
import VideoPopup from "../../../partials/common/Modal/VideoPopup";

export default function ListingTable(props) {
  const { appState } = props;

  const defaultPageSize = 20;
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [previewVideo, setPreviewVideo] = useState({});

  const getAssetUrl = (url) => baseURL + "/media/" + url;

  const onClickVideo = (el, name) => {
    console.log("url", getAssetUrl(el.id));
    setPreviewVideo({ url: getAssetUrl(el.id), name });
  };

  const columns = [
    {
      title: "Name",
      render: (rd) => (
        <div className="flex justify-between">
          {rd.customListing?.listingName}
          {rd?.customListing?.customUrl && (
            <a
              href={rd?.customListing?.customUrl}
              className="shrink-0 pl-1 text-xs !text-antPrimary mt-[3px]"
              title="View this theme in the store"
              target="_blank"
            >
              <BiLinkExternal size={16} />
            </a>
          )}
        </div>
      ),
    },
    {
      title: "Unity Campaign name",
      render: (rd) => (
        <div className="break-all md:break-normal">
          {getLabelFromStr(rd.unityAds?.campaignName)}
        </div>
      ),
    },
    { title: "Type", render: (rd) => getLabelFromStr(rd.customListing?.type) },
    {
      title: "Creatives",
      render: (rd) => {
        if (!rd.unityAds?.localCreatives?.length) return <></>;
        const localCreatives = rd.unityAds.localCreatives;
        const imgs = localCreatives?.map((el) => ({
          ...el,
          src: getAssetUrl(el.id),
        }));

        const listImgs: any = [];
        const listVideos: any = [];
        imgs.forEach((el) => {
          if (checkVideo(el.localPath)) {
            listVideos.push(el);
          } else {
            listImgs.push(el);
          }
        });

        if (!listVideos?.length) {
          return <ListImages imgs={listImgs} />;
        }

        return (
          <div>
            <ListImages imgs={listImgs} />
            <div className="mt-2">
              {listVideos.map((el, idx) => {
                const name = el.localPath.replace(/^.*[\\/]/, "");
                return (
                  <div
                    className="flex items-center truncate mt-1 cursor-pointer group"
                    key={idx}
                    onClick={() => onClickVideo(el, name)}
                  >
                    <div
                      className="shrink-0 w-8 h-8 rounded-md bg-antPrimary/10 group-hover:bg-antPrimary/20 flex justify-center items-center"
                      title="Click to play"
                    >
                      <AiOutlinePlayCircle
                        size={20}
                        className="text-antPrimary"
                      />
                    </div>
                    <span className="ml-2 group-hover:text-blue-600">
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      render: (rd) => {
        const status = rd.customListing?.status;
        return (
          <div className="flex items-center space-x-2">
            {status === "Live" && (
              <div className="bg-green-600 w-1.5 h-1.5 rounded-full flex-shrink-0" />
            )}
            <div>{status}</div>
          </div>
        );
      },
    },
  ];

  const pagination = {
    hideOnSinglePage: true,
    pageSize,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };

  return (
    <>
      <div className="mt-8 mb-3 font-semibold text-[rgba(0,0,0,.85)] text-[22px]">
        Listings
      </div>
      <Table
        size="middle"
        id="ComparingListingTable"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={appState?.appVariants || []}
        scroll={{ x: 800 }}
        pagination={pagination}
        onChange={(pagination) => {
          pagination?.pageSize && setPageSize(pagination?.pageSize);
        }}
      />

      <VideoPopup
        previewData={previewVideo}
        onClose={() => setPreviewVideo({})}
      />
    </>
  );
}
