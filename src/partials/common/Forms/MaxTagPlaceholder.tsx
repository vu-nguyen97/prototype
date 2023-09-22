import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";
import Popover from "antd/lib/popover";
import React from "react";

export const maxTagPlaceholder = (omittedValues, values, onChange) => {
  const onRemove = (removedData) => {
    const newValues = values.filter((el) => el !== removedData);
    onChange(newValues);
  };

  if (!omittedValues.length) return <></>;

  const content = (
    <div className="popover-in-input max-h-80 overflow-y-auto custom-scroll">
      {omittedValues.map((el, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center py-px hover:bg-sky-50"
        >
          <span>{el.label}</span>
          <CloseOutlined
            className="ml-1.5 mr-2.5 cursor-pointer !text-red-500 hover:!text-red-700"
            onClick={() => onRemove(el.value)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <Popover content={content} title="" placement="top">
      + {omittedValues.length} ...
    </Popover>
  );
};
