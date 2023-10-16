import React, { useState } from "react";
import Page from "../../utils/composables/Page";
import service from "../../partials/services/axios.config";
import { toast } from "react-toastify";

function CreateNewRelease() {
  const [appName, setAppName] = useState("");
  const [emailListNames, setEmailListNames] = useState<string[]>([]);
  const [templateName, setTemplateName] = useState("Production Default");
  const [releaseName, setReleaseName] = useState("");
  const [engReleaseNotes, setEngReleaseNotes] = useState("");
  const [file, setFile] = useState<File>();
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleTemplateChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTemplateName(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      setFile(files[0]);
      setSelectedFileName(files[0].name);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("appName", appName);
    formData.append("emailListNames", emailListNames.join(", "));
    formData.append("templateName", templateName);
    formData.append("releaseName", releaseName);
    formData.append("engReleaseNotes", engReleaseNotes);
    formData.append("file", file as Blob);
    console.log(formData);
    console.log(file?.length);
    // Handle form submission here
    service.post("/release", formData).then((res) => {
      toast(res.data, { type: "success" });
    });
  };

  return (
    <Page>
      <div className="text-xl mb-4">Create New Release</div>
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="appName">App Name</label>
          <input
            type="text"
            id="appName"
            placeholder="App Name"
            className="w-full p-2 border rounded"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="emailListNames">
            Tester Lists (comma separated)
          </label>
          <input
            type="text"
            id="emailListNames"
            placeholder="tester list 1, tester group 2, ..."
            className="w-full p-2 border rounded"
            value={emailListNames.join(", ")}
            onChange={(e) => setEmailListNames(e.target.value.split(", "))}
          />
        </div>
        <div>
          <label htmlFor="templateName">Template Name</label>
          <select
            id="templateName"
            placeholder="Template Name"
            className="w-full p-2 border rounded"
            value={templateName}
            onChange={handleTemplateChange}
          >
            <option value="Production Default">Production Default</option>
            {/* Add more template options */}
          </select>
        </div>
        <div>
          <label htmlFor="releaseName">Release Name</label>
          <input
            type="text"
            id="releaseName"
            placeholder="Release Name"
            className="w-full p-2 border rounded"
            value={releaseName}
            onChange={(e) => setReleaseName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="engReleaseNotes">English Release Notes</label>
          <textarea
            id="engReleaseNotes"
            placeholder="English Release Notes"
            className="w-full p-2 border rounded"
            value={engReleaseNotes}
            onChange={(e) => setEngReleaseNotes(e.target.value)}
          />
        </div>
        <div>
          <input
            type="file"
            id="bundleUpload"
            accept=".aab, .AAB" // Specify the allowed file type
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="bundleUpload"
            className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full"
          >
            Upload Bundle
          </label>
          {selectedFileName && <span className="ml-2">{selectedFileName}</span>}
        </div>
        <div>
          <button
            className="w-full p-2 bg-blue-500 text-white rounded hover-bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </Page>
  );
}

export default CreateNewRelease;
