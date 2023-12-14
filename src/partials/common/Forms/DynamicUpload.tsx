import React, { useState } from "react";
import PropTypes from "prop-types";
import InboxOutlined from "@ant-design/icons/lib/icons/InboxOutlined";
import { UPLOAD_PROGRESS_CONFIGS } from "../../../constants/constants";
import Upload from "antd/lib/upload";
import {
  UPLOAD_HINT,
  UPLOAD_SINGLE_HINT,
} from "../../../constants/formMessage";
import {
  getLabelFromCamelCaseStr,
  handleErrorImage,
} from "../../../utils/Helpers";
import Modal from "antd/lib/modal";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import classNames from "classnames";

export const getUploadRule = (listFiles, message = "Please select file") => ({
  required: true,
  message,
  validator: (rule, value, callback) => {
    return new Promise((resolve, reject) => {
      if (listFiles?.length) {
        resolve("");
      }
      reject();
    });
  },
});

function DynamicUpload(props) {
  const { Dragger } = Upload;
  const {
    multiple,
    wrapperClass,
    className,
    field,
    isShowLabel,
    isRequireMark,
    label,
    note,
    listFiles,
    onSetListFiles,
    accept,
  } = props;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [listSizes, setListSizes] = useState<string[]>([]);

  const getSizeOfImg = (file, fileIdx) => {
    // https://stackoverflow.com/questions/7460272/getting-image-dimensions-using-the-javascript-file-api/7460303#7460303
    // https://stackoverflow.com/questions/27120757/failed-to-execute-createobjecturl-on-url
    const url = window.URL.createObjectURL(
      new Blob([file], { type: "application/zip" })
    );
    const img = document.createElement("img"); // const img = new Image();

    const updateListSizes = (newSize, newListSizes) => {
      if (multiple) {
        setListSizes([...newListSizes]);
      } else {
        setListSizes([newSize]);
      }
    };

    if (file.type?.includes("image")) {
      img.onload = function () {
        // https://coolboi567.medium.com/dynamically-get-image-dimensions-from-image-url-in-react-d7e216887b68
        const imgSize = img.width + "x" + img.height;
        const newListSizes = listSizes;
        newListSizes[fileIdx] = imgSize;

        updateListSizes(imgSize, newListSizes);
        URL.revokeObjectURL(img.src);
      };

      img.src = url;
    }

    if (file.type?.includes("video")) {
      const video = document.createElement("video");

      video.onloadedmetadata = function () {
        // https://stackoverflow.com/questions/52397746/get-dimensions-of-mp4-on-user-upload-reactjs
        const videoSize = video.videoWidth + "x" + video.videoHeight;
        const newListSizes = listSizes;
        newListSizes[fileIdx] = videoSize;

        updateListSizes(videoSize, newListSizes);
        URL.revokeObjectURL(video.src);
      };

      video.src = URL.createObjectURL(file);
    }
  };

  const beforeUpload = (file, fileList) => {
    if (multiple) {
      setListFiles([...listFiles, ...fileList]);
    } else {
      const fileSrc = URL.createObjectURL(file);
      setPreviewImage(fileSrc);
      setPreviewTitle(file.name);
      setListFiles(fileList);
    }
    fileList.forEach((el, idx) => getSizeOfImg(el, listFiles.length + idx));
    return false;
  };

  const onRemove = (file) => {
    if (!multiple) {
      setListFiles([]);
    } else {
      const newList = listFiles.filter((el) => el.uid !== file.uid);
      setListFiles(newList);
    }
  };

  const setListFiles = (files) => {
    onSetListFiles(field, files);
  };

  const itemRender = (originNode, file, fileList, actions) => {
    return <></>;
  };

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const openMultiplePreview = (file) => {
    setPreviewImage(URL.createObjectURL(file));
    setPreviewTitle(file.name);
    setPreviewOpen(true);
  };

  const getModalSize = () => {
    let width = 520;
    if (typeof listSizes?.[0] === "string") {
      const newWidth = Number(listSizes?.[0]?.split("x")?.[0]);

      if (newWidth > 520 && newWidth <= window.innerWidth) {
        width = newWidth;
      }
    }

    return width;
  };

  return (
    <div className={wrapperClass}>
      {isShowLabel && (
        <div className="">
          {isRequireMark && <span className="text-[#ff4d4f] mr-1 mt-2">*</span>}
          <span className={className}>
            {getLabelFromCamelCaseStr(label || field, false)}
          </span>
        </div>
      )}
      {note && (
        <div className="text-gray-600 mb-3">
          <span className="font-semibold mr-1">Note:</span>
          <span>{note}</span>
        </div>
      )}

      <div className={className}>
        <Dragger
          className="upload-small"
          multiple={multiple}
          name="file"
          accept={accept}
          progress={UPLOAD_PROGRESS_CONFIGS}
          fileList={listFiles}
          beforeUpload={beforeUpload}
          itemRender={itemRender}
        >
          <p className="ant-upload-drag-icon !mb-0">
            <InboxOutlined className="!text-4xl" />
          </p>
          <p className="ant-upload-text !mb-0 !text-base">
            Click or drag file to this area to upload.
          </p>
          <p className="ant-upload-hint !text-sm">
            {multiple ? UPLOAD_HINT : UPLOAD_SINGLE_HINT}
          </p>
        </Dragger>

        {listFiles.length > 0 && (
          <>
            {multiple ? (
              <div
                className={classNames(
                  "grid gap-y-1 gap-x-2 mt-1 max-h-[300px] overflow-y-auto",
                  listFiles.length < 5
                    ? "grid-col-1"
                    : "grid-col-1 md:grid-cols-2"
                )}
              >
                {listFiles.map((file, idx) => {
                  const assetUrl = URL.createObjectURL(file);
                  const assetClass =
                    "h-8 w-8 object-cover rounded-sm cursor-pointer shrink-0";

                  return (
                    <div
                      className="px-2.5 py-2 rounded-sm border flex items-center justify-between"
                      key={file.uid}
                    >
                      {file.type?.includes("image") && (
                        <img
                          className={assetClass}
                          src={assetUrl}
                          alt=" "
                          referrerPolicy="no-referrer"
                          onError={handleErrorImage}
                          onClick={() => openMultiplePreview(file)}
                          title="Click to view the image"
                        />
                      )}
                      <div
                        className="grow truncate ml-2 cursor-pointer max-w-[320px] xs:max-w-[450px] md:max-w-none mr-auto"
                        onClick={() => openMultiplePreview(file)}
                      >
                        {file.name}
                      </div>
                      <DeleteOutlined
                        title="Remove file"
                        className="pl-2 pr-1 cursor-pointer"
                        onClick={() => onRemove(file)}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-2 px-2.5 py-2 rounded-sm border flex items-center justify-between">
                <div className="grow flex items-center truncate">
                  <img
                    alt=" "
                    className="h-12 w-12 object-cover rounded-sm cursor-pointer"
                    src={previewImage}
                    onError={handleErrorImage}
                    onClick={() => setPreviewOpen(true)}
                  />
                  <div
                    className="ml-2 cursor-pointer truncate"
                    onClick={() => setPreviewOpen(true)}
                  >
                    {previewTitle}
                  </div>
                </div>

                <DeleteOutlined
                  title="Remove file"
                  className="pl-2 pr-1 cursor-pointer"
                  onClick={onRemove}
                />
              </div>
            )}
          </>
        )}

        <Modal
          open={previewOpen}
          title={previewTitle}
          centered
          footer={null}
          width={getModalSize()}
          onCancel={handleCancel}
        >
          <img alt=" " className="w-full" src={previewImage} />
        </Modal>
      </div>
    </div>
  );
}

DynamicUpload.defaultProps = {
  multiple: false,
  accept: ".png, .jpeg",
  wrapperClass: "mb-6",
  isShowLabel: true,
  isRequireMark: true,
};

DynamicUpload.propTypes = {
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  wrapperClass: PropTypes.string,
  className: PropTypes.string,
  field: PropTypes.string,
  isShowLabel: PropTypes.bool,
  isRequireMark: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  note: PropTypes.string,
  listFiles: PropTypes.array,
  onSetListFiles: PropTypes.func,
};

export default DynamicUpload;
