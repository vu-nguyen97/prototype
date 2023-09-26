import Button from "antd/lib/button/button";
import Popconfirm from "antd/lib/popconfirm";
import React from "react";
import service from "../../../../../partials/services/axios.config";
import { toast } from "react-toastify";
import classNames from "classnames";

export default function Actions({ data, setIsLoading, setCampaignData }) {
  const isRunning = data.enabled;

  const changeRunningStatus = () => {
    let url = "/campaign/active";
    if (data.enabled) {
      url = "/campaign/pause";
    }

    setIsLoading(true);
    service.put(url, null, { params: { campaignId: data.id } }).then(
      (res: any) => {
        setCampaignData(res.results);
        toast(res.message, { type: "success" });
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  };

  return (
    <div className="border bg-white rounded px-6 py-5 flex justify-between text-base">
      <div className="flex items-center">
        <span
          className={classNames(
            "h-3 w-3 rounded-full mr-2",
            isRunning ? "bg-green-500" : "bg-gray-400"
          )}
        />
        {isRunning
          ? "This campaign is running."
          : "This campaign has been stopped."}
      </div>

      <Popconfirm
        placement="left"
        title={`${isRunning ? "Pause" : "Run"} this campaign?`}
        onConfirm={changeRunningStatus}
        okText="Yes"
        cancelText="No"
      >
        <Button type={isRunning ? undefined : "primary"}>
          {isRunning ? "Pause campaign" : "Run campaign"}
        </Button>
      </Popconfirm>
    </div>
  );
}
