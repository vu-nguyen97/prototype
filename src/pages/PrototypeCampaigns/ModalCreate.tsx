import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "../../partials/elements/Modal";
import Input from "../../partials/elements/Input";
import service from "../../partials/services/axios.config";
import { Select } from "antd";
import { toast } from "react-toastify";

const ModalCreate = (props) => {
  const { isOpen, onClose, setIsLoading } = props;
  const [campaignName, setCampaignName] = useState("");

  const [allApps, setAllApps] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);

  const handleAppSelection = (selectedValues) => {
    setSelectedApps(selectedValues);
  };

  useEffect(() => {
    setIsLoading(true);
    service.get("/store-app").then(
      (res: any) => {
        setAllApps(res.results);
      },
      () => setIsLoading(false)
    );
  }, []);

  const onCloseModal = () => {
    onClose();
    setTimeout(() => {
      setCampaignName("");
      setSelectedApps([]);
    }, 300);
  };

  const onSubmit = () => {
    setIsLoading(true);
		console.log(selectedApps);
    service
      .post("/prototype-campaigns", {
        name: campaignName,
        appIds: selectedApps
      })
      .then(
        (res: any) => {
          setIsLoading(false);
          onCloseModal();
          toast(res.message, { type: "success" });
        },
        () => setIsLoading(false)
      );
  };

  return (
    <Modal
      title="Create new campaign"
      onClose={onCloseModal}
      isOpen={isOpen}
      submitLabel={"Create"}
      onSubmit={onSubmit}
    >
      <div>
        <Input
          value={campaignName}
          onChange={setCampaignName}
          inputClassName={"input-light-antd"}
          placeholder={"Enter campaign name"}
          required
          label={"Campaign Name"}
        />
      </div>
      <div className="mt-4">
        <Select
          mode="multiple"
          value={selectedApps}
          onChange={handleAppSelection}
          style={{ width: "100%" }}
          placeholder="Select Apps"
          size="middle"
        >
          {allApps.map((app) => (
            <Select.Option key={app.id} value={app.id}>{app.name}</Select.Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
};

export default ModalCreate;
