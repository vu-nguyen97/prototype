import React from "react";
// @ts-ignore
import ChPlay from "../../images/common/ch-play.svg";

export default function DefaultAppImg({
  classNames = "",
  dot = true,
  dotClass = "",
}) {
  return (
    <div
      className={`relative w-12 h-12 p-1.5 rounded-full bg-slate-300 flex justify-center items-center ${classNames}`}
    >
      <img src={ChPlay} className="ml-1" />
      {dot && (
        <div
          className={`absolute rounded-full right-[4px] bottom-0 h-2.5 w-2.5 bg-green-600 ${dotClass}`}
        />
      )}
    </div>
  );
}
