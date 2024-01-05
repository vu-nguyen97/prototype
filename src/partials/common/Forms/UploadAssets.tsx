import React, { useState } from "react";
import PropTypes from "prop-types";
import InboxOutlined from "@ant-design/icons/lib/icons/InboxOutlined";
import { UPLOAD_PROGRESS_CONFIGS } from "../../../constants/constants";
import Upload, { UploadFile } from "antd/lib/upload";
import { UPLOAD_HINT } from "../../../constants/formMessage";
import {
  getLabelFromCamelCaseStr,
  handleErrorImage,
  reorder,
} from "../../../utils/Helpers";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import classNames from "classnames";
import ImagePreview, { ImgFile } from "../Modal/ImagePreview";
import VideoPopup from "../Modal/VideoPopup";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const ASSET_TYPES = {
  icon: "icon",
  feature: "feature",
  phone: "phone",
  ss7: "ss7",
  ss10: "ss10",
  trash: "trash",
};

const AssetTypes = [
  { name: "App icon", id: ASSET_TYPES.icon, startsWith: "icon" },
  {
    name: "Feature graphic",
    id: ASSET_TYPES.feature,
    startsWith: "feature_graphic",
  },
  {
    name: "7-inch tablet screenshots",
    id: ASSET_TYPES.ss7,
    startsWith: "ss7",
  },
  {
    name: "10-inch tablet screenshots",
    id: ASSET_TYPES.ss10,
    startsWith: "ss10",
  },
  { name: "Phone screenshots", id: ASSET_TYPES.phone, startsWith: "phone" },
  {
    name: "Trash",
    id: ASSET_TYPES.trash,
    startsWith: "",
  },
];

interface AssetsByType {
  id: string;
  name: string;
  files?: UploadFile[];
}

type AssetType = keyof typeof ASSET_TYPES;

export type AssetsData = {
  [key in AssetType]?: AssetsByType;
};

