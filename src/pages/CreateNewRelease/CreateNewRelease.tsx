import React, { useEffect, useRef, useState } from "react";
import Page from "../../utils/composables/Page";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";
import { Button, Collapse, Form } from "antd";
import Loading from "../../utils/Loading";
import ReleaseStatusTable from "./ReleaseStatusTable";
import AntInput from "antd/lib/input";
import { Input } from "antd";
import DynamicUpload from "../../partials/common/Forms/DynamicUpload";
const { Panel } = Collapse;
const { TextArea } = Input;

function CreateNewRelease() {
  const [templateName, setTemplateName] = useState("Production Default");
  const [listFiles, setListFiles] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const [releaseStatus, setReleaseStatus] = useState([]);

  const [templateData, setTemplateData] = useState<any>();
  const contentRatingsCategories = [
    "Violence, Blood, or Gory Images",
    "Fear",
    "Sexuality",
    "Gambling Themes, Simulated Gambling, Real Gambling, or Cash Payouts",
    "Language",
    "Controlled Substance",
    "Crude Humor",
    "Interact and exchange content",
    "Share user's current location",
    "Allow purchase of digital goods",
    "Contain swastikas, Nazi symbols or propaganda deemed unconstitutional in Germany",
    "Contain any content that can substantially erode the national identity of the Republic of Korea by describing anti-national acts or distorting historical facts",
    "Contain detailed descriptions of techniques that could be used in criminal offenses",
    "Advocate committing acts of terrorism",
  ];

  const dataProps = [
    "Data processed ephemerally",
    "Data collection is required",
  ];


  useEffect(() => {
    service.get("/default-app-content-settings").then((res) => {
      setTemplateData(res.results);
      console.log(res.results);
    });

    const interval = setInterval(() => {
      service.get("/release-status").then((res) => {
        setReleaseStatus(res.results);
        // if (res.results.length == 0) {
        //   // kill interval
        //   clearInterval(interval);
        // }
      });
    }, 5000);
  }, []);

  const onSetListFiles = (fieldName, files) => {
    const newListFiles = { ...listFiles };
    newListFiles["file"] = files;
    setListFiles(newListFiles);
  };

  const handleTemplateChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTemplateName(event.target.value);
  };

  const onFinish = () => {
    setIsLoading(true);

    const { appName, testersGroups, releaseName, engReleaseNotes } = form.getFieldsValue();

    console.log("appName", appName);

    const formData = new FormData();
    formData.append("appName", appName);
    formData.append("emailListNames", testersGroups.split(","));
    formData.append("templateName", templateName);
    formData.append("releaseName", releaseName);
    formData.append("engReleaseNotes", engReleaseNotes);
    formData.append("file", listFiles["file"][0] as Blob);
    console.log(formData);
    console.log(listFiles["file"]?.length);
    // Handle form submission here
    service
      .post("/release", formData)
      .then((res) => {
        toast("Request pushed successfully", { type: "success" });
        setIsLoading(false);
      })
      .catch((err) => {
        toast(err.message, { type: "error" });
        setIsLoading(false);
      });
  };

  function clearStatus() {
    setIsLoading(true);
    service
      .delete("/release-status")
      .then((res) => {
        setReleaseStatus([]);
        setIsLoading(false);
      })
      .catch((err) => {
        toast(err.message, { type: "error" });
        setIsLoading(false);
      });
  }

  return (
    <Page>
      {isLoading && <Loading />}
      <div className="text-3xl mb-4 font-bold">Create New Release</div>
      <div className="max-w-xl mx-auto space-y-4 mb-4">
        <Form
          id="FormCreateRelease"
          labelAlign="left"
          form={form}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="appName"
            label="App Name"
            rules={[{ required: true, message: "Please enter App name" }]}
          >
            <AntInput allowClear className="w-full" />
          </Form.Item>
          <Form.Item
            name="testersGroups"
            label="Testers Groups (comma separated)"
            rules={[{ required: true, message: "Please enter Testers Groups" }]}
          >
            <AntInput
              allowClear
              placeholder="tester group 1, tester group 2, ..."
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            name="releaseName"
            label="Release Name"
            rules={[{ required: true, message: "Please enter Release name" }]}
          >
            <AntInput allowClear className="w-full" />
          </Form.Item>
          <Form.Item
            name="engReleaseNotes"
            label="English Release Notes"
            rules={[
              { required: true, message: "Please enter English Release Notes" },
            ]}
          >
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item
            name="file"
            rules={[{ required: false, message: "Please select a bundle" }]}
          >
            <DynamicUpload
              label="Bundle"
              onSetListFiles={onSetListFiles}
              listFiles={listFiles["file"] || []}
              accept=".aab, .AAB"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </div>
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="Release status table" key="0">
          <div className="w-full mx-auto mb-4">
            {releaseStatus.length > 0 && (
              <div className="flex justify-end mb-2">
                <button
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={clearStatus}
                >
                  Clear Status
                </button>
              </div>
            )}
            <ReleaseStatusTable
              listData={releaseStatus}
              isLoading={isLoading}
            />
          </div>
        </Panel>
        <Panel header="App content template" key="1">
          {templateData && (
            <div>
              <p>
                <strong className="text-lg">Privacy Policy:</strong>{" "}
                <a
                  href={templateData.privacyPolicy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base"
                >
                  {templateData.privacyPolicy}
                </a>
              </p>
              <p>
                <strong className="text-lg">Contains Ads:</strong>{" "}
                <span className="text-base">
                  {templateData.containAds ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-lg">Full App Access:</strong>{" "}
                <span className="text-base">
                  {templateData.fullAppAccess
                    ? "All functionality in my app is available without any access restrictions"
                    : "All or some functionality in my app is restricted"}
                </span>
              </p>
              <p>
                <strong className="text-lg">Contact Email:</strong>{" "}
                <span className="text-base">
                  {templateData.contentRatingsContactEmail}
                </span>
              </p>
              <p>
                <strong className="text-lg">Content Ratings Category:</strong>{" "}
                <span className="text-base">
                  {templateData.contentRatingsCategory}
                </span>
              </p>
              <p>
                <strong className="text-lg">Content Ratings Settings:</strong>
              </p>
              <ul className="ml-12 list-disc">
                {templateData.contentRatingsSettings.map((setting, index) => (
                  <li key={index} className="text-base">
                    {contentRatingsCategories[index]}: {setting ? "Yes" : "No"}
                  </li>
                ))}
              </ul>
              <p>
                <strong className="text-lg">Target Age Groups:</strong>
              </p>
              <ul className="ml-12 list-disc">
                {templateData.targetAgeGroups.map((ageGroup, index) => (
                  <li key={index} className="text-base">
                    {ageGroup}
                  </li>
                ))}
              </ul>
              <p>
                <strong className="text-lg">
                  Collect Sensitive Information:
                </strong>{" "}
                <span className="text-base">
                  {templateData.collectSensitiveInformation ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-lg">Children Appropriate Ads:</strong>{" "}
                <span className="text-base">
                  {templateData.childrenAppropriateAds ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-lg">
                  Unintentionally Appeal to Children:
                </strong>{" "}
                <span className="text-base">
                  {templateData.unintentionallyAppealToChildren ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-lg">
                  Join Teacher Approved Program:
                </strong>{" "}
                <span className="text-base">
                  {templateData.joinTeacherApprovedProgram ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-lg">News App:</strong>{" "}
                <span className="text-base">
                  {templateData.newsApp ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-lg">Collect Required Data:</strong>{" "}
                <span className="text-base">
                  {templateData.collectRequiredData ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-lg">Collected Data Encrypted:</strong>{" "}
                <span className="text-base">
                  {templateData.collectedDataEncrypted ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-lg">Data Types Collected:</strong>
              </p>
              <ul className="ml-12 list-decimal">
                {Object.keys(templateData.dataTypesCollected).map((key) => (
                  <li key={key} className="text-base">
                    <strong className="text-lg">{key}:</strong>
                    <ul className="ml-12 list-disc">
                      {templateData.dataTypesCollected[key].map((dataType) => (
                        <li key={dataType}>{dataType}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <p>
                <strong className="text-lg">Data Collect Props:</strong>
              </p>
              <ul className="ml-12 list-decimal">
                {Object.keys(templateData.dataCollectProps).map((key) => (
                  <li key={key} className="text-base">
                    <strong className="text-lg">{key}:</strong>
                    <ul className="ml-12 list-disc">
                      {templateData.dataCollectProps[key].map((prop, index) => (
                        <li key={index}>
                          {dataProps[index]}: {prop ? "Yes" : "No"}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <p>
                <strong className="text-lg">Data Collect Reasons:</strong>
              </p>
              <ul className="ml-12 list-decimal">
                {Object.keys(templateData.dataCollectReasons).map((key) => (
                  <li key={key} className="text-base">
                    <strong className="text-lg">{key}:</strong>
                    <ul className="ml-12 list-disc">
                      {templateData.dataCollectReasons[key].map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <p>
                <strong className="text-lg">Data Share Reasons:</strong>
              </p>
              <ul className="ml-12 list-decimal">
                {Object.keys(templateData.dataShareReasons).map((key) => (
                  <li key={key}>
                    <strong className="text-lg">{key}:</strong>
                    <ul className="ml-12 list-disc">
                      {templateData.dataShareReasons[key].map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <p>
                <strong className="text-lg">Use Advertising ID:</strong>{" "}
                <span className="text-base">
                  {templateData.useAdvertisingID ? "Yes" : "No"}
                </span>
              </p>
              <p>
                <strong className="text-lg">Advertising ID Reasons:</strong>
              </p>
              <ul className="ml-12 list-disc">
                {templateData.advertisingIDReasons.map((reason, index) => (
                  <li key={index} className="text-base">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
      </Collapse>
    </Page>
  );
}

export default CreateNewRelease;
