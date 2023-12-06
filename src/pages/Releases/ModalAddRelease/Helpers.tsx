import Popover from "antd/lib/popover";
import React from "react";
import { AiOutlineQuestionCircle } from "@react-icons/all-files/ai/AiOutlineQuestionCircle";

export const getDefaultReleaseNote = (name) =>
  "Game Launch - Version 1.0\n\n Welcome to " +
  name +
  " - Version 1.0! \n\n" +
  "Explore a new world, meet unique characters, and enjoy stunning visuals. " +
  "Adapt to dynamic weather, engage in community challenges, and unlock exclusive rewards. Update now for an unforgettable gaming experience!\n\n" +
  "- The " +
  name +
  " Team.";

export const getShortDescription = (name) =>
  name +
  "Uncover mysteries and conquer challenges in our inaugural game release.";

export const getFullDescription = (name) =>
  name +
  " - Version 1.0: Unveiling a New Realm of Adventure!\n\n" +
  "Welcome to the debut of " +
  name +
  " - a gaming experience like no other! In this inaugural version, immerse yourself in a captivating world teeming with mystery and excitement.\n\n" +
  "FEATURES:\n" +
  "- Explore a New World: Venture into a richly detailed and expansive game world, ripe for exploration and discovery. Uncover hidden secrets, face thrilling challenges, and shape your destiny.\n" +
  "- Meet Unique Characters: Encounter a diverse cast of characters, each with their own special abilities and stories. Form alliances, unlock their potential, and strategize your way to victory.\n" +
  "- Stunning Visuals: Immerse yourself in a visually striking universe with seamless animations and breathtaking graphics. Every detail is crafted to enhance your gaming experience and bring the world to life.\n" +
  "- Dynamic Weather System: Experience a realistic and ever-changing environment with dynamic weather conditions. Adapt your strategies as rain, snow, and storms add a new layer of challenge and immersion.\n" +
  "- Engage in Community Challenges: Join forces with players worldwide in exciting community challenges. Compete, cooperate, and unlock exclusive rewards that set you apart as a true champion.\n" +
  "- Exclusive Rewards Await: Rise to the occasion and claim special rewards available only to those who dare to embrace the challenges of " +
  name +
  ". Show the world what you're made of!\n\n" +
  "This is just the beginning of your journey. Update to Version 1.0 now and be among the first to experience the magic, excitement, and endless possibilities of " +
  name +
  ".\n\n" +
  "Get ready for a gaming odyssey that will keep you hooked!\n\n" +
  "- The " +
  name +
  " Team ";

export const ASSET_FIELDS = [
  {
    field: "iconImg",
    label: "App icon",
    note: "Must be a PNG or JPEG, up to 1 MB, 512 px by 512 px.",
  },
  {
    field: "featureImg",
    label: "Feature graphic",
    note: "Your feature graphic must be a PNG or JPEG, up to 15 MB, and 1,024 px by 500px.",
  },
  {
    field: "phoneScreenshots",
    label: "Phone screenshots",
    note: "Upload 2-8 phone screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840 px.",
    multiple: true,
  },
  {
    field: "sevenInchScreenshots",
    label: "7-inch tablet screenshots",
    note: "Upload up to eight 7-inch tablet screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840 px.",
    multiple: true,
  },
  {
    field: "tenInchScreenshots",
    label: "10-inch tablet screenshots",
    note: "Upload up to eight 10-inch tablet screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 1,080 px and 7,680 px.",
    multiple: true,
  },
];

export const AssetNotes = (
  <Popover
    content={
      <div className="popover-in-modal">
        <div className="font-bold text-sm2 mb-1">
          Uploading {ASSET_FIELDS.length} specified types of listed assets
          below:
        </div>
        <ul className="max-w-[600px] mb-0 md:mx-2">
          {ASSET_FIELDS.map((el: any) => (
            <li key={el.field} className="">
              <span className="font-bold">- {el.label}:</span> {el.note}
            </li>
          ))}
        </ul>
      </div>
    }
  >
    <AiOutlineQuestionCircle size={16} className="inline-block" />
  </Popover>
);
