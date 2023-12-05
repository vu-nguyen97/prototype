import React from "react";

const dataProps = ["Data processed ephemerally", "Data collection is required"];
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

export default function AppTemplate(props) {
  const { templateData } = props;

  if (!Object.keys(templateData || {})?.length) return <></>;

  return (
    <div>
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
            <strong className="text-lg">Collect Sensitive Information:</strong>{" "}
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
            <strong className="text-lg">Join Teacher Approved Program:</strong>{" "}
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
    </div>
  );
}
