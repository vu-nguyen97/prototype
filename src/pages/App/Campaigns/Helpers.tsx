import classNames from "classnames";
import React from "react";

export const Field = (props) => {
  const { name, value, border = true, classData = "" } = props;

  return (
    <div
      className={classNames(
        "flex items-center justify-end px-5 py-3",
        border && "border-b",
        classData
      )}
    >
      <div className="basis-1/3">{name}</div>
      <div className="basis-2/3 line-clamp-6 break-words">{value}</div>
    </div>
  );
};
