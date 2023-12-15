import { FaSpinner } from "@react-icons/all-files/fa/FaSpinner";
import Button from "antd/lib/button";
import classNames from "classnames";
import React from "react";

export default function SyncNow({
  syncTime,
  onClick,
  syncing = false,
  right = true,
  small = false,
  disabled = false,
}) {
  return (
    <div
      className={
        right ? "flex items-center ml-auto gap-4 " : "flex items-center"
      }
    >
      <div className={classNames("flex", small ? "mr-2" : "mr-1")}>
        <div className="font-semibold mr-1">Last Sync:</div>
        {syncTime}
      </div>

      {!syncing ? (
        <Button
          type="primary"
          onClick={onClick}
          size={small ? "small" : undefined}
          className={classNames(small && "!text-xs2")}
          disabled={disabled}
        >
          Sync now
        </Button>
      ) : (
        <div className={classNames("bold flex", !small && "h-8 items-center")}>
          <FaSpinner className="spin text-green-600" fontSize="1.5rem" />
          <span className="font-semibold text-green-600 ml-1.5 mt-1 mr-[13px]">
            Syncing
          </span>
        </div>
      )}
    </div>
  );
}