function UploadAssets(props) {
  const { Dragger } = Upload;
  const {
    wrapperClass,
    className,
    isShowLabel,
    isRequireMark,
    label,
    note,
    listFiles,
    onSetListFiles,
    accept,
  } = props;

  const [previewImage, setPreviewImage] = useState<ImgFile>({});
  const [previewVideo, setPreviewVideo] = useState({});
  const [files, setFiles] = useState<UploadFile[]>([]); // Chỉ lưu file

  const beforeUpload = (file, fileList) => {
    let newData: AssetsData = window.structuredClone(listFiles);

    fileList.forEach((file) => {
      const activedObj = AssetTypes.find((el) =>
        file.name?.startsWith(el.startsWith)
      );

      if (activedObj?.id) {
        const oldFiles = newData[activedObj.id]?.files || [];
        newData = {
          ...newData,
          [activedObj.id]: {
            ...newData[activedObj.id],
            files: [...oldFiles, file],
          },
        };
      }
    });

    setFiles([...files, ...fileList]);
    setListFiles(newData);
    return false;
  };

  const onRemove = (file, type: AssetType) => {
    const newFiles = listFiles[type].files.filter((el) => el.uid !== file.uid);

    setFiles(files.filter((el) => el.uid !== file.uid));
    setListFiles({
      ...listFiles,
      [type]: {
        ...listFiles[type],
        files: newFiles,
      },
    });
  };

  const onRemoveGroup = (filesByType, type: AssetType) => {
    setFiles(
      files.filter((el) => !filesByType.some((file) => file.uid === el.uid))
    );
    setListFiles({
      ...listFiles,
      [type]: {
        ...listFiles[type],
        files: [],
      },
    });
  };

  const setListFiles = (files) => {
    onSetListFiles(files);
  };

  const itemRender = (originNode, file, fileList, actions) => {
    return <></>;
  };

  const onSetPreview = (file) => {
    if (!file) return;
    const data = { url: URL.createObjectURL(file), name: file.name };

    if (file.type?.includes("image")) {
      setPreviewImage(data);
    }
    if (file.type?.includes("video") || file.type?.includes("html")) {
      setPreviewVideo(data);
    }
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    // item does not change position
    if (result.source.index === result.destination.index) return;

    const type: AssetType = result.source.droppableId;
    const oldFiles = listFiles[type].files;
    const orderedData = reorder(
      oldFiles,
      result.source.index,
      result.destination.index
    );

    setListFiles({
      ...listFiles,
      [type]: {
        ...listFiles[type],
        files: orderedData,
      },
    });
  };

  return (
    <div className={wrapperClass}>
      {isShowLabel && (
        <div className="">
          {isRequireMark && <span className="text-[#ff4d4f] mr-1 mt-2">*</span>}
          <span className={className}>
            {getLabelFromCamelCaseStr(label, false)}
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
          multiple={true}
          name="file"
          accept={accept}
          progress={UPLOAD_PROGRESS_CONFIGS}
          fileList={files}
          beforeUpload={beforeUpload}
          itemRender={itemRender}
        >
          <p className="ant-upload-drag-icon !mb-0">
            <InboxOutlined className="!text-4xl" />
          </p>
          <p className="ant-upload-text !mb-0 !text-base">
            Click or drag file to this area to upload.
          </p>
          <p className="ant-upload-hint !text-sm">{UPLOAD_HINT}</p>
        </Dragger>

        {Object.keys(listFiles).length > 0 && (
          <div className="grid gap-y-1 gap-x-2 max-h-[380px] overflow-y-auto grid-col-1 md:grid-cols-2">
            {AssetTypes.map((assetObj) => {
              const assetType: any = assetObj.id;
              const activedData = AssetTypes.find(
                (type) => type.id === assetType
              );
              const EmptyEl = <React.Fragment key={assetType} />;
              if (!activedData) return EmptyEl;

              const files = listFiles[assetType]?.files;
              if (!files?.length) return EmptyEl;

              return (
                <div key={assetType}>
                  <div className="flex justify-between items-center mt-4 group">
                    <div className="font-bold">{activedData.name}</div>
                    <div
                      title="Remove all"
                      className="hidden group-hover:block cursor-pointer pr-[15px]"
                      onClick={() => onRemoveGroup(files, assetType)}
                    >
                      <DeleteOutlined />
                    </div>
                  </div>

                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={assetType}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {files.map((file, id) => {
                            const assetUrl = URL.createObjectURL(file);
                            const assetClass =
                              "h-8 w-8 object-cover rounded-sm cursor-pointer shrink-0";

                            return (
                              <Draggable
                                key={file.uid}
                                draggableId={file.uid}
                                index={id}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={classNames(
                                      "px-2.5 py-2 rounded-sm border flex items-center justify-between bg-white",
                                      id ? "mt-1.5" : "mt-1"
                                    )}
                                  >
                                    {file.type?.includes("image") && (
                                      <img
                                        className={assetClass}
                                        src={assetUrl}
                                        alt=" "
                                        referrerPolicy="no-referrer"
                                        onError={handleErrorImage}
                                        onClick={() => onSetPreview(file)}
                                        title="Click to view the image"
                                      />
                                    )}
                                    <div
                                      className="grow truncate ml-2 cursor-pointer max-w-[320px] xs:max-w-[450px] md:max-w-none mr-auto"
                                      onClick={() => onSetPreview(file)}
                                    >
                                      {file.name}
                                    </div>
                                    <DeleteOutlined
                                      title="Remove file"
                                      className="pl-2 pr-1 cursor-pointer"
                                      onClick={() => onRemove(file, assetType)}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              );
            })}
          </div>
        )}

        <ImagePreview
          imgPreview={previewImage}
          setImgPreview={setPreviewImage}
        />
        <VideoPopup
          previewData={previewVideo}
          onClose={() => setPreviewVideo({})}
        />
      </div>
    </div>
  );
}

UploadAssets.defaultProps = {
  accept: ".png, .jpeg",
  wrapperClass: "mb-6",
  isShowLabel: true,
  isRequireMark: true,
  listFiles: {},
};

UploadAssets.propTypes = {
  accept: PropTypes.string,
  wrapperClass: PropTypes.string,
  className: PropTypes.string,
  isShowLabel: PropTypes.bool,
  isRequireMark: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  note: PropTypes.string,
  listFiles: PropTypes.object,
  onSetListFiles: PropTypes.func,
};

export default UploadAssets;

export const getAssets = (listFiles) => {
  const { icon, feature, phone, ss7, ss10, trash } = listFiles;
  let assets: any = [];

  const updateFile = (data) => {
    if (!data?.files?.length) return;
    assets = [...assets, ...data.files];
  };

  updateFile(icon);
  updateFile(feature);
  updateFile(phone);
  updateFile(ss7);
  updateFile(ss10);

  return assets;
};
