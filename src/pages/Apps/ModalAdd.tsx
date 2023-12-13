import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Input from "../../partials/elements/Input";
import Modal from "../../partials/elements/Modal";
import service from "../../partials/services/axios.config";
import { addStoreApp } from "../../utils/helper/ReactQueryHelpers";
import { handleErrorImage } from "../../utils/Helpers";

export const ModalAdd = (props) => {
  const queryClient = useQueryClient();
  const { isOpen, onClose, setIsLoading, setListApp } = props;

  const defaultApp = {
    id: "",
    name: "",
    icon: "",
    featureGraphic: "",
    shortDescription: "",
    fullDescription: "",
    screenshots: "",
    store: "",
    storeId: "",
    avaiavle: false,
  };
  const [appInfo, setAppInfo] = useState(defaultApp);
  const [appStoreId, setAppStoreId] = useState("");

  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      setAppStoreId("");
      setAppInfo(defaultApp);
    }, 300);
  };

  const getApp = (storeid = appStoreId) => {
    if (!storeid) return;
    service.get("/store-app/information", { params: { storeid } }).then(
      (res: any) => {
        setAppInfo(res.results);
      },
      () => setAppInfo(defaultApp)
    );
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.target.blur();
    }
  };

  const onKeyUp = (e) => {
    if (e.ctrlKey && e.key == "v") {
      // Ctrl+V is pressed.
      getApp(e.target.value);
    }
  };

  const onSubmit = () => {
    console.log(appInfo);
    setIsLoading(true);
    service.post("/store-app", { app: appInfo }).then(
      (res: any) => {
        setListApp((oldList) => [...oldList, res.results]);
        addStoreApp(queryClient, res.results);
        onCloseModal();
        toast(res.message, { type: "success" });
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  };

  return (
    <Modal
      title="New app"
      isOpen={isOpen}
      onClose={onCloseModal}
      submitLabel="Save"
      onSubmit={onSubmit}
    >
      <div className="">
        <Input
          id="appStoreId"
          value={appStoreId}
          onChange={setAppStoreId}
          inputClassName="input-light-antd"
          label="STOREID to your app on App Store / Play Store"
          placeholder="STOREID"
          required
          className="py-2"
          onBlur={(e) => getApp()}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
        />
      </div>

      {appInfo?.name && (
        <div className="mt-6 flex flex-col items-center">
          <img
            alt=" "
            src={appInfo.icon}
            className="h-40 w-40 rounded"
            referrerPolicy="no-referrer"
            onError={handleErrorImage}
          />
          <div className="my-3 text-black font-bold text-xl">
            {appInfo.name}
          </div>
        </div>
      )}
    </Modal>
  );
};
